function getStringFromObjectsParameters( paramStr ){
  let returnObj = {}
  returnObj.text1 = ""
  returnObj.text100 = ""
  if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.accessStatus){
    let arrayString = MainLibrary.getFormObjectsValuesArr( USER_ACCESS )
    let arr2 = []
    for (let i=0;i<arrayString.length;i++)
      arr2.push( getUSER_ACCESS_IN_STRING( arrayString[i] ) )
    returnObj.text100 = MainLibrary.fromArrayToRow( arr2,"\n",true)
  }
  return returnObj
}