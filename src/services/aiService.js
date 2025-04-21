// --- Сервис для взаимодействия с OpenAI Assistant API ---

// TODO: Вынести API_KEY и ASSISTANT_ID в PropertiesService или настройки
const API_KEY = "YOUR_OPENAI_API_KEY"; // Замените на ваш ключ!
const ASSISTANT_ID = "YOUR_ASSISTANT_ID"; // Замените на ваш ID ассистента!

// Получает ответ от OpenAI Assistant для заданного текста
function getAnswerFromAssistant(text) {
  
  const apiUrl = 'https://api.openai.com/v1/threads';
  
  // Создание нового потока
  const threadPayload = {};
  const threadOptions = {
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2' // Используем v2 для Assistant API
    },
    'payload': JSON.stringify(threadPayload)
  };
  
  try {
    // 1. Создаем поток (Thread)
    const threadResponse = UrlFetchApp.fetch(apiUrl, threadOptions);
    const threadJson = JSON.parse(threadResponse.getContentText());
    const threadId = threadJson.id;
    Logger.log('Создан поток: ' + threadId);
    
    // 2. Добавляем сообщение пользователя в поток
    const messageUrl = `https://api.openai.com/v1/threads/${threadId}/messages`;
    const messagePayload = {
      'role': 'user',
      'content': text
    };
    
    const messageOptions = {
      'method': 'post',
      'headers': {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      'payload': JSON.stringify(messagePayload)
    };
    
    const messageResponse = UrlFetchApp.fetch(messageUrl, messageOptions); // Добавляем сообщение
    Logger.log('Сообщение добавлено в поток.');

    // 3. Запускаем выполнение (Run) потока с ассистентом
    const runUrl = `https://api.openai.com/v1/threads/${threadId}/runs`;
    const runPayload = {
      'assistant_id': ASSISTANT_ID
      // Можно добавить instructions, model и другие параметры сюда
    };
    
    const runOptions = {
      'method': 'post',
      'headers': {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      'payload': JSON.stringify(runPayload)
    };
    
    const runResponse = UrlFetchApp.fetch(runUrl, runOptions);
    const runJson = JSON.parse(runResponse.getContentText());
    const runId = runJson.id;
    Logger.log('Запущено выполнение (Run): ' + runId);

    // 4. Ожидаем завершения выполнения (Polling)
    let status = runJson.status; // Начальный статус из ответа на запуск
    let maxAttempts = 15; // Увеличим количество попыток
    let waitTime = 1000; // Начнем с 1 секунды

    while ((status === 'queued' || status === 'in_progress') && maxAttempts > 0) {
      Utilities.sleep(waitTime); // Пауза перед проверкой статуса
      
      const statusUrl = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;
      const statusOptions = {
        'method': 'get',
        'headers': {
          'Authorization': 'Bearer ' + API_KEY,
          'OpenAI-Beta': 'assistants=v2'
        },
        'muteHttpExceptions': true // Чтобы не падать при ошибках сети
      };
      
      const statusResponse = UrlFetchApp.fetch(statusUrl, statusOptions);
      const responseCode = statusResponse.getResponseCode();
      
      if (responseCode === 200) {
          const statusJson = JSON.parse(statusResponse.getContentText());
          status = statusJson.status;
          Logger.log('Статус выполнения: ' + status);
      } else {
          Logger.log('Ошибка при проверке статуса Run: Код ' + responseCode + ', Ответ: ' + statusResponse.getContentText());
          status = 'failed'; // Считаем ошибкой при проблеме с запросом статуса
      }
      
      if (status === 'failed' || status === 'cancelled' || status === 'expired') {
        Logger.log('Выполнение не удалось. Статус: ' + status);
        return "Произошла ошибка при выполнении запроса к AI (' + status + ').";
      }
      
      maxAttempts--;
      waitTime = Math.min(waitTime * 1.5, 5000); // Увеличиваем ожидание, но не более 5 сек
    }

    if (status !== 'completed') {
        Logger.log('Выполнение не завершилось за отведенное время. Последний статус: ' + status);
        return "AI не успел ответить вовремя. Попробуйте позже.";
    }

    // 5. Получаем сообщения из потока после завершения
    Logger.log('Выполнение завершено. Получаем сообщения...');
    const messagesUrl = `https://api.openai.com/v1/threads/${threadId}/messages`;
    const messagesOptions = {
      'method': 'get',
      'headers': {
        'Authorization': 'Bearer ' + API_KEY,
        'OpenAI-Beta': 'assistants=v2'
      },
       'muteHttpExceptions': true
    };
    
    const messagesResponse = UrlFetchApp.fetch(messagesUrl, messagesOptions);
    const messagesResponseCode = messagesResponse.getResponseCode();

    if (messagesResponseCode !== 200) {
        Logger.log('Ошибка при получении сообщений: Код ' + messagesResponseCode + ', Ответ: ' + messagesResponse.getContentText());
        return "Произошла ошибка при получении ответа от AI.";
    }

    const messagesJson = JSON.parse(messagesResponse.getContentText());
    
    // Ищем последнее сообщение от ассистента
    // Ответ API возвращает сообщения в порядке убывания времени создания
    const assistantMessages = messagesJson.data.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length > 0 && assistantMessages[0].content[0].type === 'text') {
        Logger.log('Получен ответ от ассистента.')
        return assistantMessages[0].content[0].text.value;
    } else {
        Logger.log('Не найдено текстового ответа от ассистента в сообщениях.');
        Logger.log('Полный ответ сообщений: ' + JSON.stringify(messagesJson));
        return "Не удалось найти ответ ассистента.";
    }
    
  } catch(error) {
    Logger.log('Критическая ошибка в getAnswerFromAssistant: ' + error);
    return "Извините, произошла критическая ошибка при обработке AI запроса." + "\n" + 'Error: ' + error;
  }
} 