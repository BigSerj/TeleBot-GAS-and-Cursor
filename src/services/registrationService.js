// --- Сервис для управления процессом регистрации --- 

// TODO: Добавить импорты констант, UserService, TelegramService, PermissionService
// import { REGISTRATION_STAGE, USER_ACCESS, EMPLOYMENT_STATUS } from '../constants/statuses';
// import { USER_OBJECT_PARAMETERS_FOR_READ_WRITE } from '../constants/???'; // Где определены эти константы?
// import * as UserService from './userService';
// import * as TelegramService from './telegramService';
// import * as PermissionService from './permissionService';
// import * as Validators from '../utils/validators';
// import * as Formatters from '../utils/formatters';
// import { MainLibrary } from '???'; // Если используется внешняя библиотека

// Статусы, возвращаемые функцией handleRegistrationStep
const REGISTRATION_STATUS = {
  CONTINUE: 'continue', // Регистрация продолжается, запрошен следующий шаг
  COMPLETE_WAIT_APPROVAL: 'complete_wait_approval', // Регистрация завершена, ожидается одобрение
  ALREADY_REGISTERED: 'already_registered', // Пользователь уже зарегистрирован
  ERROR_VALIDATION: 'error_validation', // Ошибка валидации ввода
  ERROR_GMAIL_CHECK: 'error_gmail_check', // Ошибка при проверке Gmail
  ERROR_GENERAL: 'error_general' // Общая ошибка
};
Object.freeze(REGISTRATION_STATUS);

// Основная функция обработки шага регистрации
// Принимает объект пользователя и введенный текст
// Возвращает статус из REGISTRATION_STATUS
function handleRegistrationStep(user, messageText, chatId) {
  try {
    const currentStage = user.getRegistrationStage();
    
    // TODO: Заменить на константы USER_OBJECT_PARAMETERS_FOR_READ_WRITE
    const PARAM_NAME = 'nameMy'; 
    const PARAM_TEL = 'telephs';
    const PARAM_GMAIL = 'gmail';

    if (!currentStage || user.getAccessStatus() === USER_ACCESS.UNKNOWN) { // Начинаем регистрацию
      let text1 = getTextForInputUserParameterByUserStates(PARAM_NAME).text1; // TODO: Получать текст из констант/сервиса
      TelegramService.sendText(chatId, text1);
      user.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_NAME_MY);
      UserService.setUser(user); // Сохраняем промежуточное состояние
      return REGISTRATION_STATUS.CONTINUE;
    } else if (currentStage === REGISTRATION_STAGE.WAITING_INPUT_NAME_MY) {
      const formattedName = Formatters.formatFullName(messageText); // Используем форматер
      if (!Validators.validateFullName(formattedName)) {
        let mistText = getTextOfMistakeInputUserParameterByUserStates(PARAM_NAME).text1;
        TelegramService.sendText(chatId, mistText);
        return REGISTRATION_STATUS.ERROR_VALIDATION;
      }
      user.setNameMy(formattedName);
      let text1 = getTextForInputUserParameterByUserStates(PARAM_TEL).text1;
      TelegramService.sendText(chatId, text1);
      user.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_TEL);
      UserService.setUser(user);
      return REGISTRATION_STATUS.CONTINUE;
    } else if (currentStage === REGISTRATION_STAGE.WAITING_INPUT_TEL) {
      const validatedPhone = Validators.validatePhoneNumber(messageText);
      if (!validatedPhone) {
        let mistText = getTextOfMistakeInputUserParameterByUserStates(PARAM_TEL).text1;
        TelegramService.sendText(chatId, mistText);
        return REGISTRATION_STATUS.ERROR_VALIDATION;
      }
      user.addTelephoneNumber("+375" + validatedPhone); // Сохраняем в международном формате
      let text1 = getTextForInputUserParameterByUserStates(PARAM_GMAIL).text1;
      TelegramService.sendText(chatId, text1);
      user.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_GMAIL);
      UserService.setUser(user);
      return REGISTRATION_STATUS.CONTINUE;
    } else if (currentStage === REGISTRATION_STAGE.WAITING_INPUT_GMAIL) {
      const formattedGmail = Formatters.formatEmail(messageText);
      if (!Validators.validateGmailAddress(formattedGmail)) {
        let mistText = getTextOfMistakeInputUserParameterByUserStates(PARAM_GMAIL).text1;
        TelegramService.sendText(chatId, mistText);
        return REGISTRATION_STATUS.ERROR_VALIDATION;
      }
      if (!Validators.checkGmailExists(formattedGmail)) {
        let mistText = getTextOfMistakeInputUserParameterByUserStates(PARAM_GMAIL).text2;
        TelegramService.sendText(chatId, mistText);
        return REGISTRATION_STATUS.ERROR_GMAIL_CHECK;
      }
      user.addGmail(formattedGmail);
      let text1 = "Спасибо! Ваши данные отправлены на проверку администратору. Ожидайте подтверждения.";
      TelegramService.sendText(chatId, text1);
      user.setRegistrationStage(REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER);
      UserService.setUser(user);
      sendVerificationRequest(user);
      return REGISTRATION_STATUS.COMPLETE_WAIT_APPROVAL; 
    } else if (currentStage === REGISTRATION_STAGE.REGISTERED) {
      // Пользователь уже зарегистрирован
      return REGISTRATION_STATUS.ALREADY_REGISTERED;
    } else {
       Logger.log('Неизвестный этап регистрации: ' + currentStage + ' для пользователя ' + user.getTelegrId());
       return REGISTRATION_STATUS.ERROR_GENERAL;
    }
  } catch (e) {
    Logger.log('Ошибка в handleRegistrationStep для пользователя ' + user.getTelegrId() + ': ' + e);
    // TODO: Отправить сообщение об ошибке пользователю?
    return REGISTRATION_STATUS.ERROR_GENERAL;
  }
}

// --- УДАЛЕНО --- Закомментированная старая функция
/*
function registrationStageWaitingInputNameT( unknownUser ){
  // ... 
}
*/

// --- УДАЛЕНО --- Закомментированный блок с определениями валидаторов
// const Validators = {
//   validateFullName: function(input) { ... },
//   validatePhoneNumber: function(input) { ... },
//   validateGmailAddress: function(email) { ... },
//   checkGmailExists: function(email) { ... },
//   isValidInputtedNumberNameT: function( messageText, buttonsObjsArr ) { ... }
// };


// --- Отправка запроса на верификацию --- 
function sendVerificationRequest(user){ // Принимает объект user
  try {
    let textMess = "Новый пользователь на верификацию:";
    textMess += "\nФИО: " + user.getNameMy();
    textMess += "\nGmail: " + (user.getGmailsArr()[0] || '-');
    textMess += "\nТелефон: " + (user.getTelephoneNumberArr()[0] || '-');
    textMess += "\n\nОдобрить доступ?"
    
    const approverIds = PermissionService.getRegistrationApproverIds(); 
    if (!approverIds || approverIds.length === 0) {
        Logger.log('Нет пользователей для отправки запроса на верификацию!');
        return;
    }
    
    const keyboard = { 
      inline_keyboard: [[
        { text: "✅ Одобрить", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.REGISTRATION, CALLBACK_ACTIONS.APPROVE, { targetUserId: user.getTelegrId() }) },
        { text: "❌ Отклонить", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.REGISTRATION, CALLBACK_ACTIONS.REJECT, { targetUserId: user.getTelegrId() }) }
      ]]
    };

    approverIds.forEach(adminId => {
        TelegramService.sendText( adminId, textMess, keyboard );
    });

  } catch (e) {
    Logger.log('Ошибка в sendVerificationRequest для пользователя ' + user.getTelegrId() + ': ' + e);
  }
}

// --- Функции обработки одобрения/отклонения (вызываются из обработчика колбэков) ---

// Одобряет пользователя
function approveUser(targetUserId, adminUserId) { // Принимает ID цели и ID админа
  try {
    const targetUser = UserService.getUser(targetUserId);
    const adminUser = UserService.getUser(adminUserId);

    if (!targetUser) {
      Logger.log('approveUser: Пользователь ' + targetUserId + ' не найден.');
      TelegramService.sendText(adminUserId, "Ошибка: одобряемый пользователь не найден.");
      return false;
    }

    if (targetUser.getRegistrationStage() !== REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER) {
      let text1 = "Пользователю " + targetUser.getNameMy() + " уже был изменен статус.";
      if (targetUser.getRegistrationStage() === REGISTRATION_STAGE.REGISTERED) text1 += " (Доступ открыт)";
      else if (targetUser.getAccessStatus() === USER_ACCESS.BLOCKED) text1 += " (Доступ заблокирован)";
      else text1 += " (Текущий статус: " + targetUser.getRegistrationStage() + ")";
      TelegramService.sendText(adminUserId, text1);
      return false; 
    }

    // Устанавливаем финальные статусы
    targetUser.setRegistrationStage(REGISTRATION_STAGE.REGISTERED);
    targetUser.setAccessStatus(USER_ACCESS.USER);
    targetUser.setEmpoyeeStatus(EMPLOYMENT_STATUS.INTERN);
    targetUser.setDateOfEmploymentInMillis(); 
    
    if (!UserService.setUser( targetUser )) {
        Logger.log('approveUser: Ошибка сохранения пользователя ' + targetUserId);
        TelegramService.sendText(adminUserId, "Ошибка: не удалось сохранить изменения для пользователя.");
        return false;
    }
    
    // Уведомление пользователю
    let textToUser = "✅ Доступ предоставлен! Добро пожаловать!";
    // TODO: Отправлять ссылки на чаты?
    TelegramService.sendText(targetUser.getTelegrId(), textToUser);

    // Уведомление администраторам
    const adminName = adminUser ? adminUser.getNameMy() : adminUserId;
    let textToAdmin = "✅ Доступ открыт для: " + targetUser.getNameMy();
    textToAdmin += "\n(Одобрил: " + adminName + ")";
        
    const notifyIds = PermissionService.getUserIdsToNotifyAboutRegistration();
    notifyIds.forEach(id => {
        if (String(id) !== String(adminUserId)) { 
             TelegramService.sendText(id, textToAdmin);
        }
    });
    TelegramService.answerCallbackQuery(null, "Доступ для " + targetUser.getNameMy() + " одобрен.", false);
    
    return true;

  } catch (e) {
    Logger.log('Ошибка в approveUser для пользователя ' + targetUserId + ', админ ' + adminUserId + ': ' + e);
    TelegramService.sendText(adminUserId, "Произошла системная ошибка при одобрении пользователя.");
    return false;
  }
}

// Отклоняет пользователя
function rejectUser(targetUserId, adminUserId) { // Принимает ID цели и ID админа
   try {
    const targetUser = UserService.getUser(targetUserId);
    const adminUser = UserService.getUser(adminUserId);

    if (!targetUser) {
      Logger.log('rejectUser: Пользователь ' + targetUserId + ' не найден.');
      TelegramService.sendText(adminUserId, "Ошибка: отклоняемый пользователь не найден.");
      return false;
    }

    if (targetUser.getRegistrationStage() !== REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER) {
      let text1 = "Пользователю " + targetUser.getNameMy() + " уже был изменен статус.";
       if (targetUser.getRegistrationStage() === REGISTRATION_STAGE.REGISTERED) text1 += " (Доступ открыт)";
       else if (targetUser.getAccessStatus() === USER_ACCESS.BLOCKED) text1 += " (Доступ заблокирован)";
       else text1 += " (Текущий статус: " + targetUser.getRegistrationStage() + ")";
      TelegramService.sendText(adminUserId, text1);
      return false; 
    }

    // Устанавливаем статус "Заблокирован"
    targetUser.setAccessStatus(USER_ACCESS.BLOCKED);
    // TODO: Нужно ли менять registrationStage? Возможно, оставить WAITING_VERIFICATION?
    UserService.setUser( targetUser )

    // Уведомление пользователю
    let textToUser = "❌ Вам было отказано в доступе.";
    TelegramService.sendText(targetUser.getTelegrId(), textToUser);

    // Уведомление администраторам
    const adminName = adminUser ? adminUser.getNameMy() : adminUserId;
    let textToAdmin = "❌ Доступ отклонен для: " + targetUser.getNameMy();
    textToAdmin += "\n(Отклонил: " + adminName + ")";
    
    const notifyIds = PermissionService.getUserIdsToNotifyAboutRegistration();
     notifyIds.forEach(id => {
        if (String(id) !== String(adminUserId)) { 
             TelegramService.sendText(id, textToAdmin);
        }
    });
    Telegram.answerCallbackQuery(null, "Доступ для " + targetUser.getNameMy() + " отклонен.", false);

    return true;

  } catch (e) {
     Logger.log('Ошибка в rejectUser для пользователя ' + targetUserId + ', админ ' + adminUserId + ': ' + e);
    TelegramService.sendText(adminUserId, "Произошла системная ошибка при отклонении пользователя.");
    return false;
  }
} 