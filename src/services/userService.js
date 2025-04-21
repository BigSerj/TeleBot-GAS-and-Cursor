// --- Сервис для управления данными пользователей ---

// TODO: Импорты
// import * as FirebaseService from './firebaseService';
// import { User } from '../core/User';

// TODO: Вынести путь к пользователям в константы?
const USERS_PATH = 'users'; // Путь в Firebase RTDB, где хранятся пользователи
const USER_ID_LIST_PATH = 'userIds'; // Путь к списку ID пользователей

// Получает объект пользователя по ID
function getUser(userId) {
  if (!userId) return null;
  const userPath = USERS_PATH + '/' + userId;
  try {
    const userData = FirebaseService.readData(userPath);
    if (userData) {
      // Создаем экземпляр класса User и загружаем данные
      const user = new User(userId);
      user.loadAllObjectsFromDB(userData); // Используем метод загрузки из класса User
      return user;
    } else {
      return null; // Пользователь не найден
    }
  } catch (e) {
    Logger.log('Ошибка при получении пользователя ' + userId + ' в UserService.getUser: ' + e);
    return null;
  }
}

// Сохраняет объект пользователя
function setUser(user) {
  if (!user || !user.getTelegrId()) {
    Logger.log('UserService.setUser: Невалидный объект User.');
    return false;
  }
  const userId = user.getTelegrId();
  const userPath = USERS_PATH + '/' + userId;
  try {
    // Устанавливаем время регистрации при первом сохранении
    if (!user.getRegistrationTimeInMillis()) {
        user.setRegistrationTimeInMillis();
    }
    // Преобразуем объект User в простой объект для сохранения в Firebase
    // (Firebase не хранит методы класса)
    const userDataToSave = Object.assign({}, user); 
    // Удаляем или преобразуем сложные объекты, если они есть и не хранятся как JSON
    // delete userDataToSave.telephoneNumbersObj; // Если храним как массив
    // delete userDataToSave.gmailsObj;

    const result = FirebaseService.writeData(userPath, userDataToSave);
    if (result !== null) {
       // Добавляем ID пользователя в общий список, если его там нет
       _addUserIdToList(userId);
       return true;
    } else {
        return false;
    }
  } catch (e) {
    Logger.log('Ошибка при сохранении пользователя ' + userId + ' в UserService.setUser: ' + e);
    return false;
  }
}

// Получает массив всех ID пользователей
function getAllUserIds() {
    try {
        const ids = FirebaseService.readData(USER_ID_LIST_PATH);
        return ids || []; // Возвращаем пустой массив, если список пуст или не найден
    } catch (e) {
        Logger.log('Ошибка при получении списка ID пользователей в UserService.getAllUserIds: ' + e);
        return [];
    }
}

// Получает массив всех объектов User
function getAllUsers() {
    const userIds = getAllUserIds();
    const users = [];
    if (userIds && userIds.length > 0) {
        userIds.forEach(id => {
            const user = getUser(id);
            if (user) {
                users.push(user);
            }
        });
    }
    return users;
}

// Вспомогательная функция для добавления ID в список
function _addUserIdToList(userId) {
    try {
        let userIds = getAllUserIds();
        userId = String(userId); // Убедимся, что ID - строка
        if (!userIds.includes(userId)) {
            userIds.push(userId);
            FirebaseService.writeData(USER_ID_LIST_PATH, userIds);
        }
    } catch (e) {
        Logger.log('Ошибка при добавлении userId ' + userId + ' в список: ' + e);
    }
}

// TODO: Добавить функцию удаления пользователя deleteUser(userId)
// (удаление из /users/{userId} и из /userIds)
// TODO: Добавить функции для работы с userData (show, edit, save, cancel), вызываемые из callbackUserDataHandler 