import { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/task';

interface SubmitData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

interface Props {
  task?: Task;
  onSubmit: (data: SubmitData) => void;
  onClose: () => void;
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: '待处理' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
];

export default function TaskModal({ task, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), priority, status });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 my-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {task ? '编辑任务' : '新建任务'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="任务标题"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="任务描述（可选）"
              rows={3}
            />
          </div>

          <div className={`grid gap-3 ${task ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {task && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {task ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
