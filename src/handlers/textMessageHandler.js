// TODO: Импорты
// import * as UserService from '../services/userService';
// import * as TelegramService from '../services/telegramService';
// import * as RegistrationService from '../services/registrationService';
// import * as PermissionService from '../services/permissionService';
// import * as MenuUtils from '../utils/menuUtils';
// import * as StateService from '../services/stateService';
// import { DEVELOPER_TELEGRAM_ID } from '../constants/ids';
// import { User } from '../core/User';

// !!! ВАЖНО: Убрать эту функцию из глобальной области видимости !!!
// Она должна вызываться только из doPost
// function handleTextMessage( message ) { // Принимает объект message
function contextMessageText( message ) { // Пока оставляем старое имя

  const userId = message.from.id;
  let messageText = message.text;
  const chatId = message.chat.id;

  // Получаем пользователя
  let user = UserService.getUser(userId);

  // Обработка caption для фото
  if (message.photo != undefined) {
    messageText = message.caption;
  }

  // TODO: Удалить тестовый блок isCurr полностью
  /*
  if (isCurr==1)
    user = UserService.getUser( userId )
  else{
    // ... тестовый код ... 
  }
  */

  if (!messageText) {
      messageText = ''; // На случай пустого сообщения или только фото без подписи
  }

  // --- 1. Проверка текущего состояния пользователя --- 
  const currentStateData = StateService.getUserState(userId);
  if (currentStateData) {
      // Если пользователь в состоянии ожидания ввода, передаем управление обработчику состояний
      handleStateInput(currentStateData, user, messageText, chatId);
      return; // Прерываем дальнейшую обработку в contextMessageText
  }

  // --- 2. Логика для разработчика --- 
  // Гарантированное присвоение статуса разработчика (только если ID совпадает)
  if (String(userId) === String(DEVELOPER_TELEGRAM_ID)) { // Сравниваем строки
    if (!user) {
      user = new User(userId);
      Logger.log('Создан новый объект User для разработчика.');
    }
    // Проверяем и устанавливаем статус, если нужно
    if (user.getAccessStatus() !== USER_ACCESS.DEVELOPER) { 
      user.setAccessStatus(USER_ACCESS.DEVELOPER);
      // TODO: Возможно, нужно установить и другие начальные статусы/роли для разработчика?
      if (UserService.setUser(user)) {
         Logger.log('Пользователю ' + userId + ' присвоен статус разработчика.');
      } else {
         Logger.log('Ошибка сохранения статуса разработчика для пользователя ' + userId);
         // TODO: Обработать ошибку? Отправить сообщение?
         TelegramService.sendText(chatId, "Произошла ошибка при настройке вашего аккаунта разработчика.");
         return; // Прерываем обработку
      }
    }
  } 
  // --- Конец логики для разработчика ---

  // --- 3. Проверки статуса и этапа регистрации ---
  let isNeedRegistration = false;
  if (user) {
    // Проверка статуса доступа
    if (user.getAccessStatus() === USER_ACCESS.BLOCKED){
      TelegramService.eraseBurgerMenu( chatId );
      TelegramService.sendText(chatId,"Вам заблокирован доступ.");
      return;
    }
    // Проверка статуса сотрудника
    if (user.getEmpoyeeStatus() === EMPLOYMENT_STATUS.FIRED){
      TelegramService.eraseBurgerMenu( chatId );
      TelegramService.sendText(chatId,"Вы были удалены из актуального списка сотрудников компании.\nОбратитесь к руководству.");
      return;
    }
    // Проверка стадии регистрации
    if (user.getRegistrationStage() === REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER){
      // Не удаляем меню, возможно, у ожидающих есть какие-то команды?
      // TelegramService.eraseBurgerMenu( chatId ); 
      TelegramService.sendText(chatId,"Ожидайте открытия доступа.\nПри длительном отсутствии доступа обратитесь к руководству.");
      return;
    }
    // Нужна ли регистрация? (Если статус неизвестный)
    if (user.getAccessStatus() === USER_ACCESS.UNKNOWN) {
      isNeedRegistration = true;
    }
  } else {
    // Пользователя нет в базе - нужна регистрация
    isNeedRegistration = true;
    // Создаем временный объект User для процесса регистрации
    user = new User(userId); 
  }

  // --- 4. Запуск/продолжение регистрации --- 
  if (isNeedRegistration){
    TelegramService.eraseBurgerMenu( chatId ); // Убираем меню на время регистрации
    
    // Вызываем сервис регистрации, передавая текущий объект user
    const registrationResult = RegistrationService.handleRegistrationStep(user, messageText, chatId);
    
    // Обрабатываем результат
    // TODO: Использовать константы из RegistrationService.REGISTRATION_STATUS
    if (registrationResult === 'continue' || registrationResult === 'error_validation' || registrationResult === 'error_gmail_check') {
      // Регистрация продолжается или произошла ошибка валидации/проверки,
      // сообщение пользователю уже отправлено из handleRegistrationStep.
      // Просто завершаем обработку этого сообщения.
      return; 
    } else if (registrationResult === 'complete_wait_approval') {
       // Регистрация завершена, пользователь сохранен со статусом ожидания.
       // Сообщение "ожидайте верификации" и запрос админам отправлены из handleRegistrationStep.
       return;
    } else if (registrationResult === 'already_registered') {
        // Эта ситуация не должна возникать, если isNeedRegistration=true
        Logger.log('Логическая ошибка: isNeedRegistration=true, но handleRegistrationStep вернул already_registered для user ' + userId);
        TelegramService.sendText(chatId, "Произошла системная ошибка регистрации. Пожалуйста, попробуйте позже или обратитесь к администратору.");
        return;
    } else { // error_general или неизвестный статус
        TelegramService.sendText(chatId, "Произошла системная ошибка при обработке вашего сообщения. Пожалуйста, попробуйте позже или обратитесь к администратору.");
        return;
    }
  }

  // --- 5. Логика для зарегистрированных пользователей (если не в состоянии и не в процессе регистрации) ---
  
  // TODO: Здесь была проверка состояний старого типа. Удаляем?
  /*
  let userCurrStates = new UserStatesTgClass( USER_STATES.getByTgId(user.getTelegrId()) ) // TODO: Заменить UserStatesClass
  if (userCurrStates.getWaitAnswerCode() == USER_STATUSES_MEMORY_ANSWER.waitAnswerCode.changeParametersOfUserStep1){ 
     // ... логика изменения параметров ...
    return
  }
  */

  // --- Обработка команд бургер-меню --- 
  
  // 1. Устанавливаем/обновляем команды в меню Telegram
  const availableCommandKeys = PermissionService.getAvailableMenuCommands(user);
  const commandObjects = MenuUtils.buildCommandObjectsArray(availableCommandKeys);
  TelegramService.setMyCommands(commandObjects, { type: "chat", chat_id: chatId }); 
  
  // 2. Обрабатываем введенный текст как команду меню (если это она)
  const commandText = messageText.startsWith('/') ? messageText.substring(1) : messageText;
  
  if (availableCommandKeys.includes(commandText)) {
      handleMenuCommand(commandText, user, chatId);
  } else {
      // TODO: Обработка обычного текста или неизвестной команды?
      // Если пользователь не в состоянии и ввел не команду - что делать?
      Logger.log('Получен обычный текст (не команда и не ответ на состояние): ' + messageText + ' от пользователя ' + userId);
      TelegramService.sendText(chatId, "Извините, я не понимаю эту команду или текст."); // Пример ответа
  }

}

// --- Обработчик ввода в определенном состоянии --- 
function handleStateInput(stateData, user, messageText, chatId) {
  const { currentState, context } = stateData;
  const userId = user.getTelegrId(); // Получаем ID пользователя

  Logger.log('Обработка ввода для состояния: ' + currentState + ' от пользователя ' + userId + ' с текстом: ' + messageText);

  // --- Обработка состояний настроек --- 
  if (currentState === USER_STATES.SETTINGS_AWAITING_NAME) {
    const newName = Formatters.formatFullName(messageText);
    if (Validators.validateFullName(newName)) {
        user.setNameMy(newName);
        if (UserService.setUser(user)) { // Проверяем успешность сохранения
          TelegramService.sendText(chatId, '✅ ФИО успешно изменено на: ' + newName);
          StateService.clearUserState(userId);
        } else {
          TelegramService.sendText(chatId, '❌ Произошла ошибка при сохранении ФИО. Попробуйте позже.');
          StateService.clearUserState(userId); // Сбрасываем состояние в любом случае?
        }
    } else {
        TelegramService.sendText(chatId, '❌ Некорректный формат ФИО. Требуется Фамилия Имя (с большой буквы). Попробуйте еще раз:');
        // Не сбрасываем состояние, ждем повторного ввода
    }
    return; // Завершаем обработку
  }
  
  if (currentState === USER_STATES.SETTINGS_AWAITING_PHONE) {
    const newPhone = Validators.validatePhoneNumber(messageText);
    if (newPhone) {
       // TODO: Проверить, возможно, нужно удалять старый номер или обрабатывать несколько номеров?
       // Пока просто добавляем новый
       user.clearTelephoneNumbers(); // Очищаем старые для простоты
       user.addTelephoneNumber("+375" + newPhone);
       if (UserService.setUser(user)) {
          TelegramService.sendText(chatId, '✅ Телефон успешно изменен на: +375' + newPhone);
          StateService.clearUserState(userId);
       } else {
          TelegramService.sendText(chatId, '❌ Произошла ошибка при сохранении телефона. Попробуйте позже.');
          StateService.clearUserState(userId);
       }
    } else {
       TelegramService.sendText(chatId, '❌ Некорректный формат телефона. Требуется 9 цифр (например, 291112233). Попробуйте еще раз:');
       // Не сбрасываем состояние
    }
    return; // Завершаем обработку
  }

  if (currentState === USER_STATES.SETTINGS_AWAITING_GMAIL) {
    const newGmail = Formatters.formatEmail(messageText);
    if (Validators.validateGmailAddress(newGmail)) {
       // TODO: Проверка существования Gmail? (Validators.checkGmailExists) - возможно, стоит убрать из настроек?
       // if (!Validators.checkGmailExists(newGmail)) {
       //    TelegramService.sendText(chatId, '❌ Не удалось подтвердить существование Gmail аккаунта. Проверьте правильность ввода или попробуйте позже.');
       //    return; 
       // }
       
       // TODO: Удалять старый или добавлять?
       user.clearGmails(); // Очищаем старые
       user.addGmail(newGmail);
       if (UserService.setUser(user)) {
          TelegramService.sendText(chatId, '✅ Gmail успешно изменен на: ' + newGmail);
          StateService.clearUserState(userId);
       } else {
          TelegramService.sendText(chatId, '❌ Произошла ошибка при сохранении Gmail. Попробуйте позже.');
          StateService.clearUserState(userId);
       }
    } else {
       TelegramService.sendText(chatId, '❌ Некорректный формат Gmail адреса (требуется @gmail.com). Попробуйте еще раз:');
       // Не сбрасываем состояние
    }
    return; // Завершаем обработку
  }

  // --- Обработка других состояний (если будут) --- 
  /*
  if (currentState === 'another_state') {
    // ...
  }
  */

  // --- Если состояние не обработано выше --- 
  Logger.log('Получен ввод для необработанного состояния: ' + currentState + ' от пользователя ' + userId);
  TelegramService.sendText(chatId, 'Произошла ошибка при обработке вашего ответа (неизвестное состояние). Состояние сброшено.');
  StateService.clearUserState(userId);
}

// --- Обработчик конкретных команд меню --- 
// (Эту функцию можно вынести в отдельный файл/сервис MenuHandler.js)
function handleMenuCommand(command, user, chatId) {
  // Использует константы MENU_COMMANDS из constants/commands.js
  Logger.log('Обработка команды меню: ' + command + ' для пользователя ' + user.getTelegrId());

  switch(command) {
    case MENU_COMMANDS.START:
      TelegramService.sendText(chatId, "Добро пожаловать, " + user.getNameMy() + "!");
      break;
    case MENU_COMMANDS.MAIN:
      // Получаем и форматируем данные пользователя
      const userName = user.getNameMy() || "Пользователь";
      const position = Formatters.getEmployeePositionName(user.getEmpoyeePosition()) || "-";
      const department = Formatters.getDepartmentName(user.getDepartment()) || "-";
      
      // Формируем текст сообщения
      let mainText = `Главное меню 🏠\n`;
      mainText += `\n👤 ${userName}`;
      mainText += `\n🛠 Должность: ${position}`;
      mainText += `\n🏢 Отдел: ${department}`;
      // TODO: Добавить другую важную информацию? (Статус, дата найма?)
      mainText += `\n\nИспользуйте команды меню для навигации.`;

      // TODO: Добавить кнопки для частых действий?
      // const mainKeyboard = { inline_keyboard: [[ { text: "Штрафы", callback_data: ... }, { text: "Настройки", callback_data: ... } ]] };

      TelegramService.sendText(chatId, mainText);
      break;
    case MENU_COMMANDS.PENALTIES:
      // TODO: Реализовать логику отображения штрафов
      TelegramService.sendText(chatId, "Раздел  штрафов в разработке.");
      break;
    case MENU_COMMANDS.SETTINGS:
      // Использует CALLBACK_TYPES.SETTINGS, CALLBACK_ACTIONS.*, SETTINGS_OPTIONS.* из constants/callbacks.js
      const settingsText = "⚙️ Настройки\n\nЧто вы хотите изменить?";
      const settingsKeyboard = {
        inline_keyboard: [
          [
            { text: "👤 Изменить ФИО", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.SETTINGS, CALLBACK_ACTIONS.SELECT_OPTION, { option: SETTINGS_OPTIONS.NAME }) }
          ],
          [
            { text: "📞 Изменить телефон", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.SETTINGS, CALLBACK_ACTIONS.SELECT_OPTION, { option: SETTINGS_OPTIONS.PHONE }) }
          ],
          [
            { text: "✉️ Изменить Gmail", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.SETTINGS, CALLBACK_ACTIONS.SELECT_OPTION, { option: SETTINGS_OPTIONS.GMAIL }) }
          ],
          [
             { text: "❌ Отмена", callback_data: Formatters.createCallbackData(CALLBACK_TYPES.SETTINGS, CALLBACK_ACTIONS.CANCEL, {}) }
          ]
        ]
      };
      TelegramService.sendText(chatId, settingsText, settingsKeyboard);
      break;
    case MENU_COMMANDS.SETTINGS_ADMIN:
    case MENU_COMMANDS.SETTINGS_ADMIN2:
       if (PermissionService.isAdmin(user)) { 
           // TODO: Реализовать админские настройки
           TelegramService.sendText(chatId, "Админские настройки (команда: " + command + ") в разработке.");
       } else {
            TelegramService.sendText(chatId, "У вас нет доступа к этим настройкам.");
       }
      break;
    case MENU_COMMANDS.SETTINGS_OWNER:
    case MENU_COMMANDS.SETTINGS_OWNER2:
       if (user.getEmpoyeePosition() === EMPLOYEES_HIERARHY.OWNER || user.getAccessStatus() === USER_ACCESS.DEVELOPER) { 
            // TODO: Реализовать настройки владельца
            TelegramService.sendText(chatId, "Настройки владельца (команда: " + command + ") в разработке.");
       } else {
            TelegramService.sendText(chatId, "У вас нет доступа к этим настройкам.");
       }
      break;
    default:
       Logger.log('Неизвестная команда меню в handleMenuCommand: ' + command);
      TelegramService.sendText(chatId, "Команда " + command + " пока не реализована.");
      break;
  }
} 