class UserStatesClass{
  constructor(){
    this.userStates;
    this.load();
  }
  reloadAllUserStates(){
    PropertiesService.getScriptProperties().setProperty('userStates',{});
  }
  load(){
    if (typeof this.userStates === 'undefined') {
      this.userStates = PropertiesService.getScriptProperties().getProperty('userStates');
      this.userStates = this.userStates ? JSON.parse(this.userStates) : {};
    }
  }
  save(){
    PropertiesService.getScriptProperties().setProperty('userStates', JSON.stringify(this.userStates));
  }
  getByTgId( tgId ){
    if (!this.userStates[tgId])
      return {}
    return this.userStates[tgId]
  }
  syncAndSaveUserWithTgId( tgId, user ){
    this.userStates[tgId] = user.user
    this.save()
  }
}
class UserStatesTgClass{
  constructor( user ){
    this.user = user // это всегда объект {} сопряженный по логике с USER_STATUSES_MEMORY_ANSWER
  }
  //////////////////////////////////////////////////////
  getCurrTgId(){
    return this.user.curr_user_telegramId
  }
  setCurrTgId(curr_user_telegramId){
    this.user.curr_user_telegramId = curr_user_telegramId
  }
  clearCurrTgId(){
    this.setCurrTgId()
  }
  //////////////////////////////////////////////////////
  getMessageText(){
    return this.user.messageText
  }
  setMessageText(messageText){
    this.user.messageText = messageText
  }
  clearMessageText(){
    this.setMessageText()
  }
  //////////////////////////////////////////////////////
  getWaitAnswerCode(){
    return this.user.waitAnswerCode
  }
  setWaitAnswerCode( waitAnswerCode ){
    this.user.waitAnswerCode = waitAnswerCode
  }
  clearWaitAnswerCode(){
    this.setWaitAnswerCode()
  }
  //////////////////////////////////////////////////////
  getWhatWeWantToChange(){
    return this.user.whatWeWantToChange
  }
  setWhatWeWantToChange( whatWeWantToChange ){
    this.user.whatWeWantToChange = whatWeWantToChange
  }
  clearWhatWeWantToChange(){
    this.setWhatWeWantToChange()
  }
  //////////////////////////////////////////////////////

}