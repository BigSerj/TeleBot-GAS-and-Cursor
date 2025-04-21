function sendPhoto2( chatId, imageBlob, text, isKeyboard ){

  let buttonsObjsArr = []
  let buttonObj = {}
  buttonObj.buttonText = "Добавить в палитру"
  buttonObj.buttonFuncName = "add_new_color"
  buttonsObjsArr.push(buttonObj)
  let greenKeyboardPayload = getGreenKeyboardByButObjsArr( buttonsObjsArr );
  if (!isKeyboard)
    greenKeyboardPayload = []

  // Подготавливаем данные для отправки
  const formData = {
    'chat_id': String(chatId),
    'photo': imageBlob,
    'caption': text,
    'reply_markup': JSON.stringify(greenKeyboardPayload)
  };
  
  // Настраиваем параметры запроса
  const options = {
    'method': 'post',
    'payload': formData
  };
  
  // Отправляем запрос к Telegram API
  var url = "https://api.telegram.org/bot" + API_TOKEN + "/sendPhoto";

  try{
  const telegramResponse = UrlFetchApp.fetch(url, options);
  }catch(e){
    sendText(chatId,e)
  }

}
























































