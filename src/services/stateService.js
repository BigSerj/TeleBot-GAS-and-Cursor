// --- Сервис для управления состояниями пользователей ---

// Используем CacheService для хранения временных состояний диалогов
const userCache = CacheService.getUserCache(); 
// Ключ будет формироваться как state_userId

// Время жизни состояния по умолчанию (в секундах), например, 1 час
const DEFAULT_EXPIRATION = 3600; 

// Получает текущее состояние пользователя
// Возвращает объект { currentState: string, context: object } или null, если состояния нет
function getUserState(userId) {
  const cacheKey = 'state_' + userId;
  const stateString = userCache.get(cacheKey);
  if (stateString) {
    try {
      return JSON.parse(stateString);
    } catch (e) {
      Logger.log('Ошибка парсинга состояния из кэша для пользователя ' + userId + ': ' + e);
      // Удаляем поврежденные данные из кэша
      userCache.remove(cacheKey);
      return null;
    }
  }
  return null;
}

// Устанавливает состояние для пользователя
// stateName: Строка, идентифицирующая состояние (например, 'awaiting_new_email')
// context: Объект с дополнительными данными, необходимыми для этого состояния
// expirationInSeconds: Время жизни состояния в секундах
function setUserState(userId, stateName, context = {}, expirationInSeconds = DEFAULT_EXPIRATION) {
  if (!userId || !stateName) {
      Logger.log('Ошибка: Нельзя установить состояние без userId или stateName.');
      return;
  }
  const cacheKey = 'state_' + userId;
  const stateData = {
    currentState: stateName,
    context: context || {} // Гарантируем, что context всегда объект
  };
  try {
    const stateString = JSON.stringify(stateData);
    userCache.put(cacheKey, stateString, expirationInSeconds);
    Logger.log('Установлено состояние \'' + stateName + '\' для пользователя ' + userId + ' с контекстом: ' + JSON.stringify(context));
  } catch (e) {
      Logger.log('Ошибка при сохранении состояния в кэш для пользователя ' + userId + ': ' + e);
  }
}

// Сбрасывает (удаляет) состояние пользователя
function clearUserState(userId) {
  const cacheKey = 'state_' + userId;
  userCache.remove(cacheKey);
  Logger.log('Состояние для пользователя ' + userId + ' сброшено.');
}

// Пример использования:
// function startNameChangeProcess(userId) {
//   const user = UserService.getUser(userId);
//   if (!user) return;
//   setUserState(userId, 'awaiting_new_name', { originalName: user.getNameMy() });
//   TelegramService.sendText(userId, "Введите новое имя:");
// }

// function handleNewNameInput(userId, newNameInput) {
//   const state = getUserState(userId);
//   if (state && state.currentState === 'awaiting_new_name') {
//     // Валидация newNameInput...
//     // Обновление user.setNameMy(newNameInput);
//     // UserService.setUser(user);
//     clearUserState(userId);
//     TelegramService.sendText(userId, "Имя успешно изменено!");
//   } else {
//     // Обработка как обычного сообщения
//   }
// } 