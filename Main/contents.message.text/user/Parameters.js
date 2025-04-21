function showUserDataParameters( curr_user_telegramId ) {
  let searchUser = FIREBASE.getUser( curr_user_telegramId );
  let userParametersForShowString = getUserParametersArrForReadAndWrite( searchUser );

  let text1 = "Данные пользователя:" +"\n\n"+userParametersForShowString

  let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( [101], curr_user_telegramId );
  let keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )
  sendText(CURR_USER.getTelegrId(),text1,keyBoard);
}
function redactionUserDataParameters( curr_user_telegramId, messageText ){

  let text1 = "Введите номер параметра, который хотите отредактировать:"

  let userCurrStates = new UserStatesTgClass( USER_STATES.getByTgId(CURR_USER.getTelegrId()) )
  userCurrStates.setCurrTgId( curr_user_telegramId )
  userCurrStates.setMessageText( messageText )
  userCurrStates.setWaitAnswerCode( USER_STATUSES_MEMORY_ANSWER.waitAnswerCode.changeParametersOfUserStep1 )
  USER_STATES.syncAndSaveUserWithTgId( CURR_USER.getTelegrId(), userCurrStates )

  let keyBoard
  sendText(CURR_USER.getTelegrId(),text1,keyBoard);
}
function saveUserDataParameters( buttonObj ){
  
  let text1 = "Сохранено"

  let keyBoard
  // let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( [101], buttonObj.curr_user_telegramId );
  // keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )
  // sendText(CURR_USER.getTelegrId(),text1,keyBoard);
}
function cancelUserDataParameters( buttonObj ){

  let text1 = "Отменено"

  let keyBoard
  // let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( [101], buttonObj.curr_user_telegramId );
  // keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )
  // sendText(CURR_USER.getTelegrId(),text1,keyBoard);
}

/////////////////////////////////////////////////////////////////////////////










































