function getGreenKeyboardByButObjsArr( buttonsObjsArr ){
  // buttonsObjsArr == [obj1,obj2,...objN]
  // если buttonsObjsArr==[] (пустой массив) то клавиатура СОТРЕТСЯ (УДАЛИТСЯ) из сообщения

  let keyboard = {}
  // keyboard.inline_keyboard = [buttonsObjsArr]
  keyboard.inline_keyboard = buttonsObjsArr
  keyboard.resize_keyboard = true
  keyboard.one_time_keyboard = true
  
  return keyboard
}

function updateKeyboardInExistingMessageKeyboardButtonNumbsArr( chatId, messageId, keyBoardButtonNumbsArr, curr_user_telegramId ){
  let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( keyBoardButtonNumbsArr, curr_user_telegramId );
  let keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )
  updateKeyboardInExistingMessageKeyboardObj( chatId, messageId, keyBoard )
}
function updateKeyboardInExistingMessageKeyboardObj( chatId, messageId, keyBoard ){
  // если надо стереть клавиатуру - передаем вместо keyBoard == undefined (или пустой массив ||) keyBoard == []
  if (!keyBoard){
    let inline_keyboard_insert = []
    keyBoard = {inline_keyboard_insert}
  }
  let payload = {
    method: "editMessageReplyMarkup",
    chat_id: chatId,
    message_id: messageId,
    reply_markup: JSON.stringify(keyBoard)
  };
  let options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(`https://api.telegram.org/bot${API_TOKEN}/`, options);
}


































