// TODO: Импорты сервисов и обработчиков
// import * as UserService from '../services/userService';
// import * as TelegramService from '../services/telegramService';
// import { handleTextMessage } from './textMessageHandler'; // Используем новое имя?
// import { handleCallbackQuery } from './callbackQueryHandler';
// import { DEVELOPER_TELEGRAM_ID } from '../constants/ids';

// Основная точка входа веб-приложения Apps Script
function doPost(e) {
  try {
    // Парсим входящие данные
    const contents = JSON.parse(e.postData.contents);
    // Logger.log(JSON.stringify(contents, null, 2)); // Логирование входящего запроса для отладки

    // Определяем тип запроса (сообщение или колбэк)
    if (contents.callback_query) {
      const callbackQuery = contents.callback_query;
      const userId = callbackQuery.from.id;
      const chatId = callbackQuery.message.chat.id;
      const callbackData = callbackQuery.data;
      const messageId = callbackQuery.message.message_id;
      const messageText = callbackQuery.message.text; // Текст исходного сообщения с кнопкой
      const callbackQueryId = callbackQuery.id;
      
      // --- Базовая проверка пользователя перед обработкой колбэка ---
      // TODO: Возможно, стоит получать пользователя позже, внутри конкретного обработчика колбэка?
      const user = UserService.getUser(userId);
      
      // Проверка на увольнение (если пользователь есть)
      // TODO: Перенести эту проверку в соответствующие обработчики, где она релевантна?
      if (user && user.isEmpoyeeStatusFired()) {
          TelegramService.eraseBurgerMenu(chatId); // Используем сервис
          TelegramService.sendText(chatId, "Вы были удалены из актуального списка сотрудников компании.\nОбратитесь к руководству.");
          // Отвечаем на колбэк, чтобы убрать "часики"
          TelegramService.answerCallbackQuery(callbackQueryId); 
          return ContentService.createTextOutput(); // Завершаем выполнение
      }
      
      // Вызываем обработчик колбэков
      // Передаем все необходимые данные
      handleCallbackQuery(userId, chatId, callbackData, messageId, messageText, callbackQueryId, user);

    } else if (contents.message) {
      // Вызываем обработчик текстовых сообщений
      // handleTextMessage будет сам получать пользователя через UserService
      handleTextMessage(contents.message); 

    } else {
      Logger.log("Неизвестный тип входящих данных: " + JSON.stringify(contents));
    }

  } catch (error) {
    Logger.log("Критическая ошибка в doPost: " + error + "\nStack: " + error.stack);
    // TODO: Попытаться отправить сообщение разработчику об ошибке?
    // if (DEVELOPER_TELEGRAM_ID) {
    //   TelegramService.sendText(DEVELOPER_TELEGRAM_ID, "Критическая ошибка в doPost: " + error);
    // }
  }

  // Возвращаем пустой ответ, чтобы Telegram не повторял запрос
  return ContentService.createTextOutput();
}

function buttonsArr(count){
  let arr= []
  for (let i=0;i<count;i++){
    let buttText = "Button"+(i+1)
    let button = { text: buttText, callback_data: buttText }
    arr.push(button) 
  }
  return arr
}
function showButtons(){

  let buttonsCount = 7
  let buttonsArrByCount = buttonsArr(buttonsCount);
  let keyboard = getGreenKeyboardByButObjsArr( buttonsArrByCount )
  sendText(441053489, "ТЕСТ. .", keyboard)

}
function showButtons2(){
sendText(441053489,123)
  let but1 = { text: "buttText1", callback_data: "buttText1" }
  let but2 = { text: "buttText2", callback_data: "buttText2" }
  let but3 = { text: "buttText3", callback_data: "buttText3" }
  let but4 = { text: "buttText4", callback_data: "buttText4" }
  let but5 = { text: "buttText5", callback_data: "buttText5" }
  let but6 = { text: "buttText6", callback_data: "buttText6" }
  let but7 = { text: "buttText7", callback_data: "buttText7" }

  let buttonsArr = [
    [but1,but2],
    [but3,but4],
    [but5,but6],
    [but7]
  ]

  let keyboard = {}
  keyboard.inline_keyboard = buttonsArr
  sendText(441053489, "ТЕСТ2. .", keyboard)

} 