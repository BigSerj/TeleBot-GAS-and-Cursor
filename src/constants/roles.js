// --- Константы для ролей (должностей) и отделов ---

// Иерархия должностей
const EMPLOYEES_HIERARHY = {
  OWNER: "owner", // Владелец
  MANAGER_RETAIL_NETWORK: "manager_retail_network", // Управляющий розничной сети
  BUYER: "buyer", // Закупщик
  ADMIN_IN_OFFICE: "admin_in_office", // Администратор офиса
  SELLER: "seller", // Продавец
  PASTERER_MASTER: "pasterer_master", // Мастер оклейки
  PASTERER: "pasterer", // Оклейщик
  REPAIRMAN: "repairman" // Мастер по ремонту
};
Object.freeze(EMPLOYEES_HIERARHY);

// Отделы
const DEPARTMENT = {
  CROSS_DEPART: "cross_depart", // Администрация / Руководство
  RETAIL_SALES: "retail_sales", // Розничные продажи
  ONLINE_SALES: "online_sales", // Онлайн продажи
  PASTING: "pasting", // Оклейка
  REPAIR: "repair" // Ремонт
};
Object.freeze(DEPARTMENT); 