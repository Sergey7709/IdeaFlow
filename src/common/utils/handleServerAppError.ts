import { appActions } from "app/app-reducer";
import { BaseResponseType } from "../types/common.types";
import { Dispatch } from "redux";

/**
 * Обрабатывает ошибки сервера и соответствующим образом обновляет состояние приложения.
 *
 * @template D - Тип данных в ответе сервера.
 * @param {BaseResponseType<D>} data - Данные ответа сервера.
 * @param {Dispatch} dispatch - Функция диспетчеризации Redux.
 * @param {boolean} [showError=true] - Показывать ли сообщение об ошибке.
 * @returns {void}  Ничего не возвращает
 */

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showError: boolean = true,
): void => {
  if (showError) {
    if (data.messages.length) {
      dispatch(appActions.setAppError({ error: data.messages[0] }));
    } else {
      dispatch(appActions.setAppError({ error: "Some error occurred" }));
    }
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
