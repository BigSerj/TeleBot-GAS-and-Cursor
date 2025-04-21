function getTextFromEmployeesArr( buttonsObjsArr ){
  let text = ""
  for (let i=0;i<buttonsObjsArr.length;i++)
    text += (i+1)+". "+buttonsObjsArr[i]+"\n"
  return text
}
function getOnlyDontRegisteredNamesArr(){
  let notRegisteredNamesArr = [];
  let emploeersInWorkArr = getEmploeersInWorkArr();
  let registeredEmployeers = getRegisteredEmployeers();
  for (let i=0;i<emploeersInWorkArr.length;i++)
    if (!MainLibrary.isInArrayWithLowerCase(registeredEmployeers,emploeersInWorkArr[i]))
      notRegisteredNamesArr.push( emploeersInWorkArr[i] )
  return notRegisteredNamesArr
}
