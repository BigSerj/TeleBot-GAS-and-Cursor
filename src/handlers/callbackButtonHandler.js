// Обработчик для callback-ов типа 'button' (регистрация и, возможно, другие)
// TODO: import { CALLBACK_ACTIONS } from '../constants/callbacks';
// TODO: import * as RegistrationService from '../services/registrationService';
// TODO: import * as TelegramService from '../services/telegramService';

function handleCallbackButton(userId,chatId,callbackData,messageId,messageText,buttonObj) {

  // Извлекаем действие и ID целевого пользователя из buttonObj
  const action = buttonObj.subChapter1Numb; // TODO: Использовать имя поля из парсера callbackData
  const targetUserId = buttonObj.curr_user_telegramId; // TODO: Использовать имя поля
  const adminUserId = userId; // Пользователь, нажавший кнопку

  // TODO: Определить константы в src/constants/callbacks.js
  const CALLBACK_ACTIONS = { 
    REGISTRATION_START: 10, // Примерное значение, нужно уточнить
    REGISTRATION_APPROVE: 11, 
    REGISTRATION_REJECT: 12,
    REGISTRATION_MESSAGE_PROCESSED: 100 // Примерное значение
  };

  if (action == CALLBACK_ACTIONS.REGISTRATION_START) { 
    // TODO: Уточнить назначение этого действия. 
    // Вызов registration2 здесь по-прежнему выглядит нелогично.
    // Возможно, этот колбэк вообще не нужен?
    // registration2( chatId, messageText ) 
    Logger.log('Обработан callback REGISTRATION_START (действие 10) - требует уточнения.');
    return
  }
  
  // Одобрение регистрации
  if (action == CALLBACK_ACTIONS.REGISTRATION_APPROVE){ 
    // Обновляем исходное сообщение у админа (убираем кнопки)
    TelegramService.editMessageReplyMarkup(chatId, messageId, null); // Передаем null для удаления клавиатуры
    // Вызываем сервис регистрации для одобрения
    RegistrationService.approveUser( targetUserId, adminUserId );
    // TODO: Добавить обработку результата (true/false)
    return
  }

  // Отклонение регистрации
  if (action == CALLBACK_ACTIONS.REGISTRATION_REJECT){ 
    // Обновляем исходное сообщение у админа (убираем кнопки)
    TelegramService.editMessageReplyMarkup(chatId, messageId, null);
    // Вызываем сервис регистрации для отклонения
    RegistrationService.rejectUser( targetUserId, adminUserId );
    // TODO: Добавить обработку результата (true/false)
    return
  }
  
  // Логируем необработанные действия для этого типа кнопки
  Logger.log("Unknown button action number: " + action);

} 