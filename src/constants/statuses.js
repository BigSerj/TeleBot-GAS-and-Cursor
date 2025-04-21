// --- Константы для статусов пользователей и этапов регистрации ---

// Статусы доступа пользователя (Access Status)
const USER_ACCESS = {
  DEVELOPER: "developer", // разработчик - полный доступ ко всему на высшем урвоне
  USER: "user", // обычный уровень доступа
  UNKNOWN: "unknown", // неизвестный, проходит первый этап регистрации, чтобы запросить доступ на дальнейшую регистрацию
  BLOCKED: "blocked", // заблокирован
};
Object.freeze(USER_ACCESS);

// Статусы сотрудника (Employment Status)
const EMPLOYMENT_STATUS = {
  INTERN: "intern", // стажер
  ON_PROBATION: "on_probation", // на испытательном сроке
  EMPLOYED: "employed", // нанятый, работает, в работе
  ON_LEAVE: "on_leave", // в отпуске
  SUSPENDED: "suspended", // временно уволенный
  FIRED: "fired", // уволенный
};
Object.freeze(EMPLOYMENT_STATUS);

// Этапы регистрации (Registration Stage)
const REGISTRATION_STAGE = {
  WAITING_INPUT_NAME_MY: "waiting_input_name_my",
  WAITING_INPUT_TEL: "waiting_input_tel",
  WAITING_INPUT_GMAIL: "waiting_input_gmail",
  WAITING_VERIFICATION_BY_MANAGER: "waiting_verification_by_manager", // первый этап регистрации пройден, ждем проверки владельцем
  REGISTERED: "registered",
};
Object.freeze(REGISTRATION_STAGE);

// TODO: Рассмотреть возможность использования Object.freeze() для констант, чтобы предотвратить случайное изменение
// Object.freeze(USER_ACCESS);
// Object.freeze(EMPLOYMENT_STATUS);
// Object.freeze(REGISTRATION_STAGE); 