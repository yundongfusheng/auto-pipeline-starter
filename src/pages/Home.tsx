import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4">
      <h1 className="text-5xl font-bold text-indigo-700 text-center">
        AutoPipeline Starter
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-md">
        A production-ready template: Vite · React · TypeScript · Tailwind ·
        Zustand · TanStack Query · Cypress · Docker · GitHub Actions.🚀 Full Auto Success
      </p>
      <div className="flex gap-4">
        <button
          data-cy="go-to-todos"
          onClick={() => navigate('/todos')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow"
        >
          View Todos →
        </button>
        <button
          onClick={() => navigate('/about')}
          className="px-6 py-3 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
        >
          About
        </button>
      </div>
    </div>
  );
}
