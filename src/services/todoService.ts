/**
 * Todo Service — localStorage mock implementation.
 *
 * To swap to a real API, replace the functions below with fetch/axios calls
 * while keeping the same function signatures. The store layer remains untouched.
 */
import type { Todo } from '../types/todo';

const STORAGE_KEY = 'aps:todos';

function readStorage(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Todo[];
  } catch {
    return [];
  }
}

function writeStorage(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const todoService = {
  /** Fetch all todos */
  getAll(): Todo[] {
    return readStorage();
  },

  /** Create a new todo and persist it */
  create(title: string): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    writeStorage([...readStorage(), todo]);
    return todo;
  },

  /** Toggle completed status */
  toggle(id: string): Todo[] {
    const todos = readStorage().map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    writeStorage(todos);
    return todos;
  },

  /** Update title */
  update(id: string, title: string): Todo[] {
    const todos = readStorage().map((t) =>
      t.id === id ? { ...t, title } : t,
    );
    writeStorage(todos);
    return todos;
  },

  /** Delete a todo */
  remove(id: string): Todo[] {
    const todos = readStorage().filter((t) => t.id !== id);
    writeStorage(todos);
    return todos;
  },
};
