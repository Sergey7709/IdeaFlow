import { appActions } from "app/app-reducer";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { taskActions } from "../TodolistsList/tasks-reducer";
import { todolistsActions } from "../TodolistsList/todolists-reducer";
import { handleServerAppError } from "common/utils";
import { authAPI } from "./auth.api";
import { LoginParamsType } from "../TodolistsList/todolists-tasks-Api-types";
import { ResultCode } from "common/enums";

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
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "auth/login",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/logout",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(taskActions.setResetStateTasks());
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authThunks = { login, logout };
