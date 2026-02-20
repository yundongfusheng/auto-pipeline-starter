#!/usr/bin/env bash
# scripts/auto.sh
# 读取 PRD → 调用 Claude Code 修改代码 → 验证 → 提交推送
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 支持可选参数：./auto.sh [prd路径]（默认 docs/PRD.md）
PRD_FILE="${1:-docs/PRD.md}"
LOG_FILE="scripts/auto.log"

# ── 颜色输出 ──────────────────────────────────────────────────────────────────
info()    { echo "[INFO]  $*"; }
success() { echo "[OK]    $*"; }
error()   { echo "[ERROR] $*" >&2; }

# ── 前置检查 ──────────────────────────────────────────────────────────────────
if [[ ! -f "$PRD_FILE" ]]; then
  error "找不到 $PRD_FILE，请先创建 PRD 文档。"
  exit 1
fi

if ! command -v claude &>/dev/null; then
  error "未找到 claude CLI，请先安装：npm install -g @anthropic-ai/claude-code"
  exit 1
fi

if ! command -v npm &>/dev/null; then
  error "未找到 npm，请先安装 Node.js"
  exit 1
fi

# ── 1. 读取 PRD ───────────────────────────────────────────────────────────────
info "读取 $PRD_FILE ..."
PRD_CONTENT="$(cat "$PRD_FILE")"
info "PRD 字数：$(wc -w <<<"$PRD_CONTENT") words"

# ── 2. 调用 Claude Code 修改代码 ──────────────────────────────────────────────
info "调用 Claude Code 根据 PRD 修改代码..."
PROMPT="$(cat <<PROMPT
你是一名资深前端开发者。请仔细阅读下方 PRD，对当前仓库中的代码进行增量实现或修改，
确保满足 PRD 中所有功能需求与验收标准。不要删除已有的正常功能，只做 PRD 要求的增量改动。

---PRD START---
${PRD_CONTENT}
---PRD END---

完成后请简要列出你修改或新增的文件。
PROMPT
)"

# 若在 Claude Code session 内调用，需 unset CLAUDECODE 才能嵌套运行
unset CLAUDECODE
claude \
  --allowedTools "Edit,Write,Read,Bash,Glob,Grep,MultiEdit" \
  --output-format text \
  -p "$PROMPT" \
  2>&1 | tee "$LOG_FILE"

success "Claude Code 执行完毕，日志已写入 $LOG_FILE"

# ── 3. 安装依赖（package.json 可能被修改）────────────────────────────────────
info "运行 npm ci ..."
npm ci

# ── 4. 构建 ───────────────────────────────────────────────────────────────────
info "运行 npm run build ..."
npm run build
success "构建成功"

# ── 5. E2E 测试 ───────────────────────────────────────────────────────────────
info "运行 npm run e2e ..."
npm run e2e
success "E2E 测试全部通过"

# ── 6. Git 提交推送 ───────────────────────────────────────────────────────────
info "提交变更..."
git add .

if git diff --cached --quiet; then
  info "没有检测到文件变更，跳过 commit。"
else
  git commit -m "feat: implement PRD"
  info "推送到远程..."
  git push
  success "推送完成"
fi

success "auto.sh 执行完毕"
