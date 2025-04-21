// --- Константы для имен состояний пользователя ---

const USER_STATES = {
  // Состояния для процесса настроек
  SETTINGS_AWAITING_NAME: 'settings_awaiting_name',
  SETTINGS_AWAITING_PHONE: 'settings_awaiting_phone',
  SETTINGS_AWAITING_GMAIL: 'settings_awaiting_gmail',
  
  // TODO: Добавить другие состояния, если они появятся (например, для ввода штрафов)
};
Object.freeze(USER_STATES); 