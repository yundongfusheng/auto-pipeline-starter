import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { taskService } from '../services/taskService';

interface TaskStore {
  tasks: Task[];
  load: () => void;
  addTask: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
  }) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  load() {
    set({ tasks: taskService.getAll() });
  },

  addTask(data) {
    const task = taskService.create(data);
    set((s) => ({ tasks: [...s.tasks, task] }));
  },

  moveTask(id, status) {
    const task = taskService.update(id, { status });
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }));
  },

  updateTask(id, updates) {
    const task = taskService.update(id, updates);
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }));
  },

  removeTask(id) {
    taskService.remove(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },
}));
