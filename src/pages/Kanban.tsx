import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: '待处理' },
  { status: 'in_progress', label: '进行中' },
  { status: 'done', label: '已完成' },
];

interface ModalSubmitData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export default function Kanban() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { tasks, load, addTask, moveTask, updateTask, removeTask } = useTaskStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确认删除该任务？')) {
      removeTask(id);
    }
  };

  const handleModalSubmit = (data: ModalSubmitData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 shrink-0">⚡ 任务看板</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white text-sm px-3 py-2 sm:px-4 rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors whitespace-nowrap"
          >
            + 新建任务
          </button>
          <span className="text-sm text-gray-500 hidden sm:inline shrink-0">
            {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 px-3 py-2 rounded-lg whitespace-nowrap"
          >
            退出
          </button>
        </div>
      </header>

      {/* Kanban board */}
      <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 overflow-x-hidden">
        {COLUMNS.map(({ status, label }) => (
          <KanbanColumn
            key={status}
            status={status}
            label={label}
            tasks={tasks.filter((t) => t.status === status)}
            onMove={moveTask}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Task modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask ?? undefined}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
