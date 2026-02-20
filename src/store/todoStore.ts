import { create } from 'zustand';
import type { Todo } from '../types/todo';
import { todoService } from '../services/todoService';

interface TodoState {
  todos: Todo[];
  load: () => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, title: string) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],

  load: () => set({ todos: todoService.getAll() }),

  addTodo: (title) => {
    todoService.create(title);
    set({ todos: todoService.getAll() });
  },

  toggleTodo: (id) => set({ todos: todoService.toggle(id) }),

  updateTodo: (id, title) => set({ todos: todoService.update(id, title) }),

  removeTodo: (id) => set({ todos: todoService.remove(id) }),
}));
