import { TodolistDomainType, todoListThunk, todolistsReducer } from "./todolists-reducer";
import { taskReducer, TasksStateType } from "./tasks-reducer";
import { TodolistType } from "./todolists-tasks-Api-types";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: TodolistDomainType[] = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todoListThunk.addTodolist.fulfilled({ todolist }, "requestId", { title: todolist.title });

  const endTasksState = taskReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
