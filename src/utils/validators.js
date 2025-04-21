// --- Утилиты для валидации данных ---

// Убран TODO для импортов

function validateFullName(input) {
  if (!input || typeof input !== 'string') return false;
  input = input.trim();
  // TODO: Рассмотреть более гибкую валидацию (тире, апострофы, двойные фамилии)
  const namePattern = /^([А-ЯЁ][а-яё]+)\s([А-ЯЁ][а-яё]+)$/;
  return namePattern.test(input);
}

function validatePhoneNumber(input) {
  if (!input) return null; // Возвращаем null при некорректном вводе
  // Удаляем все нецифровые символы
  let cleanInput = String(input).replace(/\D/g, '');
  // Проверяем, что номер состоит из 9 цифр (локальный белорусский?)
  if (cleanInput.length !== 9) return null;
  // TODO: Добавить проверку кодов операторов, если нужно
  return cleanInput; // Возвращаем очищенный номер
}

function validateGmailAddress(email) {
  if (!email || typeof email !== 'string') return false;
  email = email.trim().toLowerCase(); 
  // Базовая проверка на формат email
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(email)) return false;
  // Проверка на домен gmail.com
  const gmailRegex = /@gmail\.com$/i;
  if (!gmailRegex.test(email)) return false;
  return true;
}

// Проверяет существование Gmail аккаунта через Drive API
// ВНИМАНИЕ: Может быть медленной и требует включенного Drive API
function checkGmailExists(email) {
  // TODO: Вынести ID тестовой папки в настройки
  const testFolderId = "1r43P0gVxuTwhKSiZy9B_34auU0ET7vHZ"; 
  if (!Drive || !Drive.Permissions) { // Проверка включенного сервиса
      Logger.log("Drive API не включен или недоступен. Проверка Gmail невозможна.");
      return false; // Или true, если не хотим блокировать регистрацию?
  }
  try {
    const permission = {
      'type': 'user',
      'role': 'reader',
      'emailAddress': email,
    };
    const optionalArgs = {
      'sendNotificationEmail': false, 
      'fields': 'id' // Запрашиваем только ID для экономии
    };
    const result = Drive.Permissions.create(permission, testFolderId, optionalArgs);
    let isExist = true;
    // Сразу удаляем разрешение
    try {
      Drive.Permissions.remove(testFolderId, result.id);
    } catch(e) {
      Logger.log("Не удалось удалить временное разрешение для " + email + ": " + e);
    }
    return isExist;
  } catch (e) {
    // Ошибка может означать, что email не существует или другая проблема API
    Logger.log("Ошибка при проверке Gmail через Drive API для " + email + ": " + e);
    // Считаем, что аккаунт не существует при ошибке?
    return false; 
  }
}

// TODO: Добавить другие валидаторы, если нужны. 