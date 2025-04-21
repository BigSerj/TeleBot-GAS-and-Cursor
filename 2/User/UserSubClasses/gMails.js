function NewGmailsClass(){
  return new GmailsClass()
}
class GmailsClass extends ParametersInArrayClassFunc(){
  constructor(){
    super()
  }
  loadAllObjectsFromDB( objFromDB ){
    Object.assign(this, objFromDB);
  }
  addNewVal(newVal){
    super.addNewVal(newVal)
  }
}