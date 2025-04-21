// var employeersSheetId = "1baxx5AqXt8sjAjAicAzUq2NWgpFbFavX8uJN9haPcts";

// var employeesInWorkList;
// var telegramsList;
// function getEmployeesInWorkList(){
//   if (employeesInWorkList!=undefined)
//     return employeesInWorkList
//   let sheetS = SpreadsheetApp.openById(employeersSheetId);
//   employeesInWorkList = sheetS.getSheetByName("Действующие");
//   return employeesInWorkList
// }
// function getTelegramsList(){
//   if (telegramsList!=undefined)
//     return telegramsList
//   let sheetS = SpreadsheetApp.openById(employeersSheetId);
//   telegramsList = sheetS.getSheetByName("telegrIds");
//   return telegramsList
// }


// function getObjByIdAndNames( id, nameMy, nameT ){
//   let obj = {}
//   obj.id = id.toString()
//   obj.nameMy = nameMy.toString()
//   obj.nameT = nameT.toString()
//   obj.status = STATUSES_OBJ.employee
//   return obj
// }



// function getUserObjByTelegrId( telegrId ){
//   let telegrList = getTelegramsList();
//   if (telegrList.getLastRow()==0)
//     return
//   let idsRange = telegrList.getRange(1,1,telegrList.getLastRow()).getValues();
//   let col1Arr = MainLibrary.fromRangetoArray( idsRange )
//   for (let i=0;i<col1Arr.length;i++){
//     let iObj = MainLibrary.getParsedObjFromGSheetCell( col1Arr[i] );
//     if (iObj.id==telegrId) 
//       return iObj
//   }
// }
// function getStatusOfUser( userId ){
//   let userObj = getUserObjByTelegrId( userId )
//   if (userObj) 
//     return userObj.status
// }
// function getNameMyByTelegrId( userId ){
//   let userObj = getUserObjByTelegrId( userId )
//   if (userObj) 
//     return userObj.nameMy
// }
// function isNeedToRegisteredEmployee(telegrId){
//   if (getNameMyByTelegrId( telegrId )==undefined)
//     return true
// }
// function getRegisteredEmployeers(){
//   let telegrList = getTelegramsList();
//   if (telegrList.getLastRow()==0)
//     return
//   let namesArr = []
//   let idsRange = telegrList.getRange(1,1,telegrList.getLastRow()).getValues();
//   let col1Arr = MainLibrary.fromRangetoArray( idsRange )
//   for (let i=0;i<col1Arr.length;i++){
//     let iObj = MainLibrary.getParsedObjFromGSheetCell( col1Arr[i] );
//     namesArr.push( iObj.nameMy )
//   }
//   return namesArr
// }
// function isEmployeeInWork( employeeNameMy ){
//   if (MainLibrary.isInArrayWithLowerCase( getEmploeersInWorkArr(), employeeNameMy ))
//     return true
// }
// function isEmployeeInWorkByTelegId( telegrId ){
//   let employeeNameMy = getNameMyByTelegrId( telegrId )
//   if (isEmployeeInWork( employeeNameMy ))
//     return true
// }
// function isItDeletedEmployee( telegrId ){ // если сотрудник есть в списке telegrId но нет в списке актуальных значит его удаляли
//   let employeeNameMy = getNameMyByTelegrId( telegrId )
//   if (employeeNameMy==undefined)
//     return
//   if (!isEmployeeInWork( employeeNameMy ))
//     return true
// }
// function getEmploeersInWorkArr() {
//   let emplsList = getEmployeesInWorkList();
//   if (emplsList.getLastRow()==0)
//     return []
//   let allEmplsInWorkRange = emplsList.getRange(1,1,emplsList.getLastRow()).getValues();
//   return MainLibrary.fromRangetoArray( allEmplsInWorkRange );
// }
// function insertNewEmployeesTelegrId( telegId, nameMy, nameT ){
//   let telegrList = getTelegramsList()
//   let lastEmptyRow = telegrList.getLastRow();
//   if (lastEmptyRow==0)
//     telegrList.insertRowBefore(1)
//   else{
//     let idsArr = telegrList.getRange(1,1,lastEmptyRow).getValues();
//     // если уже есть такой id - выходим и ничего не записываем.
//     for (let i=0;i<idsArr.length;i++)
//       if (idsArr[i][0]==telegId)
//         return
//     telegrList.insertRowAfter(lastEmptyRow)
//   }
//   telegrList.getRange(lastEmptyRow+1,1).setValue( getObjByIdAndNames( telegId, nameMy, nameT ) );
// }



// function getLast4NumbsOfPhone( nameMy ){
//   let emplsList = getEmployeesInWorkList()
//   if (emplsList.getLastRow()==0)
//     return
//   let idsRange = emplsList.getRange(1,1,emplsList.getLastRow(),3).getValues();
//   let telephNumb
//   for (let i=0;i<idsRange.length;i++)
//     if (idsRange[i][0]==nameMy){
//       telephNumb = idsRange[i][2]
//       break
//     }
//   if (!telephNumb)
//     return
//   return telephNumb.toString().replace(/\D/g, '').slice(-4);
// }




























































































