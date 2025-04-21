function makeButton( buttonText, buttonFuncName ){
  return {
    text: buttonText,
    callback_data: buttonFuncName
  }
}
function getAllButtonsObjsArrByFuncNambsArr( funcNambsArr, curr_user_telegramId ){
  let buttonsObjsArr = []
  let subArr = []
  for (let i=0;i<funcNambsArr.length;i++){
    subArr.push( getFuncName(funcNambsArr[i],curr_user_telegramId) )
    if (i%2!=0 || i==funcNambsArr.length-1){
      buttonsObjsArr.push( subArr )
      subArr = []
    }
  }
  return buttonsObjsArr
}
var CALLBACK_QUERY_BUTTONS = {
  button:"button",
  registration:"registration",
  userData:"userData",
  concatterSymbol:"_",
  telegramIdSymbol:"___",
  // button_registration_3___441053489___
}
function getCallBackQueryButton(subBut1,subBut2,numb,telegramId){
  let callBackButton = subBut1+
  CALLBACK_QUERY_BUTTONS.concatterSymbol+
  subBut2+
  CALLBACK_QUERY_BUTTONS.concatterSymbol+
  numb
  if (telegramId)
    callBackButton += CALLBACK_QUERY_BUTTONS.telegramIdSymbol + telegramId + CALLBACK_QUERY_BUTTONS.telegramIdSymbol
  return callBackButton
}
function extractValueBetweenTripleUnderscores(str) {
  const regex = new RegExp(CALLBACK_QUERY_BUTTONS.telegramIdSymbol + "(.+?)" + CALLBACK_QUERY_BUTTONS.telegramIdSymbol);
  const match = str.match(regex);
  return match ? match[1] : "";
}
function getButtonObjFromCallBackData(callbackData){
  // все callbackData для единообразия логики программы должны быть сделаны так:
  if (!callbackData)
    return
  let curr_user_telegramId = extractValueBetweenTripleUnderscores( callbackData.toString() )
  let strArr = callbackData.toString().split(CALLBACK_QUERY_BUTTONS.telegramIdSymbol)[0];
  strArr = callbackData.toString().split(CALLBACK_QUERY_BUTTONS.concatterSymbol);
  if (strArr.length<3)
    return
  let buttonObj = {}
  buttonObj.button = strArr[0]
  buttonObj.subChapter1 = strArr[1]
  buttonObj.subChapter1Numb = Number(strArr[2])
  buttonObj.curr_user_telegramId = curr_user_telegramId
  return buttonObj
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buttonTextNames( text ){
  if (text=="начать_регистрацию_заново") return "Начать регистрацию заново"
  if (text=="открыть_доступ") return "✅ Открыть доступ"
  if (text=="заблокировать") return "❌ Заблокировать"
  if (text=="отменить_доступ") return "❌ Отменить доступ"
  if (text=="отменить_блокировку") return "Отменить блокировку"
  if (text=="данные_пользователя") return "Данные пользователя"
  if (text=="редактировать") return "Редактировать"
  if (text=="сохранить") return "✅ сохранить"
  if (text=="отмена") return "❌ отмена"
}

function getFuncName( funcNumb, forAddInCallBackData ) {
  
  if (funcNumb==1)
    return { text: buttonTextNames("начать_регистрацию_заново"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.registration,10,forAddInCallBackData) } // button_registration_10___441053489___
  else if (funcNumb==2)
    return {  text: buttonTextNames("открыть_доступ"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.registration,11,forAddInCallBackData) } // button_registration_11___441053489___
  else if (funcNumb==3) 
    return {  text: buttonTextNames("заблокировать"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.registration,12,forAddInCallBackData) } // button_registration_12___441053489___
  else if (funcNumb==4)
    return {  text: buttonTextNames("отменить_доступ"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.registration,13,forAddInCallBackData) }
  else if (funcNumb==5)
    return {  text: buttonTextNames("отменить_блокировку"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.registration,14,forAddInCallBackData) }


  else if (funcNumb==100)
    return {  text: buttonTextNames("данные_пользователя"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.userData,1,forAddInCallBackData) } // button_userData_1___441053489___
  else if (funcNumb==101)
    return {  text: buttonTextNames("редактировать"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.userData,2,forAddInCallBackData) } // button_userData_3___441053489___
  else if (funcNumb==102)
    return {  text: buttonTextNames("сохранить"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.userData,3,forAddInCallBackData) } // button_userData_3___441053489___
  else if (funcNumb==103)
    return {  text: buttonTextNames("отмена"), callback_data: getCallBackQueryButton(CALLBACK_QUERY_BUTTONS.button,CALLBACK_QUERY_BUTTONS.userData,4,forAddInCallBackData) } // button_userData_4___441053489___
  


}
































































