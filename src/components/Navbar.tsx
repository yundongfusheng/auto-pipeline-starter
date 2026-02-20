import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/todos', label: 'Todos' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center gap-6 shadow-md">
      <span className="font-bold text-xl tracking-tight mr-2">⚡ AutoPipeline</span>
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
    </nav>
  );
}
