# PRD — AutoPipeline Starter

> 版本：v0.1.0 | 状态：Draft | 日期：2026-02-20

---

## 1. 背景与目标

### 1.1 背景

团队在新项目启动时，反复从零搭建前端工程脚手架和 CI/CD 流水线，耗时且易出错。

### 1.2 目标

提供一个**开箱即用**的前端样板工程（Starter），涵盖：

- 现代技术栈（Vite + React + TypeScript）
- 业务常见功能模型（CRUD）
- 自动化测试（Cypress E2E）
- 容器化部署（Docker + Nginx）
- 零配置 CI/CD（GitHub Actions → EC2）

团队 fork 后，只需填写 3 个 GitHub Secrets，即可获得完整的生产级流水线。

---

## 2. 用户故事

| ID   | 角色        | 故事                                                                     | 优先级 |
|------|-------------|--------------------------------------------------------------------------|--------|
| US-1 | 前端开发者  | 我想一键启动本地开发环境，看到带导航的 SPA 应用                          | P0     |
| US-2 | 前端开发者  | 我想在 /todos 页面增删改查 todo，并刷新后数据不丢失                      | P0     |
| US-3 | 前端开发者  | 我想运行 E2E 测试，确认核心交互正确                                      | P0     |
| US-4 | DevOps 工程师 | 我想推送 main 分支后自动构建、测试、打包镜像并部署到 EC2                | P0     |
| US-5 | 新人        | 我想通过 README 快速了解如何本地运行、构建、配置 CI/CD                   | P1     |

---

## 3. 功能需求

### 3.1 页面路由

| 路径     | 组件    | 说明                       |
|----------|---------|----------------------------|
| `/`      | Home    | 项目介绍 + 跳转 Todos 按钮 |
| `/todos` | Todos   | Todo CRUD 完整功能         |
| `/about` | About   | 技术栈说明                 |
| `*`      | —       | 404 fallback（Nginx）      |

### 3.2 Todos 功能

- **新增**：输入框 + 提交按钮，空输入不触发
- **查看**：列表展示所有 todo，显示完成进度
- **完成**：复选框切换 `completed` 状态，已完成显示删除线
- **编辑**：点击「编辑」内联编辑，Enter/保存 提交
- **删除**：点击「删除」立即移除
- **持久化**：数据存储于 `localStorage`，刷新后保留

### 3.3 导航

- 顶部固定 Navbar
- 当前路由对应的链接高亮（underline + font-semibold）

### 3.4 Service 层设计（可替换）

```
src/services/todoService.ts   ← 当前：localStorage
                              ← 未来：替换为 fetch/axios 调用后端 API
src/store/todoStore.ts        ← Zustand store，调用 service，不直接接触存储
```

---

## 4. 非功能需求

| 类别     | 要求                                                           |
|----------|----------------------------------------------------------------|
| 性能     | Lighthouse Performance ≥ 90（生产构建）                        |
| 构建速度 | `npm run build` 冷启动 < 30s                                   |
| 镜像大小 | Docker 镜像 < 50MB（多阶段构建 + nginx:alpine）                |
| 可维护性 | TypeScript strict 模式，无 any，ESLint 零警告                  |
| 安全     | Nginx 添加 X-Frame-Options / X-Content-Type-Options 响应头     |

---

## 5. CI/CD 流程

```
git push main
     │
     ▼
[GitHub Actions]
     │
     ├─ npm ci
     ├─ npm run build      (tsc + vite)
     ├─ npm run e2e        (preview + cypress run)
     │
     ├─ docker build -t auto-pipeline-starter:<sha> .
     ├─ docker save | gzip > image.tar.gz
     ├─ scp image.tar.gz → EC2:~/deploy/
     │
     └─ ssh EC2
           ├─ docker load < image.tar.gz
           ├─ docker stop/rm old container
           ├─ docker run -d -p 80:80 auto-pipeline-starter:<sha>
           └─ docker image prune -f
```

---

## 6. 验收标准（Given / When / Then）

### AC-1：本地开发

**Given** 已安装 Node 20
**When** 执行 `npm install && npm run dev`
**Then** 浏览器打开 `http://localhost:5173`，可看到首页，导航可切换三个页面

---

### AC-2：Todo 新增与持久化

**Given** 访问 `/todos`，localStorage 为空
**When** 在输入框输入「Buy oat milk」并点击「添加」
**Then** 列表出现该条目

**When** 刷新页面
**Then** 该条目仍然存在（localStorage 持久化）

---

### AC-3：Todo 删除

**Given** `/todos` 页面有 1 条 todo
**When** 点击「删除」
**Then** 列表为空，显示空状态提示

---

### AC-4：导航高亮

**Given** 用户访问 `/about`
**When** 观察顶部导航
**Then** About 链接带有 underline 样式，其他链接正常

---

### AC-5：E2E 测试通过

**Given** 执行 `npm run e2e`（preview 模式）
**When** Cypress 运行所有 spec
**Then** 全部测试绿色通过，无失败

---

### AC-6：Docker 构建

**Given** 已安装 Docker
**When** 执行 `docker build -t aps . && docker run -p 8080:80 aps`
**Then** 访问 `http://localhost:8080` 可正常使用应用，SPA 路由不 404

---

### AC-7：CI/CD 自动部署

**Given** 配置了 `EC2_HOST / EC2_USER / EC2_SSH_KEY` 三个 Secret
**When** 推送代码到 main 分支
**Then** GitHub Actions 绿色通过，EC2 上新容器运行，旧容器被替换

---

## 7. 风险与依赖

| 风险                        | 概率 | 影响 | 缓解措施                        |
|-----------------------------|------|------|---------------------------------|
| EC2 安全组未开放 80 端口    | 中   | 高   | 文档明确说明，README 提示       |
| Cypress 在 CI 环境依赖不全  | 低   | 中   | ubuntu-latest 已含 Xvfb；headless 运行 |
| localStorage 5MB 上限       | 低   | 低   | 样板阶段够用；生产替换为 API    |
