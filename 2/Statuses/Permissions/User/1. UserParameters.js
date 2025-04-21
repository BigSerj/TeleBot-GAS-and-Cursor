class AllUsersParametersTitlesObj{
  constructor(){
    this.map=new Map();
  }
  setInMap(title,str){
    if (title && str && str!="")
      this.map.set(title,{title,str})
  }
  getTextFromMap(concatter){
    if (!concatter)
      concatter = "\n"
    let iCounter = 1;
    let text = "";
    for (let iObj of this.map.values()){
      if (text!="")
        text+=concatter
      text += iCounter+". "+iObj.title+": "+iObj.str
      iCounter++
    }
    return text
  }
}
function getUserParametersArrForReadAndWrite( searchUser ){ // buttonObj.curr_user_telegramId
  /**
   * составляем список параметров пользователя с telegramId==curr_user_telegramId, которые можно показать CURR_USER-у
   * 
   * ОШИБКИ:
   * -1 - пользователь searchUser не найден
   * -2 - у Вас недостаточно прав для просмотра параметров этого сотрудника
   * 
   */

  if (!searchUser)
    return -1
  let workingRelationships = getUsersWorkRelashionshipStatus( searchUser ); // смотрим кем приходится searchUser по отношению к CURR_USER
  
  let textRowsObj = new AllUsersParametersTitlesObj();
  if (!workingRelationships){ // если у сотрудника отсутствует какая-либо присвоенная позиция в компании, т.е. он тот, кому еще не присвоили должность, но он уже прошел регистрацию
    if (!compareAccessPermissionsForGetStatus( getHighManagersAndHRNetWorkManagerRolesPermissions(), CURR_USER )) // иметь доступ к незарегистрированным могут только Я,Катя,Татьяна
      return -2
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.nameMy, searchUser.getNameMy() )
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs, MainLibrary.arrayToString(searchUser.getTelephoneNumberArr(),",") )
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail, MainLibrary.arrayToString(searchUser.getGmailsArr(),",") )

    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.accessStatus, searchUser.getAccessStatusInString() )
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.department, searchUser.getDepartmentInString() )
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.empoyeePosition, searchUser.getEmpoyeePositionInString() )
    textRowsObj.setInMap( USER_OBJECT_PARAMETERS_FOR_READ_WRITE.empoyeeStatus, searchUser.getEmpoyeeStatusInString() )

  }else if (workingRelationships==1){ // НИЖЕ рангом

  }else if (workingRelationships==2){ // РАВНЫЙ ранг
    
  }else if (workingRelationships==3){ // ВЫШЕ рангом
    
  }

  return textRowsObj.getTextFromMap()

}
































































