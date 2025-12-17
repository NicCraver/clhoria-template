# Clhoria Template macOS 本地开发指南

## 一、环境要求

### 必需环境

- **Node.js**: >= 24.12.0
- **pnpm**: >= 10.24.0
- **PostgreSQL**: >= 18 (推荐) 或 >= 13
- **Redis**: >= 7
- **macOS**: 12.0+

### 安装包管理器 Homebrew

```bash
# 安装 Homebrew (如果未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 二、数据库安装

### 安装 PostgreSQL

```bash
# 安装 PostgreSQL 18
brew install postgresql@18

# 启动服务
brew services start postgresql@18

# 创建数据库
createdb postgres
```

### 安装 Redis

```bash
# 安装 Redis
brew install redis

# 启动服务
brew services start redis
```

### 验证安装

```bash
# 检查服务状态
brew services list | grep -E 'postgresql|redis'

# 测试 PostgreSQL 连接
psql postgresql://postgres:postgres@localhost:5432/postgres -c "SELECT 1;"

# 测试 Redis 连接
redis-cli ping  # 应返回 PONG
```

## 三、项目初始化

### 1. 克隆项目

```bash
git clone https://github.com/zhe-qi/clhoria-template
cd clhoria-template
```

### 2. 安装 pnpm

```bash
# 启用 Node.js 自带的 corepack
npm i -g corepack
corepack enable

# 验证安装
pnpm --version
```

### 3. 安装依赖

```bash
pnpm install
```

## 四、环境变量配置

### 1. 创建环境文件

```bash
cp .env.example .env
```

### 2. 编辑 .env 文件

关键配置项：

```bash
# 运行环境
NODE_ENV=development

# 服务端口
PORT=9999

# 日志级别
LOG_LEVEL=debug

# 数据库连接
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Redis 连接
REDIS_URL=redis://localhost:6379/0

# JWT 密钥 (必须修改为强随机字符串，至少 32 字符)
CLIENT_JWT_SECRET=your-client-jwt-secret-min-32-chars-long-random-string
ADMIN_JWT_SECRET=your-admin-jwt-secret-min-32-chars-long-random-string
```

### 生成强随机密钥

```bash
# 使用 Node.js 生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用 openssl
openssl rand -hex 32
```

## 五、数据库初始化

### 开发环境

```bash
# 推送数据库 schema
pnpm push

# 填充初始数据 (可选)
pnpm seed
```

**初始账号**:

- 管理员: `admin` / `123456`
- 普通用户: `user` / `123456`

## 六、启动项目

### 开发模式

```bash
pnpm dev
```

启动成功后访问：

- **API 文档**: http://localhost:9999
- **健康检查**: http://localhost:9999/health

### 生产模式

```bash
# 构建项目
pnpm build

# 启动生产服务
pnpm start
```

## 七、代码质量检查

```bash
# 运行 ESLint
pnpm lint

# 自动修复代码风格问题
pnpm lint:fix

# TypeScript 类型检查
pnpm typecheck

# 运行测试
pnpm test

# 完整检查
pnpm check
```

## 八、数据库管理

### Drizzle Studio (推荐)

```bash
# 启动可视化数据库管理
pnpm studio
```

访问 `https://local.drizzle.studio` 查看数据库。

### 其他工具推荐

- **DBeaver**: https://dbeaver.io/download/
- **TablePlus**: https://tableplus.com/
- **pgAdmin**: https://www.pgadmin.org/download/

## 九、常见问题

### 1. 端口被占用

```bash
# 检查端口占用
lsof -i :9999

# 杀死进程 (替换 PID 为实际进程 ID)
kill -9 <PID>
```

### 2. PostgreSQL 连接失败

```bash
# 检查服务状态
brew services list | grep postgresql

# 重启服务
brew services restart postgresql@18

# 测试连接
psql postgresql://postgres:postgres@localhost:5432/postgres
```

### 3. Redis 连接失败

```bash
# 检查服务状态
brew services list | grep redis

# 重启服务
brew services restart redis

# 测试连接
redis-cli ping
```

### 4. 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 和 lockfile 重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 十、日常开发命令

```bash
# 查看数据库
pnpm studio

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 停止数据库服务
brew services stop postgresql@18
brew services stop redis
```

## 十一、技术栈

- **框架**: Hono (高性能 Web 框架)
- **语言**: TypeScript
- **数据库**: PostgreSQL + Drizzle ORM
- **缓存**: Redis + ioredis
- **认证**: JWT (双密钥隔离)
- **权限**: Casbin (RBAC)
- **文档**: OpenAPI 3.1 + Scalar UI
- **验证**: Zod (类型安全的 schema 验证)

## 十二、相关资源

- **项目仓库**: https://github.com/zhe-qi/clhoria-template
- **Hono 文档**: https://hono.dev
- **Drizzle ORM**: https://orm.drizzle.team
