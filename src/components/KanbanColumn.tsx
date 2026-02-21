import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

const COLUMN_BG: Record<TaskStatus, string> = {
  todo: 'bg-gray-50 border-gray-200',
  in_progress: 'bg-blue-50 border-blue-200',
  done: 'bg-green-50 border-green-200',
};

const HEADER_COLOR: Record<TaskStatus, string> = {
  todo: 'text-gray-600',
  in_progress: 'text-blue-600',
  done: 'text-green-600',
};

interface Props {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onMove: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({ status, label, tasks, onMove, onEdit, onDelete }: Props) {
  return (
    <div className={`flex-1 min-w-0 rounded-xl border p-4 ${COLUMN_BG[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-semibold text-sm ${HEADER_COLOR[status]}`}>{label}</h2>
        <span className="text-xs bg-white text-gray-500 rounded-full px-2 py-0.5 border border-gray-200 font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 min-h-16">
        {tasks.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">暂无任务</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
