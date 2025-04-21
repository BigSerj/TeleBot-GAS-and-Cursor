function compareAccessPermissionsForGetStatus( permissionsObj, user ){
  if (!permissionsObj || !user)
    return
  function comparePermissionObjAndUserStatuses( permissionsArr, userPermission ){
    if (permissionsArr.length==0 && userPermission.length==0)
      return true
    if (MainLibrary.isInArray( permissionsArr, userPermission ))
      return true
  }
  if (user.isAccessStatusDeveloper()) // если статус пользователя Разработчик - добавляем сразу без доп.проверок
    return true
  if (
    comparePermissionObjAndUserStatuses( permissionsObj.getUserAccessArr(), user.getAccessStatus() )
    &&
    comparePermissionObjAndUserStatuses( permissionsObj.getEmployeesHierarhyArr(), user.getEmpoyeePosition() )
    &&
    comparePermissionObjAndUserStatuses( permissionsObj.getEmploymentStatusArr(), user.getEmpoyeeStatus() )
    &&
    comparePermissionObjAndUserStatuses( permissionsObj.getRegistrationStageArr(), user.getRegistrationStage() )
  )
  return true
}
function getAllUsersWithThisStatus( permissionsObj ){
  let filteredUsersArr = [];
  let allUsersArr = FIREBASE.getAllUsersArr();
  for (let i=0;i<allUsersArr.length;i++)
    if ( compareAccessPermissionsForGetStatus( permissionsObj, allUsersArr[i] ) )
      filteredUsersArr.push( allUsersArr[i] )
  return filteredUsersArr;
}

function sendMessToUsersArr( usersObjArr, textMess, keyBoardButtNumbsArr, curr_user_telegramId ){
  let keyBoard
  if (keyBoardButtNumbsArr){
    let buttonsObjsArr = getAllButtonsObjsArrByFuncNambsArr( keyBoardButtNumbsArr, curr_user_telegramId );
    keyBoard = getGreenKeyboardByButObjsArr( buttonsObjsArr )
  }
  for (let i=0;i<usersObjArr.length;i++)
    sendText(usersObjArr[i].getTelegrId(),textMess,keyBoard);
}

