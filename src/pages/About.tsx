import { Link } from 'react-router-dom';

const stack = [
  { name: 'Vite 5', desc: '极速构建工具' },
  { name: 'React 18', desc: 'UI 框架，Concurrent Mode' },
  { name: 'TypeScript', desc: '类型安全' },
  { name: 'React Router v6', desc: '客户端路由' },
  { name: 'Zustand', desc: '轻量状态管理' },
  { name: 'TanStack Query v5', desc: '服务端状态 & 缓存' },
  { name: 'Tailwind CSS', desc: 'Utility-first 样式' },
  { name: 'Cypress', desc: 'E2E 测试' },
  { name: 'Docker + Nginx', desc: '容器化部署' },
  { name: 'GitHub Actions', desc: 'CI/CD 自动流水线' },
];

export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">About</h1>
      <p className="text-gray-500 mb-8">
        这是一个可直接部署到 EC2 的前端工程样板，推送 main 分支后自动完成：
        构建 → E2E 测试 → Docker 打包 → SCP 传输 → SSH 部署。
      </p>
      <ul className="space-y-3">
        {stack.map(({ name, desc }) => (
          <li
            key={name}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm"
          >
            <span className="font-semibold text-indigo-600 w-40 shrink-0">
              {name}
            </span>
            <span className="text-gray-600 text-sm">{desc}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center">
        <Link
          to="/"
          aria-label="返回首页"
          className="inline-block bg-[#28a745] hover:bg-[#218838] focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:ring-offset-2 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
