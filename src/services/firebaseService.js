// --- Сервис для взаимодействия с Firebase Realtime Database --- 

// TODO: Вынести URL базы данных в константы/настройки
const FIREBASE_DB_URL = 'https://fk-workbot-default-rtdb.firebaseio.com/'; 

// Кэширование токена, чтобы не получать его при каждом запросе
// Используем CacheService Apps Script (лимит 6 часов)
const _getFirebaseAuthToken = () => {
  const cache = CacheService.getScriptCache();
  const cachedToken = cache.get('firebase_auth_token');
  if (cachedToken) {
    return cachedToken;
  }

  // Получаем ключ и email из Script Properties
  const privateKey = PropertiesService.getScriptProperties().getProperty('private_key');
  const clientEmail = PropertiesService.getScriptProperties().getProperty('client_email');
  
  if (!privateKey || !clientEmail) {
      Logger.log("Ошибка: private_key или client_email не найдены в Script Properties.");
      throw new Error("Firebase credentials not configured.");
  }

  const jsonKey = { private_key: privateKey, client_email: clientEmail };

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const payload = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: _createJwtToken(jsonKey)
  };

  const options = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    payload: payload,
    muteHttpExceptions: true // Обработаем ошибки ниже
  };

  try {
      const response = UrlFetchApp.fetch(tokenUrl, options);
      const responseCode = response.getResponseCode();
      const responseBody = response.getContentText();
      const json = JSON.parse(responseBody);

      if (responseCode === 200 && json.access_token) {
        // Кэшируем токен на 55 минут (токен действителен 1 час)
        cache.put('firebase_auth_token', json.access_token, 3300); 
        return json.access_token;
      } else {
        Logger.log("Ошибка получения Firebase access_token: " + responseCode + " " + responseBody);
        throw new Error("Failed to retrieve Firebase auth token. Response: " + responseBody);
      }
  } catch (e) {
       Logger.log("Исключение при получении Firebase access_token: " + e);
       throw new Error("Exception during Firebase auth token retrieval: " + e);
  }
}

// Вспомогательная функция для создания JWT
const _createJwtToken = (jsonKey) => {
  const header = JSON.stringify({
    "alg": "RS256",
    "typ": "JWT"
  });

  const now = Math.floor(Date.now() / 1000);
  
  const claimSet = JSON.stringify({
    "iss": jsonKey.client_email,
    "sub": jsonKey.client_email,
    "aud": "https://oauth2.googleapis.com/token",
    "scope": "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
    "exp": now + 3600, // Срок действия 1 час
    "iat": now
  });

  // Использование Utilities.base64EncodeWebSafe и computeRsaSha256Signature
  const encodedHeader = Utilities.base64EncodeWebSafe(header).replace(/=/g, '');
  const encodedClaimSet = Utilities.base64EncodeWebSafe(claimSet).replace(/=/g, '');
  const signatureInput = encodedHeader + '.' + encodedClaimSet;
  const signatureBytes = Utilities.computeRsaSha256Signature(signatureInput, jsonKey.private_key);
  const encodedSignature = Utilities.base64EncodeWebSafe(signatureBytes).replace(/=/g, '');

  return signatureInput + '.' + encodedSignature;
}


// Записывает/перезаписывает данные по указанному пути (PUT)
function writeData(path, data) {
  if (!path) {
      Logger.log('writeData: path не указан.');
      return null;
  }
  const fullUrl = FIREBASE_DB_URL + path + '.json';
  const token = _getFirebaseAuthToken();

  const options = {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };

  try {
    const response = UrlFetchApp.fetch(fullUrl /* + '?access_token=' + token */, options); // Токен уже в заголовке
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode >= 300) { // Проверяем коды ошибок (>=300)
        Logger.log('Ошибка записи в Firebase (writeData) по пути ' + path + ': ' + responseCode + ' ' + responseBody);
        return null;
    }
    return JSON.parse(responseBody); // Возвращаем записанные данные (Firebase возвращает их)
  } catch(e) {
    Logger.log('Исключение при записи в Firebase (writeData) по пути ' + path + ': ' + e);
    return null;
  }
}

// Читает данные с указанного пути (GET)
function readData(path) {
  if (!path) {
      Logger.log('readData: path не указан.');
      return null;
  }
  const fullUrl = FIREBASE_DB_URL + path + '.json';
  const token = _getFirebaseAuthToken();
  
  const options = {
    method: 'get',
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  };
  
  let retries = 3; // Ограничим количество попыток
  while(retries > 0){
    try {
      const response = UrlFetchApp.fetch(fullUrl /* + '?access_token=' + token */, options);
      const responseCode = response.getResponseCode();
      const responseBody = response.getContentText();
      
      if (responseCode === 200) {
           return JSON.parse(responseBody);
      } else if (responseCode === 404) { // Путь не найден
          Logger.log('Данные не найдены (404) в Firebase (readData) по пути: ' + path);
          return null; // или пустой объект/массив?
      } else {
          Logger.log('Ошибка чтения из Firebase (readData) по пути ' + path + ': ' + responseCode + ' ' + responseBody);
          // Повторяем попытку?
      }
    } catch(e) {
       Logger.log('Исключение при чтении из Firebase (readData) по пути ' + path + ': ' + e);
       // Повторяем попытку?
    }
    retries--;
    if (retries > 0) {
        Utilities.sleep(500); // Пауза перед повторной попыткой
    }
  }
  Logger.log('Не удалось прочитать данные из Firebase (readData) после нескольких попыток по пути: ' + path);
  return null; // Возвращаем null после всех попыток
}

// TODO: Добавить функцию для удаления данных (DELETE)
// function deleteData(path) { ... } 