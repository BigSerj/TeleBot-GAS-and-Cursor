// --- Утилиты для работы с командами меню Telegram ---

// Возвращает объект команды по её ключу
// Использует константы MENU_COMMANDS из constants/commands.js
function getBurgerCommandObject(commandKey) {
  // TODO: Вынести описания в константы/локализацию
  switch(commandKey) {
    case MENU_COMMANDS.MAIN: return { command: MENU_COMMANDS.MAIN, description: "Главное меню" };
    case MENU_COMMANDS.PENALTIES: return { command: MENU_COMMANDS.PENALTIES, description: "Штрафы" };
    case MENU_COMMANDS.SETTINGS: return { command: MENU_COMMANDS.SETTINGS, description: "Настройки" };
    case MENU_COMMANDS.SETTINGS_ADMIN: return { command: MENU_COMMANDS.SETTINGS_ADMIN, description: "Настройки Admin" };
    case MENU_COMMANDS.SETTINGS_ADMIN2: return { command: MENU_COMMANDS.SETTINGS_ADMIN2, description: "Настройки Admin2" };
    case MENU_COMMANDS.SETTINGS_OWNER: return { command: MENU_COMMANDS.SETTINGS_OWNER, description: "Настройки Owner" };
    case MENU_COMMANDS.SETTINGS_OWNER2: return { command: MENU_COMMANDS.SETTINGS_OWNER2, description: "Настройки Owner2" };
    case MENU_COMMANDS.START: 
       return { command: MENU_COMMANDS.START, description: "Перезапустить" }; 
    default:
      Logger.log('Неизвестный ключ команды меню: ' + commandKey);
      return null;
  }
}

// Создает массив объектов команд для Telegram API из массива ключей
function buildCommandObjectsArray(commandKeysArray) {
  if (!commandKeysArray || !Array.isArray(commandKeysArray)) return [];
  
  const commandObjects = [];
  commandKeysArray.forEach(key => {
    const commandObj = getBurgerCommandObject(key);
    if (commandObj) {
      commandObjects.push(commandObj);
    }
  });
  return commandObjects;
} 