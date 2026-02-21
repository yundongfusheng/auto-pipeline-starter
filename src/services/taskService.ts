import { Task, TaskStatus, TaskPriority } from '../types/task';

const STORAGE_KEY = 'aps:tasks';

function load(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Task[];
  } catch {
    return [];
  }
}

function persist(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const taskService = {
  getAll: load,

  create(data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
  }): Task {
    const tasks = load();
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status ?? 'todo',
      createdAt: Date.now(),
    };
    persist([...tasks, task]);
    return task;
  },

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
    const tasks = load();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = { ...tasks[idx], ...updates };
    persist(tasks);
    return tasks[idx];
  },

  remove(id: string): void {
    persist(load().filter((t) => t.id !== id));
  },
};
