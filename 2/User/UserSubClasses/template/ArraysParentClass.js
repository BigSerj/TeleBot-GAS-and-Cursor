function ParametersInArrayClassFunc(){
  return class ParametersInArrayClass {
    constructor(){
      this.valsArr = []
    }
    saveInDB(key){
      saveToFirebaseOOO(key,this.valsArr)
    }
    readFromDB(key){
      let valsArr = readFromFirebase(key);
      if (valsArr)
        this.valsArr = valsArr
    }
    getValsArr(){
      return this.valsArr
    }
    addNewVal( newVal ){
      if (!MainLibrary.isInArray(this.valsArr,newVal)){
        this.valsArr.push( newVal )
        return 1
      }
      return -1
    }
  }
}