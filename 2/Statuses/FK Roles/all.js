function setStandardUserAccessStatus( userObj ){
  userObj.setAccessStatusUser()
  userObj.setCrossDepartment()
  userObj.setEmpoyeeStatusEmployed()
  return userObj
}
function setOwnerRole( userObj ){
  userObj = setStandardUserAccessStatus( userObj )
  userObj.setEmpoyeePositionOwner()
  return userObj
}
function setManagerRetailNetworkRole( userObj ){
  userObj = setStandardUserAccessStatus( userObj )
  userObj.setEmpoyeePositionManagerRetailNetwork()
  return userObj
}