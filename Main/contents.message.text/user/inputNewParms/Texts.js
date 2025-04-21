function getTextForInputUserParameterByUserStates( paramStr ){
  let returnObj = {}
  returnObj.text1 = ""
  returnObj.text100 = ""
  if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.nameMy){
    returnObj.text1 = "1. Введите свои данные:\nФамилия Имя\nСоблюдайте именно такую последовательность (сначала Фамилия, потом Имя), с заглавных букв.\nПример:\n\nЛукьяненко Сергей"
    returnObj.text100 = "Введите данные пользователя:\nФамилия Имя\nСоблюдайте именно такую последовательность (сначала Фамилия, потом Имя), с заглавных букв.\nПример:\n\nЛукьяненко Сергей"
  }else if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs){
    returnObj.text1 = "2. Введите свои данные:\nНомер телефона (без знака \"+\", без 8 или 375 в начале и без скобок), только код оператора (2 цифры) и номер телефона (7 цифр).\nПример:\n\n445310075"
    returnObj.text100 = "Введите данные пользователя:\nНомер телефона (без знака \"+\", без 8 или 375 в начале и без скобок), только код оператора (2 цифры) и номер телефона (7 цифр).\nПример:\n\n445310075"
  }else if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail){
    returnObj.text1 = "3. Введите свои данные:\nПочту gmail (почта исключительно Google (@gmail), никакая другая. Если у Вас ее нет, значит, необходимо ее создать)\nПример:\n\npostexample@gmail.com"
    returnObj.text100 = "Введите данные пользователя:\nПочту gmail (почта исключительно Google (@gmail), никакая другая. Если ее нет, значит, необходимо ее создать)\nПример:\n\npostexample@gmail.com"
  }else if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.accessStatus){
    returnObj.text100 = "Введите порядковый номер статуса из списка на который хотите изменить значение статуса:"
  }
  return returnObj
}
function getTextOfMistakeInputUserParameterByUserStates( paramStr ){
  let returnObj = {}
  returnObj.text1 = ""
  returnObj.text2 = ""
  if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.nameMy){
    returnObj.text1 = "Некорректный ввод.\nВнимательно прочитайте правила ввода Фамилия Имя.\nПопробуйте ещё."
  }else if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.telephs){
    returnObj.text1 = "Некорректный ввод.\nВнимательно прочитайте правила ввода своего номера телефона.\nПопробуйте ещё."
  }else if (paramStr==USER_OBJECT_PARAMETERS_FOR_READ_WRITE.gmail){
    returnObj.text1 = "Некорректный ввод.\nВнимательно прочитайте требуемые параметры для вводимого gmail.\nПопробуйте ещё."
    returnObj.text2 = "Такого аккаунта в экосистеме Google не существует.\nПроверьте внимательно вводимый gmail.\nПопробуйте ещё."
  }
  return returnObj
}