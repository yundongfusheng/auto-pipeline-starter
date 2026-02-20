import { useEffect, useState } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function Todos() {
  const { todos, load, addTodo, toggleTodo, updateTodo, removeTodo } =
    useTodoStore();
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    addTodo(title);
    setInput('');
  };

  const startEdit = (id: string, title: string) => {
    setEditId(id);
    setEditText(title);
  };

  const saveEdit = (id: string) => {
    const title = editText.trim();
    if (title) updateTodo(id, title);
    setEditId(null);
  };

  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Todos</h1>
        {todos.length > 0 && (
          <span className="text-sm text-gray-400">
            {done}/{todos.length} 完成
          </span>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          data-cy="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新建 todo..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          data-cy="todo-submit"
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          添加
        </button>
      </form>

      {/* List */}
      <ul className="space-y-3" data-cy="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            data-cy="todo-item"
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 accent-indigo-600 shrink-0"
            />

            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                  className="flex-1 border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  autoFocus
                />
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="text-green-600 text-sm font-medium hover:text-green-700"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="text-gray-400 text-sm hover:text-gray-600"
                >
                  取消
                </button>
              </>
            ) : (
              <>
                <span
                  data-cy="todo-title"
                  className={`flex-1 text-sm ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => startEdit(todo.id, todo.title)}
                  className="text-indigo-400 hover:text-indigo-600 text-xs"
                >
                  编辑
                </button>
                <button
                  data-cy="todo-delete"
                  onClick={() => removeTodo(todo.id)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  删除
                </button>
              </>
            )}
          </li>
        ))}

        {todos.length === 0 && (
          <li className="text-gray-400 text-center py-12 text-sm">
            暂无 todo，在上方输入框添加第一条吧 🎉
          </li>
        )}
      </ul>
    </div>
  );
}
