import { appActions } from "app/app-reducer";
import { handleServerNetworkError } from "common/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { taskActions } from "../TodolistsList/tasks-reducer";
import { todolistsActions } from "../TodolistsList/todolists-reducer";
import { handleServerAppError } from "common/utils";
import { authAPI } from "./auth.api";
import { LoginParamsType } from "../TodolistsList/todolists-tasks-Api-types";

export type InitialStateType = {
  isLoggedIn: boolean;
};

const initialState: InitialStateType = {
  isLoggedIn: false,
};

export type authSlicePayloadType = {
  isLoggedIn: boolean;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<authSlicePayloadType>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(taskActions.setResetStateTasks());
        dispatch(todolistsActions.setResetStateTodolists());
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
