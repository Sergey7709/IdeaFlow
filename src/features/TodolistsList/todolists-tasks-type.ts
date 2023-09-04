import { TaskStatuses, TaskPriorities } from "../../common/enums";
import { UpdateDomainTaskModelType } from "./tasks-reducer";

export type AddTasksArg = { todolistId: string; title: string };

export type UpdateTasksArg = { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string };

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

export type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
