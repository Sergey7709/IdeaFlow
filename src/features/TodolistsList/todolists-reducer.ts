import { todolistsAPI } from "features/TodolistsList/todolists-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeTodolistTitleArg, TodolistType } from "./todolists-tasks-Api-types";
import { createAppAsyncThunk } from "common/utils";
import { ResultCode } from "common/enums";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id);
      if (todolist) {
        todolist.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>,
    ) => {
      const todolist = state.find((todo) => todo.id === action.payload.id);
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus;
      }
    },

    setResetStateTodolists: () => [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" });
        });
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle",
        });
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todo) => todo.id === action.payload.id);
        if (todolist) {
          todolist.title = action.payload.title;
        }
      });
  },
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todo/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export const removeTodolist = createAppAsyncThunk<{ id: string }, { id: string }>(
  "todo/removeTodolist",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(
        todolistsActions.changeTodolistEntityStatus({
          id: arg.id,
          entityStatus: "loading",
        }),
      );
      const res = await todolistsAPI.deleteTodolist(arg.id);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { id: arg.id };
      } else {
        handleServerNetworkError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
  "todo/addTodolist",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(arg.title);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
      } else {
        handleServerNetworkError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const changeTodolistTitle = createAppAsyncThunk<ChangeTodolistTitleArg, ChangeTodolistTitleArg>(
  "todo/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { id: arg.id, title: arg.title };
      } else {
        handleServerNetworkError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsActions = slice.actions;
export const todolistsReducer = slice.reducer;
export const todoListThunk = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };
