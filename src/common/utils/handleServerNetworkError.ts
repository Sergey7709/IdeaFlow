import { appActions } from "../../app/app-reducer";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import {BaseResponseType} from "../types";


export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occurred";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message ||  errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = (err as BaseResponseType)?.messages[0]  || JSON.stringify(err);
    }
  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
