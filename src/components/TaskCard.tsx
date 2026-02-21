import { Task, TaskStatus } from '../types/task';

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS: Record<string, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done'];

const NEXT_LABEL: Record<TaskStatus, string> = {
  todo: '→ 进行中',
  in_progress: '→ 已完成',
  done: '',
};

const PREV_LABEL: Record<TaskStatus, string> = {
  todo: '',
  in_progress: '← 待处理',
  done: '← 进行中',
};

interface Props {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onMove, onEdit, onDelete }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(task.status);
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null;
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-gray-800 text-sm leading-snug flex-1 break-words">
          {task.title}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 break-words line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-1 pt-1 flex-wrap">
        {prevStatus && (
          <button
            onClick={() => onMove(task.id, prevStatus)}
            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded px-2 py-1.5 transition-colors min-h-[32px]"
          >
            {PREV_LABEL[task.status]}
          </button>
        )}
        {nextStatus && (
          <button
            onClick={() => onMove(task.id, nextStatus)}
            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded px-2 py-1.5 transition-colors min-h-[32px]"
          >
            {NEXT_LABEL[task.status]}
          </button>
        )}
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-gray-400 hover:text-indigo-600 px-2 py-1.5 transition-colors min-h-[32px]"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 transition-colors min-h-[32px]"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
