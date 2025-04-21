function sendWelcomeMessage() {
  let text = "Привет! Используйте бургер-меню слева внизу для навигации."
  sendText(CURR_USER.getTelegrId(),text);
}
// Функция отправки главного меню
function sendMainMenu() {
  let text = "🏠 Главное меню\n\n" + "Основная информация о боте\n" + "• Статус: Активен\n" + "• Версия: 1.0"
  sendText(CURR_USER.getTelegrId(),text);
}
// Функция отправки информации о штрафах
function sendPenaltiesInfo() {
  let text = "💰 Штрафы\n\n" + "Текущие штрафы:\n" + "• Всего: 0 руб.\n" + "• Активных штрафов: Нет"
  sendText(CURR_USER.getTelegrId(),text);
}
// Функция отправки настроек
function sendSettings() {
  let text = "⚙️ Настройки\n\n" +  "Параметры бота:\n" +  "• Уведомления: Включены\n" + "• Язык: Русский"
  sendText(CURR_USER.getTelegrId(),text);
}
// Функция отправки ответа по умолчанию
function sendDefaultResponse() {
  let text = "Извините, непонятная команда. Используйте меню слева."
  sendText(CURR_USER.getTelegrId(),text);
}


function sendSettingsAdmin() {
  let text = "settingsAdmin"
  sendText(CURR_USER.getTelegrId(),text);
}
function sendSettingsAdmin2() {
  let text = "settingsAdmin2"
  sendText(CURR_USER.getTelegrId(),text);
}

function sendSettingsOwner() {
  let text = "settingsOwner"
  sendText(CURR_USER.getTelegrId(),text);
}
function sendSettingsOwner2() {
  let text = "settingsOwner2"
  sendText(CURR_USER.getTelegrId(),text);
}
