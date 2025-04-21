function getEmployeesHierarhyWeightsMap(){
  let employeesHierarhyWeightsMap = new Map()

  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.owner, 1000 )
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.managerRetailNetwork, 900 )
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.buyer, 800 )
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.adminInOffice, 800 )
  
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.pastererMaster, 100 )

  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.repairman, 100 )
  
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.seller, 100 )
  employeesHierarhyWeightsMap.set( EMPLOYEES_HIERARHY.pasterer, 100 )

  return employeesHierarhyWeightsMap
}
function getHierarhysObjByPosition( employeePosition ){
  let employeesHierarhyWeightsMap = getEmployeesHierarhyWeightsMap()
  let hierarhysObj = {
    bossesArr:[],
    colleguesArr:[],
    subordinatesArr:[],
  }
  let employeesWeight = employeesHierarhyWeightsMap.get(employeePosition)
  for (let iMap of employeesHierarhyWeightsMap){
    let iEmployeePosition = iMap[0]
    let iEmployeeWeight = iMap[1]
    if (iEmployeePosition==employeePosition)
      continue
    if (iEmployeeWeight > employeesWeight)
      hierarhysObj.bossesArr.push( iEmployeePosition )
    else if (iEmployeeWeight == employeesWeight)
      hierarhysObj.colleguesArr.push( iEmployeePosition )
    else if (iEmployeeWeight < employeesWeight)
      hierarhysObj.subordinatesArr.push( iEmployeePosition )
  } 
  return hierarhysObj
}



function getUsersWorkRelashionshipStatus( searchUser ){
  // если searchUser.getEmpoyeePosition()==undefined это значит что у этого user не установлена должность, только статус intern, в таком случае вся функция возвращает undefined
  if (MainLibrary.isInArray( CURR_USER.getSubordinatesArr(), searchUser.getEmpoyeePosition() )) // если searchUser находится в подчинении у CURR_USER
    return 1 // НИЖЕ рангом
  else if (MainLibrary.isInArray( CURR_USER.getColleguesArr(), searchUser.getEmpoyeePosition() )) // если searchUser находится на уровне ранга CURR_USER
    return 2 // РАВНЫЙ ранг
  else if (MainLibrary.isInArray( CURR_USER.getBossesArr(), searchUser.getEmpoyeePosition() )) // если searchUser является начальником у CURR_USER
    return 3 // ВЫШЕ рангом
}





















