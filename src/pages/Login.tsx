import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      login(username, password);
      navigate('/kanban', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <span className="text-3xl">⚡</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">任务看板</h1>
          <p className="text-gray-500 text-sm mt-1">请登录以继续</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="请输入用户名"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="请输入密码"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors mt-2"
          >
            登录
          </button>
        </form>

        <p className="mt-5 text-xs text-gray-400 text-center">
          演示账号：<span className="font-mono">admin</span> /{' '}
          <span className="font-mono">admin123</span>
        </p>
      </div>
    </div>
  );
}
