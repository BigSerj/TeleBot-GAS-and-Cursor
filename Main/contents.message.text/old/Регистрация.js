// function employeeRegistration(userId,chatId,messageText){

//   if (messageText==-1){
//     messageText = "/start"
//     userStates[userId] = {}
//     PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(userStates));
//   }
//   if (userStates[userId]){
//     if (!userStates[userId].isWaitingEnterNameMy1 && !userStates[userId].isWaitingEnterNameMy2 && !userStates[userId].isWaitingEnterNameMy3)
//       userStates[userId].isWaitingEnterNameMy0 = true
//   }
//   let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( [1] );
//   let keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )

  
//   if (messageText=="/start" || userStates[userId].isWaitingEnterNameMy0){ // Регистрация ЭТАП 1 - СВОЕ ИМЯ 1
//     let text1 = "Выберите свою Фамилию Имя:\n(введите и отправьте только номер, который перед Вашим именем)\n";
//     let buttonsObjsArr = getOnlyDontRegisteredNamesArr();
//     if (buttonsObjsArr.length==0){
//       sendText(chatId,"Не найдено незарегистрированных имен.\nОбратитесь к руководству.");
//       return
//     }
//     let employeesText = getTextFromEmployeesArr( buttonsObjsArr )
//     text1 = text1+"\n"+employeesText
//     text1 += "\n"+"Если не нашли свою Фамилию Имя обратитесь к руководству."

//     if (!userStates[userId]) userStates[userId] = {};
//     userStates[userId].isWaitingEnterNameMy1 = true;
//     userStates[userId].employeesArr = buttonsObjsArr;
//     userStates[userId].lastText = messageText
//     delete userStates[userId].isWaitingEnterNameMy0

//     // Сохраняем обновленные состояния
//     PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(userStates));

//     sendText(chatId,text1,keyBoard);
//     return
//   }
//   if (userStates[userId] && userStates[userId].isWaitingEnterNameMy1) { // Регистрация ЭТАП 2 - СВОЕ ИМЯ 2
//     if (messageText=="" || messageText==undefined){
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     if (!MainLibrary.isNumber(messageText)){
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     let chosenNumb = Number(messageText)
//     let employeesArr = userStates[userId].employeesArr
//     if (chosenNumb > employeesArr.length || chosenNumb < 1){
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     let chosenName = employeesArr[chosenNumb-1];

//     let text1 = "Выберите свою Фамилию Имя еще раз:\n(введите и отправьте только номер, который перед Вашим именем)\n";
//     let buttonsObjsArr = getEmployeesFromGraphic();
//     let employeesText = getTextFromEmployeesArr( buttonsObjsArr )
//     text1 = text1+"\n"+employeesText
//     text1 += "\n"+"Если не нашли свою Фамилию Имя обратитесь к руководству."

//     if (!userStates[userId]) userStates[userId] = {};
//     userStates[userId].isWaitingEnterNameMy2 = true;
//     userStates[userId].chosenName = chosenName
//     userStates[userId].employeesArr = buttonsObjsArr
//     userStates[userId].lastText = messageText
//     delete userStates[userId].isWaitingEnterNameMy1

//     // Сохраняем обновленные состояния
//     PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(userStates));

//     sendText(chatId,text1,keyBoard);
//     return
//   }
//   if (userStates[userId] && userStates[userId].isWaitingEnterNameMy2) { // Регистрация ЭТАП 2 - СВОЕ ИМЯ 2
//     if (messageText=="" || messageText==undefined){
//       userStates[userId].isWaitingEnterNameMy1 = true
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     if (!MainLibrary.isNumber(messageText)){
//       userStates[userId].isWaitingEnterNameMy1 = true
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     let chosenNumb = Number(messageText)
//     let employeesArr = userStates[userId].employeesArr
//     if (employeesArr && (chosenNumb > employeesArr.length || chosenNumb < 1)){
//       userStates[userId].isWaitingEnterNameMy1 = true
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     // let nameMy = userStates[userId].chosenName;
//     // let nameT = employeesArr[chosenNumb-1];

//     // insertNewEmployeesTelegrId( userId, nameMy, nameT )

//     if (!userStates[userId]) userStates[userId] = {};
//     userStates[userId].lastText = messageText
//     if (employeesArr){
//       userStates[userId].isWaitingEnterNameMy3 = true
//       userStates[userId].nameT = employeesArr[chosenNumb-1];
//     }

//     // delete userStates[userId].chosenName
//     delete userStates[userId].employeesArr
//     if (userStates[userId].isWaitingEnterNameMy1)
//       delete userStates[userId].isWaitingEnterNameMy1
//     delete userStates[userId].isWaitingEnterNameMy2

//     // Сохраняем обновленные состояния
//     PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(userStates));

//     let text1 = "Введите последние 4 цифры своего номера телефона:"
//     sendText(chatId,text1,keyBoard)
//     // sendText(chatId,"Вы успешно зарегистрировались.");
//     return
//   }
//   if (userStates[userId] && userStates[userId].isWaitingEnterNameMy3) { // Регистрация ЭТАП 3 - ПОСЛЕДНИЕ 4 ЦИФРЫ НОМЕРА ТЕЛЕФОНА
//     if (messageText=="" || messageText==undefined){
//       userStates[userId].isWaitingEnterNameMy2 = true
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     if (!MainLibrary.isNumber(messageText)){
//       userStates[userId].isWaitingEnterNameMy2 = true
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }
//     let chosenNumb = Number(messageText)
//     let nameMy = userStates[userId].chosenName;
//     let last4NumbsOfThisUserId = getLast4NumbsOfPhone( nameMy )
//     if (chosenNumb!=last4NumbsOfThisUserId){
//       userStates[userId].isWaitingEnterNameMy2 = true
//       sendText(chatId,"Введенные данные не соответствуют.")
//       employeeRegistration(userId,chatId,userStates[userId].lastText)
//       return
//     }

//     let nameT = userStates[userId].nameT;

//     let newUser = insertNewEmployeesTelegrId( userId, nameMy, nameT )
//     CURR_USER = newUser

//     if (!userStates[userId]) userStates[userId] = {};
//     if (userStates[userId].isWaitingEnterNameMy2)
//       delete userStates[userId].isWaitingEnterNameMy2
//     delete userStates[userId].isWaitingEnterNameMy3
//     delete userStates[userId].nameT
//     delete userStates[userId].lastText

//     // Сохраняем обновленные состояния
//     PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(userStates));

//     sendText(chatId,"Регистрация прошла успешно.");
//     return 333
//   }
  
//   if (messageText!="-1" && messageText!=-1){
//     employeeRegistration(userId,chatId,-1)
//   }


// }





