import { appActions } from "app/app-reducer";
import { todolistsAPI } from "features/TodolistsList/todolists-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todoListThunk } from "./todolists-reducer";
import { createAppAsyncThunk, handleServerNetworkError, handleServerAppError } from "common/utils";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";
import {
  TaskType,
  AddTasksArg,
  UpdateTasksArg,
  UpdateTaskModelType,
  RemoveTaskArg,
} from "./todolists-tasks-Api-types";

const initialState: TasksStateType = {};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setResetStateTasks: () => ({}),
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        removeTask.fulfilled,
        (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
          const tasksForTodolist = state[action.payload.todolistId];
          const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
          if (index !== -1) tasksForTodolist.splice(index, 1);
        },
      )
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId];
        const index = tasksForTodolist.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasksForTodolist[index] = {
            ...tasksForTodolist[index],
            ...action.payload.domainModel,
          };
        }
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<{ task: TaskType }>) => {
        const tasksForCurrentTodolist = state[action.payload.task.todoListId];
        tasksForCurrentTodolist.unshift(action.payload.task);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(todoListThunk.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todoListThunk.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todoListThunk.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
});

const fetchTasks = createAppAsyncThunk<{ tasks: Array<TaskType>; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTasksArg>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
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

const updateTask = createAppAsyncThunk<UpdateTasksArg, UpdateTasksArg>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI;
    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        dispatch(appActions.setAppError({ error: "Task not found" }));
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };

      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId };
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

const removeTask = createAppAsyncThunk<RemoveTaskArg, RemoveTaskArg>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { taskId: arg.taskId, todolistId: arg.todolistId };
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

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const taskActions = taskSlice.actions;
export const taskReducer = taskSlice.reducer;
export const tasksThunk = { fetchTasks, addTask, updateTask, removeTask };
