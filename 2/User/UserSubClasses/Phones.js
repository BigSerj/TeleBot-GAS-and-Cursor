function NewPhonesClass(){
  return new PhonesClass()
}
class PhonesClass extends ParametersInArrayClassFunc(){
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