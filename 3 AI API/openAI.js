function getAnswerFromAssistant(text) {
  
  const apiUrl = 'https://api.openai.com/v1/threads';
  
  // Создание нового потока
  const threadPayload = {};
  const threadOptions = {
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + API_KEY,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    'payload': JSON.stringify(threadPayload)
  };
  
  try {
    // Создаем поток
    const threadResponse = UrlFetchApp.fetch(apiUrl, threadOptions);
    const threadJson = JSON.parse(threadResponse.getContentText());
    const threadId = threadJson.id;
    
    // Добавляем сообщение в поток
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
    
    const messageResponse = UrlFetchApp.fetch(messageUrl, messageOptions);
    
    // Запускаем поток с ассистентом
    const runUrl = `https://api.openai.com/v1/threads/${threadId}/runs`;
    const runPayload = {
      'assistant_id': ASSISTANT_ID
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
    
    // Проверяем статус выполнения
    let status = 'queued';
    let maxAttempts = 10;
    while (status !== 'completed' && maxAttempts > 0) {
      Utilities.sleep(2000); // Ждем 2 секунды между запросами
      
      const statusUrl = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;
      const statusOptions = {
        'method': 'get',
        'headers': {
          'Authorization': 'Bearer ' + API_KEY,
          'OpenAI-Beta': 'assistants=v2'
        }
      };
      
      const statusResponse = UrlFetchApp.fetch(statusUrl, statusOptions);
      const statusJson = JSON.parse(statusResponse.getContentText());
      status = statusJson.status;
      
      if (status === 'failed') {
        return "Произошла ошибка при выполнении запроса.";
      }
      
      maxAttempts--;
    }
    
    // Получаем ответ ассистента
    const messagesUrl = `https://api.openai.com/v1/threads/${threadId}/messages`;
    const messagesOptions = {
      'method': 'get',
      'headers': {
        'Authorization': 'Bearer ' + API_KEY,
        'OpenAI-Beta': 'assistants=v2'
      }
    };
    
    const messagesResponse = UrlFetchApp.fetch(messagesUrl, messagesOptions);
    const messagesJson = JSON.parse(messagesResponse.getContentText());
    
    // Возвращаем последнее сообщение ассистента
    for (let i = messagesJson.data.length - 1; i >= 0; i--) {
      if (messagesJson.data[i].role === 'assistant') {
        return messagesJson.data[i].content[0].text.value ;
      }
    }
    
    return "Не удалось получить ответ от ассистента.";
    
  } catch(error) {
    Logger.log('Error: ' + error);
    return "Извините, произошла ошибка при обработке запроса."+"\n"+'Error: ' + error;
  }
}