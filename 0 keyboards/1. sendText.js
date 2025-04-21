function sendText(chatId, text, keyBoard) {

  if (chatId>0 && chatId!=441053489 && FIREBASE){
    let userById = FIREBASE.getUser( chatId )
    text = "--- cообщение для "+userById.getNameMy()+"\n\n" +text
    chatId = 441053489
  }

  if (!chatId)
    chatId = CURR_USER.getTelegrId()
  if (!chatId)
    return

  if (text==undefined)
    text = "TEXT undefined";
  if (text=="")
    text = "Путой текст";


  // отсылаем сообщение в чат
  var keyBoardSend;
  if (keyBoard!=undefined)
    keyBoardSend = keyBoard
  

  var senderIteratoArArr = checkTheTextLength(text);
  for (var i=0;i<senderIteratoArArr.length;i++){
    var iText = senderIteratoArArr[i];
    sendTextOut(chatId, iText, keyBoardSend);
  }
}
function checkTheTextLength(text){
  var maxLength = 4096;
  var textLength = text.length;
  if (textLength <= maxLength)
    return [text];

  var kratnost = Math.floor(textLength/maxLength);
  var textArr = [];
  var iText = "";
  for (var i=0;i<kratnost;i++){
    var firstLiteral = i*maxLength;
    iText = text.toString().slice(firstLiteral,Number(firstLiteral+maxLength));
    textArr.push(iText);
  }
  iText = text.toString().slice(kratnost*maxLength);
  textArr.push(iText);
  return textArr;
}
function sendTextOut(chatId, text, keyBoardSend){
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoardSend)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + API_TOKEN + '/', data);
}