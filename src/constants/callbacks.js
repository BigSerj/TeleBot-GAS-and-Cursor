// Типы callback-запросов (поле 'button')
const CALLBACK_QUERY_TYPES = {
  BUTTON: 'button', // Общий тип для кнопок регистрации, данных пользователя и т.д.
  // Добавить другие типы, если они есть
};

// Подтипы/Разделы (поле 'subChapter1')
CALLBACK_QUERY_TYPES.SUBCHAPTER = {
  REGISTRATION: 'registration',
  USER_DATA: 'userData',
  // Добавить другие
};

// Действия для раздела REGISTRATION (поле 'subChapter1Numb' ?)
const CALLBACK_REGISTRATION_ACTIONS = {
  // START: 10, // Действие 10 требует уточнения
  APPROVE: 11,
  REJECT: 12,
};

// Действия для раздела USER_DATA (поле 'subChapter1Numb' ?)
const CALLBACK_USER_DATA_ACTIONS = {
  SHOW: 1,
  EDIT_START: 2,
  EDIT_SAVE: 3,
  EDIT_CANCEL: 4,
};

// TODO: Уточнить структуру callbackData и поля, отвечающие за действия
// Возможно, стоит использовать JSON строку в callbackData для большей гибкости:
// {"type":"registration", "action":"approve", "targetUserId": 12345}

// --- Константы для типов и действий в callback_data ---

// Типы колбэков (ключ 't' в callback_data)
const CALLBACK_TYPES = {
  REGISTRATION: 'registration',
  SETTINGS: 'settings',
  // TODO: Добавить другие типы по мере необходимости
};
Object.freeze(CALLBACK_TYPES);

// Действия внутри колбэков (ключ 'a' в callback_data)
const CALLBACK_ACTIONS = {
  // Для регистрации
  APPROVE: 'approve',
  REJECT: 'reject',
  
  // Для настроек
  SELECT_OPTION: 'select_option', 
  CANCEL: 'cancel',

  // TODO: Добавить другие действия
};
Object.freeze(CALLBACK_ACTIONS);

// Опции для колбэков настроек (ключ 'option' в data)
const SETTINGS_OPTIONS = {
  NAME: 'name',
  PHONE: 'phone',
  GMAIL: 'gmail',
};
Object.freeze(SETTINGS_OPTIONS);

Object.freeze(CALLBACK_QUERY_TYPES);
Object.freeze(CALLBACK_QUERY_TYPES.SUBCHAPTER);
Object.freeze(CALLBACK_REGISTRATION_ACTIONS);
Object.freeze(CALLBACK_USER_DATA_ACTIONS); 