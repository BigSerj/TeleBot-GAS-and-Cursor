var USER_STATUSES_MEMORY_ANSWER = {
  
  curr_user_telegramId:"-0", // telegram id 
  messageText:"-0", // сохраненное сообщение из предыдущего общения (обычно предыдущее сообщение)
  numbToChange:"-0", // 

  waitAnswerCode : { // фиксируем на каком этапе меню мы вообще находимся, чтобы было однозначное понимание где мы сейчас и что должно происходить далее, какие проверки проходить и тп
    changeParametersOfUserStep1:"changeParametersOfUserStep1",
    changeParametersOfUserStep2:"changeParametersOfUserStep2",
  },

  whatWeWantToChange : { // если речь идет про изменения параметров пользователя, тогда фиксируем это здесь
    userParameters : { // базовые параметры:
      accessStatus:"accessStatus",
      department:"department",
      empoyeePosition:"empoyeePosition",
      empoyeeStatus:"empoyeeStatus",
    }



  },
 

  


  
}