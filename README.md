# AutoPipeline Starter

> Vite · React · TypeScript · React Router · Zustand · TanStack Query · Tailwind CSS · Cypress · Docker · GitHub Actions

一个**可直接部署到 EC2** 的前端工程样板。推送 `main` 分支后自动完成：

```
npm ci → build → Cypress E2E → Docker build → SCP → SSH 部署容器
```

---

## 技术栈

| 层次       | 选型                         |
|------------|------------------------------|
| 构建       | Vite 5 + TypeScript 5        |
| UI         | React 18 + Tailwind CSS 3    |
| 路由       | React Router v6              |
| 状态管理   | Zustand 4                    |
| 服务端状态 | TanStack Query v5            |
| E2E 测试   | Cypress 13                   |
| 容器化     | Docker 多阶段 + Nginx Alpine  |
| CI/CD      | GitHub Actions               |

---

## 快速开始

### 前置要求

- Node.js ≥ 20
- npm ≥ 10
- Docker（可选，本地构建镜像用）

### 本地开发

```bash
git clone <your-repo-url>
cd auto-pipeline-starter

npm install
npm run dev
# 访问 http://localhost:5173
```

### 生产构建

```bash
npm run build
npm run preview
# 访问 http://localhost:4173
```

---

## 运行测试

### E2E 测试（Cypress headless）

```bash
# 自动启动 preview 服务器 → 运行 cypress → 关闭服务器
npm run e2e
```

### 交互式 Cypress（本地调试）

```bash
npm run preview &          # 先启动 preview
npx cypress open           # 打开 Cypress GUI
```

---

## Docker

### 构建镜像

```bash
docker build -t auto-pipeline-starter .
```

### 本地运行容器

```bash
docker run -d -p 8080:80 --name aps auto-pipeline-starter
# 访问 http://localhost:8080
```

### 停止 & 清理

```bash
docker stop aps && docker rm aps
```

---

## GitHub Actions CI/CD 配置

### 需要配置的 Secrets

在 GitHub 仓库 → **Settings → Secrets and variables → Actions** 中添加：

| Secret 名称    | 说明                                               | 示例值                        |
|----------------|----------------------------------------------------|-------------------------------|
| `EC2_HOST`     | EC2 实例公网 IP 或域名                             | `54.123.45.67`                |
| `EC2_USER`     | SSH 登录用户名                                     | `ubuntu` 或 `ec2-user`        |
| `EC2_SSH_KEY`  | EC2 私钥完整内容（PEM 格式，包含 `-----BEGIN...`） | *(粘贴 .pem 文件全文)*        |

### EC2 前置准备

```bash
# 在 EC2 上安装 Docker
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu   # 让 ubuntu 用户可运行 docker

# 创建部署目录
mkdir -p ~/deploy

# 安全组：开放 80 (HTTP) 和 22 (SSH) 端口
```

### 流水线触发

```bash
git push origin main
# 自动触发 .github/workflows/deploy.yml
```

流水线阶段：

1. **CI**：`npm ci` → `npm run build` → `npm run e2e`
2. **Deploy**：`docker build` → `docker save` → `scp` → `ssh` 替换容器

---

## 项目结构

```
auto-pipeline-starter/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD 流水线
├── cypress/
│   ├── e2e/
│   │   ├── navigation.cy.ts    # 导航 E2E 测试
│   │   └── todos.cy.ts         # Todo CRUD E2E 测试
│   └── support/
│       ├── commands.ts
│       └── e2e.ts
├── docs/
│   └── PRD.md                  # 产品需求文档
├── src/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Todos.tsx
│   │   └── About.tsx
│   ├── services/
│   │   └── todoService.ts      # 数据层（可替换为 API）
│   ├── store/
│   │   └── todoStore.ts        # Zustand store
│   ├── types/
│   │   └── todo.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Dockerfile                  # 多阶段构建
├── nginx.conf                  # SPA fallback 配置
├── cypress.config.ts
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 替换为真实 API

`src/services/todoService.ts` 是数据访问层，当前实现为 `localStorage`。
替换为后端 API 只需修改该文件中的函数实现，`store` 和页面层**无需改动**：

```typescript
// 示例：替换 getAll 为 fetch
async getAll(): Promise<Todo[]> {
  const res = await fetch('/api/todos');
  return res.json();
},
```

---

## 常见问题

**Q: `npm run e2e` 失败，提示找不到浏览器？**

```bash
# 安装 Cypress 系统依赖（Linux）
npx cypress install
```

**Q: Docker 构建时 npm ci 很慢？**

已利用 Docker 层缓存：先 `COPY package*.json` 再 `npm ci`，只要 lockfile 不变就走缓存。

**Q: EC2 访问 80 端口超时？**

检查 AWS 安全组是否放行 `0.0.0.0/0 → TCP 80`。

---

## License

MIT
