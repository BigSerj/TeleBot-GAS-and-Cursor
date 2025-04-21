function isItDeletedEmployee( userId ) {
  let userObj = GET_USER_OBJ(userId)
  if (userObj){
    if (userObj.isBlocked){
      return true
    }
  }
}
function isNeedToRegisteredEmployee( userId ){
  let userObj = GET_USER_OBJ(userId)
  if (!userObj)
    return true
  if (!userObj.nameMy || !userObj.nameT)
    return true
}
function insertNewEmployeesTelegrId( userId, nameMy, nameT ){
  let newUser = new User(userId, nameMy, nameT, USER_ACCESS.unknown)
  SET_USER_OBJ(userId,newUser)
  return newUser
}