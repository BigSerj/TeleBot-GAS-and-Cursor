// TODO: import { CALLBACK_QUERY_TYPES } from '../constants/callbacks';
// TODO: Импорты
// import * as Formatters from '../utils/formatters';
// import * as StateService from '../services/stateService';
// import * as TelegramService from '../services/telegramService';
// import * as RegistrationService from '../services/registrationService'; 

function handleCallbackQuery(callbackQuery) { 
  // Достаем основные данные
  const callbackQueryId = callbackQuery.id;
  const userId = callbackQuery.from.id;
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const callbackData = callbackQuery.data;

  // Парсим callback_data
  const parsedData = Formatters.parseCallbackData(callbackData);

  if (!parsedData) {
    Logger.log('Не удалось распарсить callback_data: ' + callbackData + ' от пользователя ' + userId);
    // Отвечаем на колбэк, чтобы убрать часики, но сообщаем об ошибке
    TelegramService.answerCallbackQuery(callbackQueryId, "Ошибка обработки данных кнопки.", true); 
    return;
  }

  // Маршрутизация по типу (t)
  switch (parsedData.t) { // t = type
    case CALLBACK_TYPES.REGISTRATION:
      handleRegistrationCallback(parsedData, userId, chatId, callbackQueryId);
      break;
      
    case CALLBACK_TYPES.SETTINGS:
      handleSettingsCallback(parsedData, userId, chatId, messageId, callbackQueryId);
      break;

    // TODO: Добавить обработку других типов колбэков
    default:
      Logger.log('Получен неизвестный тип callback_data: ' + parsedData.t + ' от пользователя ' + userId);
      TelegramService.answerCallbackQuery(callbackQueryId, "Неизвестный тип кнопки.", true);
      break;
  }
}

// --- Обработчик колбэков регистрации --- 
function handleRegistrationCallback(parsedData, userId, chatId, callbackQueryId) {
   // Действие (approve/reject) находится в parsedData.a
   // ID целевого пользователя в parsedData.d.targetUserId
   const action = parsedData.a;
   const targetUserId = parsedData.d ? parsedData.d.targetUserId : null;
   const adminUserId = userId; // Тот, кто нажал кнопку

   Logger.log('Обработка registration callback: action=' + action + ', targetUserId=' + targetUserId + ', adminUserId=' + adminUserId);

   if (!targetUserId) {
       Logger.log('Ошибка: в callback_data регистрации отсутствует targetUserId.');
       TelegramService.answerCallbackQuery(callbackQueryId, "Ошибка: Не найден ID пользователя для обработки.", true);
       return;
   }

   if (action === CALLBACK_ACTIONS.APPROVE) {
       RegistrationService.approveUser(targetUserId, adminUserId); 
       // answerCallbackQuery вызывается внутри approveUser
   } else if (action === CALLBACK_ACTIONS.REJECT) {
       RegistrationService.rejectUser(targetUserId, adminUserId);
       // answerCallbackQuery вызывается внутри rejectUser
   } else {
       Logger.log('Неизвестное действие в callback_data регистрации: ' + action);
       TelegramService.answerCallbackQuery(callbackQueryId, "Неизвестное действие.", true);
   }
}

// --- Обработчик колбэков настроек --- 
function handleSettingsCallback(parsedData, userId, chatId, messageId, callbackQueryId) {
  const action = parsedData.a; 
  const data = parsedData.d;   

  switch (action) {
    case CALLBACK_ACTIONS.SELECT_OPTION:
      const option = data ? data.option : null; 
      if (!option) {
         Logger.log('Ошибка: в callback_data настроек отсутствует option.');
         TelegramService.answerCallbackQuery(callbackQueryId, "Ошибка: Не указан параметр для изменения.", true);
         return;
      }

      let promptText = "";
      let stateToSet = "";

      switch (option) {
        case SETTINGS_OPTIONS.NAME:
          promptText = "Введите новое ФИО (Фамилия Имя):";
          stateToSet = USER_STATES.SETTINGS_AWAITING_NAME;
          break;
        case SETTINGS_OPTIONS.PHONE:
          promptText = "Введите новый номер телефона (9 цифр, например 291112233):";
          stateToSet = USER_STATES.SETTINGS_AWAITING_PHONE;
          break;
        case SETTINGS_OPTIONS.GMAIL:
          promptText = "Введите новый Gmail адрес:";
          stateToSet = USER_STATES.SETTINGS_AWAITING_GMAIL;
          break;
        default:
           Logger.log('Неизвестная опция в callback_data настроек: ' + option);
           TelegramService.answerCallbackQuery(callbackQueryId, "Неизвестная опция.", true);
           return;
      }

      StateService.setUserState(userId, stateToSet);
      TelegramService.sendText(chatId, promptText);
      TelegramService.answerCallbackQuery(callbackQueryId);
      TelegramService.deleteMessage(chatId, messageId);
      break;

    case CALLBACK_ACTIONS.CANCEL:
      TelegramService.deleteMessage(chatId, messageId);
      TelegramService.answerCallbackQuery(callbackQueryId, "Отменено");
      break;

    default:
       Logger.log('Неизвестное действие в callback_data настроек: ' + action);
       TelegramService.answerCallbackQuery(callbackQueryId, "Неизвестное действие.", true);
       break;
  }
} 