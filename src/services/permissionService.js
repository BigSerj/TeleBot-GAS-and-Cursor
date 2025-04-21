// --- Сервис для управления правами доступа и ролями --- 

// Убраны TODO для импортов, предполагаем глобальную доступность констант и сервисов

// --- Базовые наборы ролей/прав --- 
// (Адаптировано из старых функций getPermissionObjRole...)
// Возвращают массив ролей (из EMPLOYEES_HIERARHY)

function getRoleDeveloper(){
  // Разработчик имеет доступ ко всему, его роль не включаем в стандартные списки
  return []; // Или определить специальную роль DEVELOPER?
}

function getRoleOwner(){
  return [EMPLOYEES_HIERARHY.OWNER];
}

function getRoleHRNetWorkManager(){
  return [EMPLOYEES_HIERARHY.MANAGER_RETAIL_NETWORK]; 
}

function getRolePurchasingManager(){
  return [EMPLOYEES_HIERARHY.BUYER];
}

function getRoleAdminInOffice(){
  return [EMPLOYEES_HIERARHY.ADMIN_IN_OFFICE];
}

function getRoleRepairMaster(){
  return [EMPLOYEES_HIERARHY.REPAIRMAN];
}

function getRoleFilmPastingMaster(){
  return [EMPLOYEES_HIERARHY.PASTERER_MASTER];
}

function getRoleSellers(){
  return [EMPLOYEES_HIERARHY.SELLER, EMPLOYEES_HIERARHY.PASTERER];
}

function getRoleInterns(){
  // Стажеры обычно не имеют специальных ролей, определяется статусом
  return [];
}

// --- Комбинированные наборы ролей --- 
// (Адаптировано из старых функций getOwnersRolesPermissions и т.д.)
// Возвращают массив ролей

function getRolesOwners() { // Владелец
   return [ ...getRoleOwner() ]; // Только владелец
}

function getRolesHighManagersAndHR() { // Владелец, HR
   return [ ...getRoleOwner(), ...getRoleHRNetWorkManager() ];
}

function getRolesHighManagersAndPurchasing() { // Владелец, HR, Закупщик
    return [ ...getRolesHighManagersAndHR(), ...getRolePurchasingManager() ];
}

function getRolesHighManagersAdminInOffice() { // Владелец, HR, Помощник
     return [ ...getRolesHighManagersAndHR(), ...getRoleAdminInOffice() ];
}

function getRolesManagersInProducts() { // Владелец, HR, Закупщик, Помощник
     return [ ...getRolesHighManagersAndPurchasing(), ...getRoleAdminInOffice() ];
}


// --- Функции проверки прав --- 

// Определяет роли, которые могут одобрять регистрацию
function _getRolesWhoCanApprove(){
  // Основано на getPermissionsAboutWhoCanGiveAccessForUpprove -> getHighManagersAndHRNetWorkManagerRolesPermissions
  // Это роли Владельца и HR + неявно Разработчик
  return getRolesHighManagersAndHR(); 
}

// Проверяет, может ли пользователь user одобрять регистрацию
function canApproveRegistration(user) {
  if (!user) return false;
  // Разработчик может всегда
  if (user.isAccessStatusDeveloper()) return true;
  // Проверяем наличие нужной роли
  const userRole = user.getEmpoyeePosition();
  const allowedRoles = _getRolesWhoCanApprove();
  return userRole && allowedRoles.includes(userRole);
}

// Возвращает массив ID пользователей, которые могут одобрять регистрацию
function getRegistrationApproverIds() {
  const allUsers = UserService.getAllUsers();
  const approverIds = [];
  allUsers.forEach(user => {
    if (canApproveRegistration(user)) {
       approverIds.push(user.getTelegrId());
    }
  });
  // Убедимся, что ID разработчика всегда включен (если его нет в списке)
  if (!approverIds.includes(String(DEVELOPER_TELEGRAM_ID))) {
      approverIds.push(String(DEVELOPER_TELEGRAM_ID));
  }
  return [...new Set(approverIds)]; // Убираем дубликаты, если есть
}

// Определяет роли, которым нужно отправлять уведомления о регистрации
function _getRolesToNotifyAboutRegistration() {
  // Основано на getPermissionsAboutWhomSendMessageAboutNewUserRegistered -> getManagersInProductsRolesPermissions
  // Владелец, HR, Закупщик, Помощник + неявно Разработчик
  return getRolesManagersInProducts();
}

// Проверяет, нужно ли уведомлять пользователя user о регистрации
function shouldNotifyAboutRegistration(user) {
   if (!user) return false;
   // Разработчика уведомляем всегда
   if (user.isAccessStatusDeveloper()) return true;
   // Проверяем наличие нужной роли
   const userRole = user.getEmpoyeePosition();
   const allowedRoles = _getRolesToNotifyAboutRegistration();
   return userRole && allowedRoles.includes(userRole);
}

// Возвращает массив ID пользователей для уведомления о регистрации
function getUserIdsToNotifyAboutRegistration() {
   const allUsers = UserService.getAllUsers();
   const notifyIds = [];
   allUsers.forEach(user => {
     if (shouldNotifyAboutRegistration(user)) {
        notifyIds.push(user.getTelegrId());
     }
   });
    // Убедимся, что ID разработчика всегда включен
   if (!notifyIds.includes(String(DEVELOPER_TELEGRAM_ID))) {
      notifyIds.push(String(DEVELOPER_TELEGRAM_ID));
  }
   return [...new Set(notifyIds)]; 
}

// Проверяет, является ли пользователь администратором (имеет расширенные права)
function isAdmin(user) {
   if (!user) return false;
   // Разработчик - админ
   if (user.isAccessStatusDeveloper()) return true;
   // Владелец - админ
   if (user.getEmpoyeePosition() === EMPLOYEES_HIERARHY.OWNER) return true;
   // TODO: Добавить другие роли, если нужно (например, HR?)
   return false;
}

// --- Логика для Бургер-меню ---

// Использует константы MENU_COMMANDS из constants/commands.js
function getAvailableMenuCommands(user) {
  if (!user) return [];

  // Использует MENU_COMMANDS.MAIN, MENU_COMMANDS.SETTINGS
  const baseCommands = [MENU_COMMANDS.MAIN, MENU_COMMANDS.SETTINGS]; 

  // Использует USER_ACCESS.BLOCKED, EMPLOYMENT_STATUS.FIRED из constants/statuses.js
  if (user.getAccessStatus() === USER_ACCESS.BLOCKED || user.getEmpoyeeStatus() === EMPLOYMENT_STATUS.FIRED) {
    return [];
  }

  let availableCommands = [...baseCommands];

  if (user.getAccessStatus() === USER_ACCESS.DEVELOPER) {
      // TODO: Определить полный список команд для разработчика как константу?
      // Использует MENU_COMMANDS.* 
      return [
          MENU_COMMANDS.MAIN, MENU_COMMANDS.PENALTIES, MENU_COMMANDS.SETTINGS, 
          MENU_COMMANDS.SETTINGS_ADMIN, MENU_COMMANDS.SETTINGS_ADMIN2, 
          MENU_COMMANDS.SETTINGS_OWNER, MENU_COMMANDS.SETTINGS_OWNER2, MENU_COMMANDS.START
        ];
  }

  if (user.getEmpoyeeStatus() === EMPLOYMENT_STATUS.INTERN && user.getRegistrationStage() === REGISTRATION_STAGE.REGISTERED) {
      // TODO: Определить команды для стажера как константу?
      // Использует MENU_COMMANDS.MAIN, MENU_COMMANDS.SETTINGS, MENU_COMMANDS.START
      return [MENU_COMMANDS.MAIN, MENU_COMMANDS.SETTINGS, MENU_COMMANDS.START]; 
  }

  const userRole = user.getEmpoyeePosition();
  
  if (userRole === EMPLOYEES_HIERARHY.OWNER) {
      // TODO: Определить полный список команд для Owner как константу?
      // Использует MENU_COMMANDS.* 
      return [
          MENU_COMMANDS.MAIN, MENU_COMMANDS.PENALTIES, MENU_COMMANDS.SETTINGS, 
          MENU_COMMANDS.SETTINGS_ADMIN, MENU_COMMANDS.SETTINGS_ADMIN2, 
          MENU_COMMANDS.SETTINGS_OWNER, MENU_COMMANDS.SETTINGS_OWNER2, MENU_COMMANDS.START
        ];
  }
  
  if (userRole === EMPLOYEES_HIERARHY.MANAGER_RETAIL_NETWORK) {
      // Использует MENU_COMMANDS.PENALTIES, SETTINGS_ADMIN, SETTINGS_ADMIN2
      availableCommands.push(MENU_COMMANDS.PENALTIES, MENU_COMMANDS.SETTINGS_ADMIN, MENU_COMMANDS.SETTINGS_ADMIN2);
      // TODO: Уточнить точный набор команд (константа?)
  }
  
  if (getRoleSellers().includes(userRole)) {
     // Использует MENU_COMMANDS.PENALTIES
     availableCommands.push(MENU_COMMANDS.PENALTIES);
     // TODO: Уточнить точный набор команд (константа?)
  }
  
  // TODO: Добавить проверки для Buyer, AdminInOffice, PastererMaster, Repairman...

  // Использует MENU_COMMANDS.START
  if (!availableCommands.includes(MENU_COMMANDS.START)) {
      availableCommands.push(MENU_COMMANDS.START);
  }

  return [...new Set(availableCommands)]; 
}

// TODO: Перенести функцию compareAccessPermissionsForGetStatus сюда или удалить, если не нужна 