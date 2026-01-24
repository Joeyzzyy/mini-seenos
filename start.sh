#!/bin/bash

# ========================================
# SEOPages.pro 启动脚本
# ========================================
# 解决以下问题：
# 1. 端口被占用 (EADDRINUSE)
# 2. 权限问题 (EPERM)
# 3. 网络接口错误
# 4. 代理配置 (ClashX)
# ========================================

PORT=3007
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ClashX 代理配置
PROXY_PORT=7890
PROXY_HOST="127.0.0.1"

echo "🚀 启动 SEOPages.pro 开发服务器..."
echo "📁 项目目录: $PROJECT_DIR"
echo "🔌 端口: $PORT"
echo ""

# 进入项目目录
cd "$PROJECT_DIR"

# 检测 ClashX 代理是否运行
echo "🌐 检测代理..."
if nc -z $PROXY_HOST $PROXY_PORT 2>/dev/null; then
    echo "✅ 检测到 ClashX 代理 ($PROXY_HOST:$PROXY_PORT)"
    export HTTP_PROXY="http://$PROXY_HOST:$PROXY_PORT"
    export HTTPS_PROXY="http://$PROXY_HOST:$PROXY_PORT"
    export ALL_PROXY="http://$PROXY_HOST:$PROXY_PORT"
    export NO_PROXY="localhost,127.0.0.1"
    echo "✅ 已配置代理环境变量"
else
    echo "⚠️  未检测到 ClashX 代理，将直连网络"
    echo "   如需使用代理，请确保 ClashX 已启动并监听端口 $PROXY_PORT"
fi
echo ""

# 检查并清理端口占用
echo "🔍 检查端口 $PORT 占用情况..."

# 方法1: 使用 lsof 查找并杀死占用端口的进程
if command -v lsof &> /dev/null; then
    PIDS=$(lsof -ti:$PORT 2>/dev/null)
    if [ -n "$PIDS" ]; then
        echo "⚠️  发现端口 $PORT 被占用，正在清理..."
        echo "$PIDS" | xargs kill -9 2>/dev/null
        sleep 1
        echo "✅ 端口已清理"
    else
        echo "✅ 端口 $PORT 未被占用"
    fi
fi

# 方法2: 杀死所有 next 开发进程 (备用方案)
pkill -f "next dev" 2>/dev/null

# 等待进程完全退出
sleep 1

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 未找到 node_modules，正在安装依赖..."
    npm install
fi

echo ""
echo "🎯 启动开发服务器..."
echo "================================================"
echo ""

# 启动 Next.js 开发服务器
# 使用 exec 替换当前 shell，这样 Ctrl+C 可以正常终止
exec npm run dev
