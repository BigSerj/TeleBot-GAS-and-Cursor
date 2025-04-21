// TODO: Добавить импорты для NewPhonesClass, NewGmailsClass, констант (USER_ACCESS и т.д.), MainLibrary
// import { USER_ACCESS, EMPLOYMENT_STATUS, REGISTRATION_STAGE } from '../constants/statuses';
// import { DEPARTMENT, EMPLOYEES_HIERARHY } from '../constants/roles';

class User{
  constructor(userId){
    this.telegrId = userId
    
    ////////////////////
    this.nameMy // ФИО
    this.telephoneNumbersObj = NewPhonesClass() // TODO: Пересмотреть использование классов для телефонов/почты
    this.gmailsObj = NewGmailsClass()
    this.nameT // Имя в таблице?
    ////////////////////


    ////////////////////
    this.accessStatus // Статус доступа (developer, user, unknown, blocked)
    this.department // Отдел
    this.registrationStage // Этап регистрации
    this.empoyeePosition // Должность
    this.empoyeeStatus // Статус сотрудника (стажер, уволен и т.д.)

    this.setAccessStatusUnknown() // По умолчанию - неизвестный
    ////////////////////


    ////////////////////
    // Чаты FK:
    this.chatLinkFK
    this.chatLinkFKAdmin
    this.chatLinkFKProducts
    this.chatLinkRepair
    ////////////////////
    this.registrationTimeInMillis // время ргистрации сотрудника в БД (в миллисекундах от 1970г)
    this.dateOfEmploymentInMillis // время приема сотрудника на работу (в миллисекундах от 1970г)
    ////////////////////


  }
  ////////////////////////////////////////////////
  // Метод для загрузки данных из объекта Firebase
  loadAllObjectsFromDB( userFromDB ){
    Object.assign(this, userFromDB);
    // Восстанавливаем объекты классов для телефонов/почты
    // TODO: Проверить, нужны ли эти классы или можно хранить массивы строк
    if (userFromDB.telephoneNumbersObj) {
      this.telephoneNumbersObj = NewPhonesClass()
      this.telephoneNumbersObj.loadAllObjectsFromDB( userFromDB.telephoneNumbersObj )
    } else {
      this.telephoneNumbersObj = NewPhonesClass()
    }
    if (userFromDB.gmailsObj) {
      this.gmailsObj = NewGmailsClass()
      this.gmailsObj.loadAllObjectsFromDB( userFromDB.gmailsObj )
    } else {
      this.gmailsObj = NewGmailsClass();
    }
    // TODO: Добавить проверку наличия полей в userFromDB
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // --- Основные идентификаторы и данные ---
  getTelegrId(){
    return this.telegrId
  }
  // setTelegrId(telegrId){ // Обычно ID не меняется
  //   this.telegrId = telegrId
  // }
  getNameMy(){
    return this.nameMy
  }
  setNameMy(nameMy){
    this.nameMy = nameMy
  }
  getNameT(){
    return this.nameT
  }
  setNameT(nameT){
    this.nameT = nameT
  }
  ////////////////////////////////////////////////
  // --- Телефоны --- 
  getTelephoneNumberArr(){
    // Проверка на случай, если объект не был создан при загрузке
    return this.telephoneNumbersObj ? this.telephoneNumbersObj.getValsArr() : [];
  }
  addTelephoneNumber(telephoneNumber){ 
    if (!this.telephoneNumbersObj) this.telephoneNumbersObj = NewPhonesClass();
    this.telephoneNumbersObj.addNewVal( telephoneNumber )
  }
  // TODO: Методы для удаления, основного номера?
  ////////////////////////////////////////////////
  // --- Почта --- 
  getGmailsArr(){
    return this.gmailsObj ? this.gmailsObj.getValsArr() : [];
  }
  addGmail(gmail){
    if (!this.gmailsObj) this.gmailsObj = NewGmailsClass();
    this.gmailsObj.addNewVal(gmail)
  }
  // TODO: Методы для удаления, основной почты?
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // --- Даты --- 
  getRegistrationTimeInMillis(){
    return this.registrationTimeInMillis 
  }
  getRegistrationTimeInDateTimeObj(){
    // TODO: Вынести форматирование в utils/formatters.js
    return this.registrationTimeInMillis ? MainLibrary.getDateTimeNormalStringYMDHMSW( this.registrationTimeInMillis, getOnlyStandardYMDHMS() ) : '-';
  }
  setRegistrationTimeInMillis(){
    if (!this.registrationTimeInMillis)
      this.registrationTimeInMillis = Date.now()
  }
  getDateOfEmploymentInMillis(){
    return this.dateOfEmploymentInMillis
  }
  getDateOfEmploymentInDateTimeObj(){
    return this.dateOfEmploymentInMillis ? MainLibrary.getDateTimeNormalStringYMDHMSW( this.dateOfEmploymentInMillis, getOnlyStandardYMD() ) : '-';
  }
  setDateOfEmploymentInMillis(){
    if (!this.dateOfEmploymentInMillis)
      this.dateOfEmploymentInMillis = Date.now()
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // --- Ссылки на чаты (TODO: Возможно, вынести в настройки/константы?) ---
  getChatLinkFK(){
    return this.chatLinkFK
  }
  setChatLinkFK( chatLinkFK ){
    if (chatLinkFK)
      this.chatLinkFK = chatLinkFK
  }
  getChatLinkFKAdmin(){
    return this.chatLinkFKAdmin
  }
  setChatLinkFKAdmin( chatLinkFKAdmin ){
    if (chatLinkFKAdmin)
      this.chatLinkFKAdmin = chatLinkFKAdmin
  }
  getChatLinkFKProducts(){
    return this.chatLinkFKProducts
  }
  setChatLinkFKProducts( chatLinkFKProducts ){
    if (chatLinkFKProducts)
      this.chatLinkFKProducts = chatLinkFKProducts
  }
  getChatLinkRepair(){
    return this.chatLinkRepair
  }
  setChatLinkRepair( chatLinkRepair ){
    if (chatLinkRepair)
      this.chatLinkRepair = chatLinkRepair
  }
  // --- Ссылки на каналы (Убраны TODO) ---
  getChannelLinkFKInfo(){
    return "https://t.me/+cMWLWUAFeLs4Njgy"
  }
  getChannelLinkFKArmoredFilm(){
    return "https://t.me/+Jhe2HbmDBGRmMGIy"
  }
  getChannelLinkFKRepair(){
    return "https://t.me/+hcso15CU6ZI4Zjhi"
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // --- Статус доступа --- 
  getAccessStatus(){
    return this.accessStatus
  }
  setAccessStatus(accessStatus){
    this.accessStatus = accessStatus
  }
  // Сеттеры для конкретных статусов
  setAccessStatusDeveloper(){
    this.setAccessStatus(USER_ACCESS.DEVELOPER)
  }
  setAccessStatusUser(){
    this.setAccessStatus(USER_ACCESS.USER)
  }
  setAccessStatusUnknown(){
    this.setAccessStatus(USER_ACCESS.UNKNOWN)
  }
  setAccessStatusBlocked(){
    this.setAccessStatus(USER_ACCESS.BLOCKED)
  }
  // Геттеры-проверки
  isAccessStatusDeveloper(){
    return this.getAccessStatus()==USER_ACCESS.DEVELOPER
  }
  isAccessStatusUser(){
    return this.getAccessStatus()==USER_ACCESS.USER
  }
  isAccessStatusUnknown(){
    return this.getAccessStatus()==USER_ACCESS.UNKNOWN
  }
  isAccessStatusBlocked(){
    return this.getAccessStatus()==USER_ACCESS.BLOCKED
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // --- Отдел --- 
  getDepartment(){
    return this.department
  }
  setDepartment(department){
    this.department = department
  }
  // Сеттеры для конкретных отделов
  setCrossDepartment(){
    this.setDepartment(DEPARTMENT.CROSS_DEPART)
  }
  setRetailSalesDepartment(){
    this.setDepartment(DEPARTMENT.RETAIL_SALES)
  }
  setOnlineSalesDepartment(){
    this.setDepartment(DEPARTMENT.ONLINE_SALES)
  }
  setPastingSalesDepartment(){
    this.setDepartment(DEPARTMENT.PASTING)
  }
  setRepairSalesDepartment(){
    this.setDepartment(DEPARTMENT.REPAIR)
  }
  // Геттеры-проверки
  isCrossDepartment(){
    return this.getDepartment()==DEPARTMENT.CROSS_DEPART
  }
  isRetailSalesDepartment(){
    return this.getDepartment()==DEPARTMENT.RETAIL_SALES
  }
  isOnlineSalesDepartment(){
    return this.getDepartment()==DEPARTMENT.ONLINE_SALES
  }
  isPastingSalesDepartment(){
    return this.getDepartment()==DEPARTMENT.PASTING
  }
  isRepairSalesDepartment(){
    return this.getDepartment()==DEPARTMENT.REPAIR
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // --- Должность --- 
  getEmpoyeePosition(){
    return this.empoyeePosition
  }
  setEmpoyeePosition(empoyeePosition){
    this.empoyeePosition = empoyeePosition
  }
  // Сеттеры для должностей
  setEmpoyeePositionOwner(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.OWNER)
  }
  setEmpoyeePositionManagerRetailNetwork(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.MANAGER_RETAIL_NETWORK)
  }
  setEmpoyeePositionBuyer(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.BUYER)
  }
  setEmpoyeePositionAdminInOffice(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.ADMIN_IN_OFFICE)
  }
  setEmpoyeePositionPastererMaster(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.PASTERER_MASTER)
  }
  setEmpoyeePositionRepairman(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.REPAIRMAN)
  }
  setEmpoyeePositionSeller(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.SELLER)
  }
  setEmpoyeePositionPasterer(){
    this.setEmpoyeePosition(EMPLOYEES_HIERARHY.PASTERER)
  }
  // Геттеры-проверки
  isEmpoyeePositionUnknown(){
    // TODO: Добавить EMPLOYEES_HIERARHY.UNKNOWN ?
    return !this.getEmpoyeePosition(); 
  }
  isEmpoyeePositionOwner(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.OWNER
  }
  isEmpoyeePositionManagerRetailNetwork(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.MANAGER_RETAIL_NETWORK
  }
  isEmpoyeePositionBuyer(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.BUYER
  }
  isEmpoyeePositionAdminInOffice(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.ADMIN_IN_OFFICE
  }
  isEmpoyeePositionPastererMaster(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.PASTERER_MASTER
  }
  isEmpoyeePositionRepairman(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.REPAIRMAN
  }
  isEmpoyeePositionSeller(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.SELLER
  }
  isEmpoyeePositionPasterer(){
    return this.getEmpoyeePosition()==EMPLOYEES_HIERARHY.PASTERER
  }
  ////////////////////////////////////////////////
  // TODO: Логика иерархии (начальники/подчиненные) - возможно, вынести в PermissionService?
  getBossesArr(){
    return "??" // TODO: Реализовать
  }
  getColleguesArr(){
    return "??" // TODO: Реализовать
  }
  getSubordinatesArr(){
    return "??" // TODO: Реализовать
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // --- Статус сотрудника --- 
  getEmpoyeeStatus(){
    return this.empoyeeStatus
  }
  setEmpoyeeStatus(empoyeeStatus){
    this.empoyeeStatus = empoyeeStatus
  }
  // Сеттеры
  setEmpoyeeStatusIntern(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.INTERN)
  }
  setEmpoyeeStatusOnProbation(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.ON_PROBATION)
  }
  setEmpoyeeStatusEmployed(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.EMPLOYED)
  }
  setEmpoyeeStatusOnLeave(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.ON_LEAVE)
  }
  setEmpoyeeStatusSuspended(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.SUSPENDED)
  }
  setEmpoyeeStatusFired(){
    this.setEmpoyeeStatus(EMPLOYMENT_STATUS.FIRED)
  }
  // Геттеры-проверки
  isEmpoyeeStatusIntern(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.INTERN
  }
  isEmpoyeeStatusOnProbation(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.ON_PROBATION
  }
  isEmpoyeeStatusEmployed(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.EMPLOYED
  }
  isEmpoyeeStatusOnLeave(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.ON_LEAVE
  }
  isEmpoyeeStatusSuspended(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.SUSPENDED
  }
  isEmpoyeeStatusFired(){
    return this.getEmpoyeeStatus()==EMPLOYMENT_STATUS.FIRED
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // --- Этап регистрации --- 
  getRegistrationStage(){
    return this.registrationStage
  }
  setRegistrationStage(registrationStage){
    this.registrationStage = registrationStage
  }
  // Сеттеры
  setRegistrationStageWaitingInputNameMy(){
    this.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_NAME_MY)
  }
  setRegistrationStageWaitingInputTel(){
    this.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_TEL)
  }
  setRegistrationStageWaitingInputGmail(){
    this.setRegistrationStage(REGISTRATION_STAGE.WAITING_INPUT_GMAIL)
  }
  setRegistrationStageWaitingVerificationByManager(){
    this.setRegistrationStage(REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER)
  }
  setRegistrationStageRegistered(){
    this.setRegistrationStage(REGISTRATION_STAGE.REGISTERED)
  }
  // Геттеры-проверки
  isRegistrationStageEmpty(){
    // Считаем пустым, если статус UNKNOWN и этап не задан
    return this.isAccessStatusUnknown() && !this.getRegistrationStage(); 
  }
  isRegistrationStageWaitingInputNameMy(){
    return this.getRegistrationStage()==REGISTRATION_STAGE.WAITING_INPUT_NAME_MY
  }
  isRegistrationStageWaitingInputTel(){
    return this.getRegistrationStage()==REGISTRATION_STAGE.WAITING_INPUT_TEL
  }
  isRegistrationStageWaitingInputGmail(){
    return this.getRegistrationStage()==REGISTRATION_STAGE.WAITING_INPUT_GMAIL
  }
  isRegistrationStageWaitingVerificationByManager(){
    return this.getRegistrationStage()==REGISTRATION_STAGE.WAITING_VERIFICATION_BY_MANAGER
  }
  isRegistrationStageRegistered(){
    return this.getRegistrationStage()==REGISTRATION_STAGE.REGISTERED
  }
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // Получение параметра по ключу (используется для редактирования?)
  // TODO: Убрать эту функцию, логика редактирования должна быть в UserService
  getParameterByUSER_OBJECT_PARAMETERS_FOR_READ_WRITE( uSER_OBJECT_PARAMETERS_FOR_READ_WRITE ){
    // TODO: Переписать через switch или объект-мэппинг
    // TODO: Использовать константы USER_OBJECT_PARAMETERS_FOR_READ_WRITE (если они есть)
    if (uSER_OBJECT_PARAMETERS_FOR_READ_WRITE == /* USER_OBJECT_PARAMETERS_FOR_READ_WRITE.accessStatus */ 'accessStatus')
      return this.getAccessStatusInString()
    if (uSER_OBJECT_PARAMETERS_FOR_READ_WRITE == /* USER_OBJECT_PARAMETERS_FOR_READ_WRITE.department */ 'department')
      return this.getDepartmentInString()
    if (uSER_OBJECT_PARAMETERS_FOR_READ_WRITE == /* USER_OBJECT_PARAMETERS_FOR_READ_WRITE.empoyeePosition */ 'empoyeePosition')
      return this.getEmpoyeePositionInString()
    if (uSER_OBJECT_PARAMETERS_FOR_READ_WRITE == /* USER_OBJECT_PARAMETERS_FOR_READ_WRITE.empoyeeStatus */ 'empoyeeStatus')
      return this.getEmpoyeeStatusInString()
    return "-"
  }
  // --- Получение строковых представлений статусов (TODO: Вынести в utils/formatters.js или в константы) ---
  getAccessStatusInString(){
    return Formatters.getAccessStatusName( this.accessStatus )
  }
  getDepartmentInString(){
    return Formatters.getDepartmentName( this.department )
  }
  getEmpoyeePositionInString(){
    return Formatters.getEmployeePositionName( this.empoyeePosition )
  }
  getEmpoyeeStatusInString(){
    return Formatters.getEmploymentStatusName( this.empoyeeStatus )
  }
} 