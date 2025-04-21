function sendURLBurgerMenu( parameters ){
  // Отправка списка команд для бургер-меню
  let url = 'https://api.telegram.org/bot' + API_TOKEN + '/setMyCommands'
  let params = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(parameters)
    }
  UrlFetchApp.fetch( url, params);
}
function eraseBurgerMenu( chatId ){
  let parameters = {
    chat_id: chatId,
    commands: []
  }
  sendURLBurgerMenu( parameters )
}