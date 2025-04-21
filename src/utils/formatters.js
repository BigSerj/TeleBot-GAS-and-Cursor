// --- Утилиты для форматирования данных ---

// Форматирует ФИО (Каждое слово с большой буквы)
function formatFullName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.trim().split(/\s+/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Форматирует email (убирает пробелы, приводит к нижнему регистру)
function formatEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

// Создает строку callback_data (пример)
// TODO: Адаптировать под реальную структуру callbackData
function createCallbackData(type, action, data) { 
    const obj = { t: type, a: action, d: data };
    const jsonString = JSON.stringify(obj);
    // TODO: Проверить ограничение на длину callback_data (64 байта)
    if (jsonString.length > 64) {
        Logger.log('ВНИМАНИЕ: Сгенерированные callback_data могут быть слишком длинными: ' + jsonString);
        // Можно использовать сокращения ключей или другие методы сжатия
    }
    return jsonString;
}

// Парсит строку callback_data (пример)
function parseCallbackData(callbackDataString) {
    try {
        return JSON.parse(callbackDataString);
    } catch (e) {
        Logger.log('Ошибка парсинга callback_data: ' + callbackDataString + ', ошибка: ' + e);
        return null;
    }
}

// Возвращает читаемое название статуса доступа
function getAccessStatusName(statusKey) {
  switch (statusKey) {
    case USER_ACCESS.DEVELOPER: return "Разработчик";
    case USER_ACCESS.USER: return "Пользователь";
    case USER_ACCESS.UNKNOWN: return "Неизвестный";
    case USER_ACCESS.BLOCKED: return "Заблокирован";
    default: return statusKey || "-";
  }
}

// Возвращает читаемое название отдела
function getDepartmentName(departmentKey) {
  switch (departmentKey) {
    case DEPARTMENT.CROSS_DEPART: return "Администрация";
    case DEPARTMENT.RETAIL_SALES: return "Розничные продажи";
    case DEPARTMENT.ONLINE_SALES: return "Онлайн продажи";
    case DEPARTMENT.PASTING: return "Оклейка";
    case DEPARTMENT.REPAIR: return "Ремонт";
    default: return departmentKey || "-";
  }
}

// Возвращает читаемое название должности
function getEmployeePositionName(positionKey) {
  switch (positionKey) {
    case EMPLOYEES_HIERARHY.OWNER: return "Владелец";
    case EMPLOYEES_HIERARHY.MANAGER_RETAIL_NETWORK: return "Управляющий сети";
    case EMPLOYEES_HIERARHY.BUYER: return "Закупщик";
    case EMPLOYEES_HIERARHY.ADMIN_IN_OFFICE: return "Администратор офиса";
    case EMPLOYEES_HIERARHY.SELLER: return "Продавец";
    case EMPLOYEES_HIERARHY.PASTERER_MASTER: return "Мастер оклейки";
    case EMPLOYEES_HIERARHY.PASTERER: return "Оклейщик";
    case EMPLOYEES_HIERARHY.REPAIRMAN: return "Мастер по ремонту";
    default: return positionKey || "-";
  }
}

// Возвращает читаемое название статуса сотрудника
function getEmploymentStatusName(statusKey) {
  switch (statusKey) {
    case EMPLOYMENT_STATUS.INTERN: return "Стажер";
    case EMPLOYMENT_STATUS.ON_PROBATION: return "На испытательном сроке";
    case EMPLOYMENT_STATUS.EMPLOYED: return "В штате";
    case EMPLOYMENT_STATUS.ON_LEAVE: return "В отпуске";
    case EMPLOYMENT_STATUS.SUSPENDED: return "Отстранен";
    case EMPLOYMENT_STATUS.FIRED: return "Уволен";
    default: return statusKey || "-";
  }
}

// Возвращает читаемое название этапа регистрации
function getRegistrationStageName(stageKey) {
   switch (stageKey) {
     case REGISTRATION_STAGE.WAITING_INPUT_NAME_MY: return "Ожидание ФИО";
     case REGISTRATION_STAGE.WAITING_INPUT_TEL: return "Ожидание телефона";
     case REGISTRATION_STAGE.WAITING_INPUT_GMAIL: return "Ожидание Gmail";
     case REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER: return "Ожидание одобрения";
     case REGISTRATION_STAGE.REGISTERED: return "Зарегистрирован";
     default: return stageKey || "-";
   }
 }

// --- Дополнительные утилиты форматирования ---

// Форматирует массив строк в нумерованный список (из 2/Общая.js)
function formatArrayAsNumberedList(stringArray) {
  let text = "";
  if (stringArray && Array.isArray(stringArray)) {
    for (let i = 0; i < stringArray.length; i++) {
      text += (i + 1) + ". " + stringArray[i] + "\n";
    }
  }
  return text;
}

// TODO: Добавить другие форматтеры, если нужны (например, для дат из MainLibrary) 