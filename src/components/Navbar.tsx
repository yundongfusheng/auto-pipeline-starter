import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/', label: 'Home' },
  { to: '/todos', label: 'Todos' },
  { to: '/about', label: 'About' },
  { to: '/kanban', label: 'Kanban' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center gap-6 shadow-md flex-wrap">
      <span className="font-bold text-xl tracking-tight mr-2">⚡ AutoPipeline</span>
      <div className="flex items-center gap-6 flex-wrap flex-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              isActive
                ? 'underline underline-offset-4 font-semibold'
                : 'hover:text-indigo-200 transition-colors'
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-indigo-200">{user.username}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      )}
    </nav>
  );
}
