// БургерМеню BurgerMenu:
function getPermissionsForBurgerMenuOwner(){
  return getOwnersRolesPermissions()
}
function getPermissionsForBurgerMenuHRNetWorkManager(){
  return getHighManagersAndHRNetWorkManagerRolesPermissions()
}
function getPermissionsForBurgerMenuSellers(){
  return getPermissionObjRoleSellers()  // Продавцы/оклейщики
}
function getPermissionsForBurgerMenuInterns(){
  return getPermissionObjRoleInterns()  // Новенькие, кому дали доступ, но еще не внесли его настройки
}