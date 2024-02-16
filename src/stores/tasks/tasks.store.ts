import { StateCreator, create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Middlewares = [["zustand/devtools", never], ["zustand/persist", unknown], ["zustand/immer", never]];

interface TaskState {
  draggingTaskId?: string; 
  tasks: Record<string, Task>,
  getTasksByStatus: (status: TaskStatus) => Task[];
  addTask: (title: string, status: TaskStatus) => void;
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
  totalTasks: () => number;
}

const storeAPI: StateCreator<TaskState, Middlewares> = (set, get) => ({
  tasks: {
    'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
    'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
    'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
    'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' },
  },
  getTasksByStatus: (status: TaskStatus): Task[] => {
    return Object.values(get().tasks).filter((task: Task) => task.status === status);
  },
  draggingTaskId: undefined,
  setDraggingTaskId: (taskId: string): void => {
    set({ draggingTaskId: taskId });     
  },
  removeDraggingTaskId: () => {
    set({ draggingTaskId: undefined })
  },
  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    // const task = get().tasks[taskId];
    // task.status = status;
    set((state) => {
      state.tasks[taskId] = {
        ...state.tasks[taskId],
        status
      }
    })
    // set((state) => ({
    //   ...state.tasks,
    //   [taskId]: task,
    // }))
  },
  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;
    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },
  addTask: (title: string, status: TaskStatus) => {
    const newTask = { id: uuidv4(), title, status };
    set((state) => {
      state.tasks[newTask.id] = newTask
    })
    //? Requiere npm install immer
    // set(produce((state: TaskState) => {
    //   state.tasks[newTask.id] = newTask
    // }))

    //? Forma nativa de Zustand
    // set((state) => ({ tasks: {
    //   ...state.tasks,
    //   [newTask.id]: newTask,
    // }}))
  },
  totalTasks: () => {
    const tasks = Object.values(get().tasks);
    return tasks.length;
  }
});

export const useTaskStore = create<TaskState>()((
  devtools(
    persist(
      immer(storeAPI),
      { name: 'task-store' }
    )
  )
))