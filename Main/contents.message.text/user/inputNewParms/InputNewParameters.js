function getUserParametrsStrObjectByUserState( chatId, messWithParams, selectedParamNumb ){
// function getUserParametrsStrObjectByUserState( chatId ){
  // let messWithParams = userStates[CURR_USER.getTelegrId()].messageText
  // let selectedParamNumb = userStates[CURR_USER.getTelegrId()].numbToChange.toString()
  let paramsObj = getUserParametrsStrObject( messWithParams, selectedParamNumb )
  if (!paramsObj.paramStr){
    sendText(chatId,"В сообщении не найден параметр с номером "+selectedParamNumb);
    return
  }
  return paramsObj
}
function getUserParametrsStrObject( messWithParams, selectedParamNumb ){
/**
Данные пользователя:

1. Имя: Фам17 Имя17
2. Тел.: 956362934
3. gmail: sergeyconvent@gmail.com
*/
  let onlyParams = messWithParams;
  if (messWithParams.toString().search("\n\n")!=-1)
    onlyParams = messWithParams.split("\n\n")[1]
  let paramsArr = onlyParams.split("\n")
  let paramsObj = {}
  paramsObj.paramStr
  paramsObj.oldParameterStr
  for (let i=0;i<paramsArr.length;i++){
    let iParamArr = paramsArr[i].split(". ")
    if (iParamArr[0]!=selectedParamNumb)
      continue
    let iParamArrArr = iParamArr[1].split(": ");
    paramsObj.paramStr = iParamArrArr[0] // например: "Имя" - это nameMy
    paramsObj.oldParameterStr = iParamArrArr[1] // например: значение старого имени 
    break
  }
  return paramsObj
}
function setNewUserParameter( chatId, messageText, paramsObj, changeParametersUser ){
  if (paramsObj.paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.nameMy){
    messageText = MainLibrary.setEveryWordWithCapitalLiteral( messageText )
    if (!validateFullName( messageText )){
      let text1 = getTextOfMistakeInputUserParameterByUserStates( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.nameMy ).text1
      sendText(chatId,text1);
      return
    }
    changeParametersUser.setNameMy( messageText )
  }else if (paramsObj.paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs){
    messageText = validatePhoneNumber(messageText)
    if (!messageText){
      let text1 = getTextOfMistakeInputUserParameterByUserStates( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs ).text1
      sendText(chatId,text1);
      return
    }
    messageText = "+375"+messageText
    changeParametersUser.setTelephoneNumber(messageText)
  }else if (paramsObj.paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail){
    if (!validateGmailAddress(messageText)){
      let text1 = getTextOfMistakeInputUserParameterByUserStates( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail ).text1
      sendText(chatId,text1);
      return
    }
    if (!checkGmailExists(messageText)){
      let text1 = getTextOfMistakeInputUserParameterByUserStates( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail ).text2
      sendText(chatId,text1);
      return
    }
    changeParametersUser.addGmail(messageText)
  }else if (paramsObj.paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.accessStatus){
    messageText = validatePhoneNumber(messageText)
    if (!messageText){
      let text1 = getTextOfMistakeInputUserParameterByUserStates( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs ).text1
      sendText(chatId,text1);
      return
    }
    // changeParametersUser.setTelephoneNumber(messageText)
    changeParametersUser.setAccessStatusUser()
  }





  FIREBASE.setUser( changeParametersUser )
  return changeParametersUser.getParameterByUSER_OBJECT_PARAMETERS_FOR_READ_WRITE( paramsObj.paramStr )
}






















































