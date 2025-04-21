// --- Сервис для взаимодействия с Telegram Bot API ---

// TODO: Получать токен из PropertiesService или передавать при инициализации
// Либо использовать константу, если развертывание через clasp с файлом .clasp.json
// const API_TOKEN = getApiToken_(); // Функция для безопасного получения токена
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('API_TOKEN'); // Пример
const TELEGRAM_API_URL = "https://api.telegram.org/bot" + API_TOKEN;
const MAX_MESSAGE_LENGTH = 4096; // Макс. длина сообщения Telegram

// Разбивает длинный текст на части
function checkTheTextLength(text) {
  text = String(text); // На случай если передали не строку
  const textLength = text.length;
  if (textLength <= MAX_MESSAGE_LENGTH)
    return [text];

  const parts = [];
  let currentPos = 0;
  while(currentPos < textLength) {
    let endPos = currentPos + MAX_MESSAGE_LENGTH;
    // Стараемся не разрывать строку посреди строки
    if (endPos < textLength) {
      const lastNewline = text.lastIndexOf('\n', endPos);
      if (lastNewline > currentPos) {
        endPos = lastNewline;
      }
    }
    parts.push(text.substring(currentPos, endPos));
    currentPos = endPos;
     // Удаляем ведущий перенос строки для следующей части, если он есть
    if (currentPos < textLength && text.charAt(currentPos) === '\n') {
        currentPos++;
    }
  }
  return parts;
}

// Функция для отправки текстовых сообщений (с разбиением длинных)
function sendText(chatId, text, keyboard) {
  if (!chatId || !text) {
    Logger.log('sendText: chatId или text не предоставлены.');
    return null;
  }
  
  const textParts = checkTheTextLength(text);
  let lastResponse = null;

  for (let i = 0; i < textParts.length; i++) {
    const partText = textParts[i];
    // Клавиатуру прикрепляем только к последней части сообщения
    const partKeyboard = (i === textParts.length - 1) ? keyboard : null;
    
    const payload = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: String(chatId),
        text: partText,
        parse_mode: "HTML", 
        reply_markup: partKeyboard ? JSON.stringify(partKeyboard) : null,
        disable_web_page_preview: true // Обычно превью не нужно для ботов
      }),
      muteHttpExceptions: true, 
    };

    try {
      const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/sendMessage", payload);
      const responseCode = response.getResponseCode();
      const responseBody = response.getContentText();
      lastResponse = JSON.parse(responseBody); // Сохраняем ответ последнего запроса
      
      if (responseCode !== 200) {
        Logger.log("Ошибка отправки части сообщения (sendText) в чат " + chatId + ": " + responseCode + " " + responseBody);
        // Если ошибка из-за длины (маловероятно после разбиения, но возможно), прекращаем отправку
        if (responseBody.includes('message is too long')) {
            Logger.log('Прекращена отправка из-за ошибки длины после разбиения.');
            break; 
        }
      } 
      // Задержка между отправкой частей, чтобы избежать флуда (опционально)
      if (textParts.length > 1 && i < textParts.length - 1) {
        Utilities.sleep(300); // 300 мс
      }
    } catch (e) {
      Logger.log("Исключение при отправке части сообщения (sendText) в чат " + chatId + ": " + e);
      return null; // Прерываем при исключении
    }
  }
  return lastResponse; // Возвращаем результат отправки последней части
}

// Функция для отправки фото
function sendPhoto(chatId, imageBlob, caption, keyboard) {
  if (!chatId || !imageBlob) {
    Logger.log('sendPhoto: chatId или imageBlob не предоставлены.');
    return null;
  }

  // Подготавливаем данные для отправки (multipart/form-data)
  const payload = {
    'chat_id': String(chatId),
    'photo': imageBlob,
    'caption': caption || '', // Подпись опциональна
    'parse_mode': 'HTML',
    'reply_markup': keyboard ? JSON.stringify(keyboard) : null,
  };
  
  const options = {
    'method': 'post',
    'payload': payload,
    'muteHttpExceptions': true, 
  };
  
  try {
    const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/sendPhoto", options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    if (responseCode !== 200) {
      Logger.log("Ошибка отправки фото (sendPhoto) в чат " + chatId + ": " + responseCode + " " + responseBody);
      // Попытка отправить сообщение об ошибке текстом, если фото не ушло
      sendText(chatId, "Не удалось отправить изображение. Ошибка: " + responseCode);
      return null;
    }
    return JSON.parse(responseBody);
  } catch (e) {
    Logger.log("Исключение при отправке фото (sendPhoto) в чат " + chatId + ": " + e);
    sendText(chatId, "Не удалось отправить изображение. Исключение: " + e);
    return null;
  }
}

// Устанавливает команды для бургер-меню пользователя
// commands - массив объектов {command: "/start", description: "Запуск"}
// scope - объект {type: "chat", chat_id: chatId} или {type: "default"}
function setMyCommands(commands, scope) {
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      commands: commands || [],
      scope: scope || {type: "default"} // По умолчанию - для всех чатов
    }),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/setMyCommands", payload);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode !== 200) {
      Logger.log("Ошибка установки команд меню (setMyCommands) для scope " + JSON.stringify(scope) + ": " + responseCode + " " + responseBody);
      return false;
    }
    return true;
  } catch (e) {
    Logger.log("Исключение при установке команд меню (setMyCommands) для scope " + JSON.stringify(scope) + ": " + e);
    return false;
  }
}

// Удаляет команды бургер-меню для конкретного чата
function eraseBurgerMenu(chatId) {
  if (!chatId) {
     Logger.log('eraseBurgerMenu: chatId не предоставлен.');
     return false;
  }
  const scope = { type: "chat", chat_id: String(chatId) };
  return setMyCommands([], scope); // Отправляем пустой массив команд
}

// Редактирует текст существующего сообщения
function editText(chatId, messageId, text, keyboard) {
  if (!chatId || !messageId || !text) {
    Logger.log('editText: chatId, messageId или text не предоставлены.');
    return null;
  }

  // TODO: Возможно, стоит добавить разбиение на части и для editText?
  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: String(chatId),
      message_id: messageId,
      text: text,
      parse_mode: "HTML",
      reply_markup: keyboard ? JSON.stringify(keyboard) : null,
      disable_web_page_preview: true 
    }),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/editMessageText", payload);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode !== 200) {
      Logger.log("Ошибка редактирования сообщения (editText) "+messageId+" в чате " + chatId + ": " + responseCode + " " + responseBody);
    }
    return JSON.parse(responseBody);
  } catch (e) {
    Logger.log("Исключение при редактировании сообщения (editText) "+messageId+" в чате " + chatId + ": " + e);
    return null;
  }
}

// Редактирует только клавиатуру существующего сообщения
function editMessageReplyMarkup(chatId, messageId, keyboard) {
   if (!chatId || !messageId) {
    Logger.log('editMessageReplyMarkup: chatId или messageId не предоставлены.');
    return null;
  }

  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: String(chatId),
      message_id: messageId,
      reply_markup: keyboard ? JSON.stringify(keyboard) : null, // null для удаления клавиатуры
    }),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/editMessageReplyMarkup", payload);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode !== 200) {
      Logger.log("Ошибка редактирования клавиатуры (editMessageReplyMarkup) "+messageId+" в чате " + chatId + ": " + responseCode + " " + responseBody);
    }
    return JSON.parse(responseBody);
  } catch (e) {
    Logger.log("Исключение при редактировании клавиатуры (editMessageReplyMarkup) "+messageId+" в чате " + chatId + ": " + e);
    return null;
  }
}

// Отправляет ответ на callback query (например, всплывающее уведомление)
function answerCallbackQuery(callbackQueryId, text, showAlert) {
  if (!callbackQueryId) {
    Logger.log('answerCallbackQuery: callbackQueryId не предоставлен.');
    return null;
  }

  const payload = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || '', // Текст уведомления (до 200 символов)
      show_alert: showAlert || false, // Показывать ли как alert (true) или как toast (false)
      // cache_time: 0 // Время кеширования результата на стороне клиента
    }),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(TELEGRAM_API_URL + "/answerCallbackQuery", payload);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode !== 200) {
      Logger.log("Ошибка ответа на callback query (answerCallbackQuery) " + callbackQueryId + ": " + responseCode + " " + responseBody);
    }
    return JSON.parse(responseBody);
  } catch (e) {
    Logger.log("Исключение при ответе на callback query (answerCallbackQuery) " + callbackQueryId + ": " + e);
    return null;
  }
}

// TODO: Добавить функцию для форматирования JSON callback_data
// TODO: Добавить функцию для создания стандартных клавиатур (inline, reply) 