// Обработчик для callback-ов типа 'userData'
// TODO: import { CALLBACK_USER_DATA_ACTIONS } from '../constants/callbacks';
// TODO: import * as UserService from '../services/userService';

function handleCallbackUserData(userId,chatId,callbackData,messageId,messageText,buttonObj) {

  const action = buttonObj.subChapter1Numb; // TODO: Использовать имя поля
  const targetUserId = buttonObj.curr_user_telegramId; // TODO: Использовать имя поля
  const adminUserId = userId;

  // TODO: Определить константы
  const CALLBACK_USER_DATA_ACTIONS = { 
    SHOW: 1,
    EDIT_START: 2,
    EDIT_SAVE: 3,
    EDIT_CANCEL: 4
  };

  if (action == CALLBACK_USER_DATA_ACTIONS.SHOW){ 
    // TODO: Перенести вызов в UserService.showUserData(targetUserId, adminUserId)
    showUserDataParameters( targetUserId );
    return
  }
  if (action == CALLBACK_USER_DATA_ACTIONS.EDIT_START){ 
    // TODO: Перенести вызов в UserService.startUserDataEdit(targetUserId, messageText, adminUserId)
    redactionUserDataParameters( targetUserId, messageText );
    return
  }
  if (action == CALLBACK_USER_DATA_ACTIONS.EDIT_SAVE){ 
    // TODO: Перенести вызов в UserService.saveUserDataEdit(buttonObj, adminUserId)
    saveUserDataParameters( buttonObj );
    return
  }
  if (action == CALLBACK_USER_DATA_ACTIONS.EDIT_CANCEL){ 
    // TODO: Перенести вызов в UserService.cancelUserDataEdit(buttonObj, adminUserId)
    cancelUserDataParameters( buttonObj );
    return
  }

  // Логируем необработанные действия
  Logger.log("Unknown userData action number: " + action);

} 