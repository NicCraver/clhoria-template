# Clhoria 项目学习计划

> **版本**: v1.1 | **更新日期**: 2025-12-17
> **基于**: Clhoria Template v1.0.0 & CLAUDE.md 规范

## 📋 项目概述

**Clhoria** 是一个基于 Hono 的现代化企业级后端模板，采用 AI 驱动开发模式，集成 Hono + OpenAPI + Zod 完整技术体系。项目目标是提供比传统后台管理系统更稳定、高效的开发体验。

### 🎯 学习目标

- 掌握现代企业级后端开发全栈技能
- 理解 Hono + TypeScript + PostgreSQL + Redis 的最佳实践
- **掌握 Refine Query 声明式查询系统**（项目核心特性）
- 熟练应用 AI 辅助开发模式
- 建立完整的项目开发和部署能力

### 🏗️ 核心技术栈

- **框架**: Hono `4.10.7` + Node.js `24.12.0`
- **语言**: TypeScript `5.9.3`
- **数据库**: PostgreSQL `18` + Drizzle ORM `0.45.0` (snake_case)
- **缓存**: Redis `7+` (ioredis `5.8.2`)
- **认证**: JWT 双密钥 (`ADMIN_JWT_SECRET`/`CLIENT_JWT_SECRET`) + Casbin RBAC `5.45.0`
- **验证**: Zod `4.1.13` (中文错误信息)
- **文档**: OpenAPI 3.1 + Scalar UI + `@hono/zod-openapi` `1.1.5`
- **测试**: Vitest `4.0.15`
- **构建**: tsdown `0.17.2`
- **任务队列**: pg-boss `12.5.2` (基于 PostgreSQL)
- **定时任务**: croner `9.1.0`
- **验证码**: Cap.js `4.0.4`
- **日志**: Pino `10.1.0` + `hono-pino` `0.10.3`

### 🔍 实际项目技术栈匹配验证

| 技术         | 计划提及 | 实际版本 | 匹配度            |
| ------------ | -------- | -------- | ----------------- |
| Hono         | ✅       | 4.10.7   | 100%              |
| PostgreSQL   | ✅       | 18+      | ✅ (支持降级方案) |
| Drizzle ORM  | ✅       | 0.45.0   | 100%              |
| Redis        | ✅       | 5.8.2    | 100%              |
| JWT + Casbin | ✅       | 5.45.0   | 100%              |
| Zod          | ✅       | 4.1.13   | 100%              |
| OpenAPI      | ✅       | 3.1      | 100%              |
| Vitest       | ✅       | 4.0.15   | 100%              |
| tsdown       | ✅       | 0.17.2   | 100%              |

---

## 📚 学习阶段

### 阶段1：入门准备 (3-5天)

**目标**: 快速上手项目环境，理解整体架构

#### 核心任务

1. **环境搭建**
   - 安装 Node.js ≥24、pnpm ≥10
   - 配置 PostgreSQL 18+、Redis 7+
   - **重要**: PostgreSQL 18 以下需要修改 `src/db/schema/_shard/base-columns.ts`
   - 验证各工具版本和连接性

2. **项目运行**

   ```bash
   git clone <repository>
   cd clhoria-template
   pnpm install
   cp .env.example .env
   pnpm push     # 初始化数据库架构
   pnpm seed     # 填充初始数据（可选）
   pnpm dev      # 启动开发服务器
   pnpm studio   # 可视化数据库管理（推荐）
   ```

3. **核心文档阅读**
   - README.md：项目特性、安装部署指南、性能对比
   - **CLAUDE.md**：**开发规范、核心规则和技术要求（必须精读）**
   - Learn Clhoria 学习指南（本文件）

4. **代码结构探索**
   - `src/app.ts`：应用入口和三层路由装载
   - `src/routes/{tier}/{feature}/`：三层路由架构及模块结构
   - `src/db/schema/`：数据库模式定义（snake_case）
   - `src/lib/`：核心工具库（Refine Query、OpenAPI、Casbin 等）
   - `src/services/`：可复用业务逻辑

#### 验证标准

- ✅ 项目成功启动，访问 http://localhost:9999 查看 Scalar API 文档
- ✅ 数据库连接正常，种子数据正确填充
- ✅ 能理解项目的基本分层架构和路由层级
- ✅ 使用 `pnpm studio` 能看到数据库表结构

---

### 阶段2：核心技术栈 (5-7天) **增加 1 天**

**目标**: 掌握项目核心技术栈的使用方法，**重点学习 Refine Query 系统**

#### 核心任务

1. **Hono 框架精通**
   - 路由定义和中间件机制
   - **响应包装模式**（强制使用 `Resp.ok()` / `Resp.fail()`）
   - 上下文(Context)对象的使用
   - JWT 中间件和自定义中间件（authorize、operationLog）

2. **TypeScript 高级特性**
   - 严格类型约束和类型推导
   - **Handler 严格类型约束**：`export const list: FeatureRouteHandlerType<"list"> = async (c) => {}`
   - 泛型和工具类型的应用
   - 编译时类型检查的最佳实践

3. **Drizzle ORM 实践**
   - 查询构建器(Query Builder)使用
   - **Snake_case 命名**：TypeScript camelCase → 自动转为 snake_case
   - **Base Columns 继承**：`id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
   - 事务处理(Transaction)
   - **现代语法**：`varchar({ length: 128 })` 而非旧式用法

4. **Refine Query 系统** ⭐ **核心**
   - **参数格式**：`?current=1&pageSize=10&filters=[...]&sorters=[...]`
   - **安全验证**：JSON 长度限制、深度限制（5层）、敏感字段检测
   - **操作符**：24 种操作符（`eq`, `ne`, `lt`, `gt`, `in`, `contains`, `between`, `null` 等）
   - **联表查询**：`joinConfig` 配置多表 JOIN
   - **分页模式**：`server` / `client` / `off`

5. **Redis 缓存系统**
   - 基础缓存操作
   - 会话管理和分布式锁
   - **权限缓存**和性能优化

6. **实战：Refine Query 应用**
   ```typescript
   // 实际项目模式
   export const list: SystemUsersRouteHandlerType<"list"> = async (c) => {
     const parseResult = RefineQueryParamsSchema.safeParse(c.req.query());
     const [error, result] = await executeRefineQuery({
       table: systemUsers,
       queryParams: parseResult.data,
       joinConfig: {
         joins: [
           { table: systemUserRoles, type: "left", on: eq(systemUsers.id, systemUserRoles.userId) },
           { table: systemRoles, type: "left", on: eq(systemUserRoles.roleId, systemRoles.id) }
         ],
         selectFields: {
           id: systemUsers.id,
           username: systemUsers.username,
           roles: sql`json_agg(json_build_object('id', ${systemRoles.id}, 'name', ${systemRoles.name}))`
         },
         groupBy: [systemUsers.id]
       }
     });
     const safeData = result.data.map(({ password, ...user }) => user);
     c.header("x-total-count", result.total.toString());
     return c.json(Resp.ok(safeData), HttpStatusCodes.OK);
   };
   ```

#### 实践项目

**目标**: 实现一个完整的用户管理 CRUD 接口（参考 `src/routes/admin/system/users/`）

**要求**:

- 包含列表查询、详情获取、创建、更新、删除操作
- **使用 Refine Query 实现分页和搜索功能**
- **实现复杂的联表查询**（用户 + 角色）
- 编写完整的类型定义和 Zod 验证
- 生成对应的 OpenAPI 文档
- **实现敏感字段过滤**（密码等）

#### 重点掌握

1. **响应包装模式**：所有接口必须返回 `Resp.ok(data)` 或 `Resp.fail("错误")`
2. **日志格式**：`logger.info({ userId }, "[模块]: 描述")` - **数据在前，描述在后**
3. **类型安全**：Handler 必须使用 `<FeatureRouteHandlerType<"...">>`
4. **Refine Query**：理解参数验证、过滤器转换、联表配置

---

### 阶段3：架构实践 (5-7天)

**目标**: 熟练使用三层路由架构和 OpenAPI 集成

#### 核心任务

1. **三层路由架构**（必须精读 `src/app.ts`）

   ```text
   /api/public/*   # 无认证接口（健康检查、验证码）
   /api/client/*   # JWT 认证接口
   /api/admin/*    # JWT + RBAC + 审计日志接口
   ```

2. **路由模块开发**（标准结构）

   ```
   src/routes/{tier}/{feature}/
   ├── {feature}.handlers.ts    # 业务逻辑处理器（使用 Refine Query）
   ├── {feature}.routes.ts      # 路由定义和 OpenAPI 架构
   ├── {feature}.schema.ts      # Zod 校验 Schema（使用 drizzle-zod）
   └── {feature}.index.ts       # 统一导出
   ```

3. **OpenAPI 集成**
   - 使用 `@hono/zod-openapi` 自动文档生成
   - Scalar UI 在线调试
   - **类型安全的前后端同步**
   - 标签组织：`tags: ["/system/users（系统用户）"]`

4. **混合架构策略**

   **简单 CRUD（80%）**：直接在 handler 实现

   ```typescript
   export const get: FeatureRouteHandlerType<"get"> = async (c) => {
     const { id } = c.req.valid("param");
     const result = await db.query.table.findFirst({ where: eq(table.id, id) });
     return c.json(Resp.ok(result), HttpStatusCodes.OK);
   };
   ```

   **复杂业务（20%）**：抽离为服务（**仅当复用≥2次**）

   ```typescript
   // src/services/admin.ts - 仅在多个 handler 重复使用时才创建
   export const generateTokens = async (payload: { id: string; roles: string[] }) => { ... };
   ```

#### 实践项目

**目标**: 实现完整的博客内容管理系统

**模块设计**:

- **用户管理模块**（admin层）- 参考现有 `system/users`
- **文章管理模块**（admin层）- 使用 Refine Query + 关联查询
- **分类标签模块**（admin层）- 多对多关系处理
- **公开内容接口**（public层）- 轻量 API

**技术要求**:

- **严格遵循路由模块结构**
- **完整的 OpenAPI 文档**
- **统一的错误处理格式**
- **实现简单的权限控制**（仅 admin 可写）

#### 关键学习点

1. **服务层抽离原则**：仅当业务逻辑被多个路由复用时才创建服务
2. **混合架构**：CRUD 简单的走 handler，复杂的走轻量 DDD
3. **事务管理**：复杂业务使用 `db.transaction()`

---

### 阶段4：数据与权限 (7-9天) **增加 1 天**

**目标**: 掌握数据库设计和权限管理体系，**重点理解"代码即权限"理念**

#### 核心任务

1. **数据库架构设计**
   - **基础列继承** (`src/db/schema/_shard/base-columns.ts`)
   - **枚举定义和使用**（PostgreSQL Enum）
   - **外键约束和索引优化**
   - **迁移文件管理**（`drizzle-kit generate/migrate/push`）
   - **重要**：**NEVER** 修改 `migrations/` 和 `meta/` 文件夹

2. **权限系统实现** ⭐ **核心创新**

   **理念：代码即权限（Code as Permission）**
   - **JWT 双密钥设计**：`ADMIN_JWT_SECRET` / `CLIENT_JWT_SECRET`
   - **Casbin RBAC**：`model.conf` + `policy.csv`
   - **KeyMatch3 路径匹配**：`/api/admin/system/users/*` 匹配权限
   - **权限标识来自 OpenAPI 路由定义**，**无需数据库存储**
   - **权限缓存**：Redis 集成

   **对比传统方案**：

   | 维度         | Clhoria 方案             | 传统方案     |
   | ------------ | ------------------------ | ------------ |
   | **权限存储** | OpenAPI 路由定义         | 数据库权限表 |
   | **维护**     | 改一处自动同步           | 手动维护多处 |
   | **类型检查** | TypeScript 编译时        | 运行时       |
   | **菜单生成** | Refine Resource 自动生成 | 数据库存储   |

3. **数据访问层**
   - **Repository 模式**：仅在复用≥2次时使用
   - **查询优化**：使用 Refine Query 系统
   - **事务管理**：`db.transaction()` 确保一致性
   - **性能监控**：日志 + 指标

4. **审计和日志**
   - **操作日志**：`operationLog` 中间件（admin 层自动启用）
   - **审计追踪**：createdBy/updatedBy 字段
   - **日志格式**：`[模块名]: 描述`，**无 emoji/英文**

#### 实践项目

**目标**: 实现企业级用户权限管理系统

**功能模块**:

- **用户角色管理**（RBAC）- 多对多关系
- **权限策略配置**（Casbin Policy）
- **资源访问控制**（KeyMatch3）
- **操作审计日志**（自动记录）

**安全要求**:

- ✅ 完整的权限验证链路
- ✅ 敏感操作审计记录
- ✅ **JWT token 安全管理**（HttpOnly Cookie + Access Token）
- ✅ **内置用户保护**（不允许修改状态/删除）

#### 重点掌握

1. **"代码即权限"**：理解为何权限标识不需要数据库存储
2. **Casbin KeyMatch3**：路径匹配规则的实际应用
3. **JWT 双密钥隔离**：Admin 和 Client 的安全隔离
4. **PostgreSQL Enum**：类型安全的枚举系统

---

### 阶段5：质量保障 (5-6天) **增加 1 天**

**目标**: 建立完整的测试体系和代码质量保障

#### 核心任务

1. **Zod 验证系统**（Zod v4）

   **Zod Schema 继承模式**：

   ```typescript
   // 1. Base（添加描述）
   const selectSchema = createSelectSchema(table, {
     field: schema => schema.meta({ description: "描述" })
   });

   // 2. Insert（去掉 id）
   const insertSchema = createInsertSchema(table).omit({ id: true });

   // 3. Derived
   const patchSchema = insertSchema.partial();
   const querySchema = selectSchema.pick({...}).extend({
     optional: z.string().optional()
   });

   // 4. 类型约束
   const Schema: z.ZodType<Interface> = z.object({
     field: z.string().optional()  // .optional() not .nullable()
   });
   ```

   **验证器**：
   - 各种验证器 (string, number, object, array)
   - **中文错误信息**
   - 自定义验证规则
   - 类型推导和自动完成

2. **错误处理机制**

   **统一响应格式**：

   ```typescript
   // 成功
   // 使用 HttpStatusCodes 常量
   import * as HttpStatusCodes from "@/lib/stoker/http-status-codes";

   return c.json(Resp.ok(data), HttpStatusCodes.OK);

   // 失败
   return c.json(Resp.fail("错误信息"), HttpStatusCodes.BAD_REQUEST);
   ```

   **错误处理最佳实践**：

   ```typescript
   try {
     // 业务逻辑
   }
   catch (error) {
     // 不要盲目 try-catch
     // 研究 Drizzle 依赖的错误行为
     const pgError = mapDbError(error);
     if (pgError?.type === "UniqueViolation") {
       return c.json(Resp.fail("用户名已存在"), HttpStatusCodes.CONFLICT);
     }
     throw error; // 重新抛出未知错误
   }
   ```

3. **日志系统** 🎯 **严格规范**

   **Pino 严格格式**：

   ```typescript
   // ✅ 正确
   logger.info({ userId }, "[用户]: 登录成功");
   logger.error(error, "[系统]: 初始化失败");
   logger.warn({ field }, "[查询过滤]: 尝试访问敏感字段");

   // ❌ 错误 - 严禁使用
   console.log("用户登录:", userId);
   logger.info("数据:", data);  // 数据必须在前
   logger.info("[模块]: 数据:", data);  // 数据必须在前对象
   console.log(...);   // 严禁用 console
   ```

   **关键规则**：
   - 数据对象在前，描述在后
   - 格式：`[模块名]: 描述`
   - 无 emoji / 英文
   - **25% 间隔记录**：复杂操作每 25% 进度记录一次
   - 敏感字段检测：`["password", "secret", "token", "key"]`

4. **测试覆盖**

   **Vitest 使用**：
   - 单元测试：工具函数
   - 集成测试：API 接口
   - **覆盖率目标：≥80%**
   - 测试辅助工具使用

   **示例**：

   ```typescript
   // src/routes/admin/system/users/user.test.ts
   import { beforeAll, describe, expect, it } from "vitest";

   import app from "@/app";

   describe("用户管理", () => {
     it("应该成功创建用户", async () => {
       const res = await app.request("/api/admin/system/users", {
         method: "POST",
         headers: { Authorization: `Bearer ${adminToken}` },
         body: JSON.stringify({ username: "test", password: "Test123!" })
       });

       expect(res.status).toBe(201);
     });
   });
   ```

#### 实践项目

**目标**: 为现有项目添加完整的质量保障体系

**测试范围**:

- ✅ 工具函数单元测试
- ✅ API 接口集成测试
- ✅ 权限验证测试
- ✅ **Refine Query 参数验证测试**
- ✅ 错误处理边界测试

---

### 阶段6：生产部署 (4-5天) **增加 1 天**

**目标**: 掌握生产环境部署和运维能力

#### 核心任务

1. **容器化部署**

   ```bash
   # 构建镜像
   docker build -t clhoria-template .

   # 运行容器
   docker run -p 9999:9999 --env-file .env clhoria-template

   # 使用 docker-compose（推荐）
   docker-compose up -d
   ```

2. **任务队列和定时任务** ⭐ **新增**

   **pg-boss 后台任务队列**：

   ```typescript
   // 项目基于 PostgreSQL，无需额外队列服务
   // 任务存储在 pg-boss schema
   export const someJob = async () => {
     await dbBoss.insert("queue-name", { data });
   };
   ```

   **croner 定时任务**：

   ```typescript
   import { Cron } from "croner";

   const job = new Cron("0 0 * * *", async () => {
     logger.info("[定时任务]: 每日数据清理开始");
     // 业务逻辑
   });
   ```

3. **环境配置**

   **生产环境变量管理**：
   - `.env` 文件配置（**NOT in git**）
   - **必须配置**：
     - `ADMIN_JWT_SECRET` / `CLIENT_JWT_SECRET`（强随机值）
     - `DATABASE_URL`（生产环境）
     - `SENTRY_DSN`（可选）
     - **Redis 和 PostgreSQL 连接池配置**

   **数据库配置**：
   - 连接池大小优化
   - 读写分离（主从）

4. **性能优化**

   **缓存策略**：
   - Redis 缓存 + 权限缓存
   - **多层限流策略**（`hono-rate-limiter` + `rate-limit-redis`）
   - 分布式锁

   **数据库优化**：
   - 索引优化
   - **查询优化**：使用 Refine Query 系统
   - 事务边界控制

   **并发处理**：
   - Worker Threads（CPU 密集型）
   - WASM（复杂算法）
   - N-API（原生模块）

5. **监控和运维**

   **Sentry 集成**：

   ```typescript
   if (env.SENTRY_DSN) {
     const { sentry } = await import("@hono/sentry");
     app.use("*", sentry({ dsn: env.SENTRY_DSN }));
   }
   ```

   **监控指标**：
   - 错误追踪
   - 性能指标
   - **日志聚合**：支持多种存储（阿里云 SLS、TimescaleDB、Loki）

   **备份策略**：
   - PostgreSQL 定期备份
   - Redis RDB/AOF 配置

6. **第三方服务集成**

   **可选但推荐**：
   - **Sentry**: 错误追踪
   - **Cloudflare R2 / AWS S3 / 阿里云 OSS**: 对象存储
   - **Cap.js**: 现代化验证码（替代 svg-captcha）

#### 实践项目

**目标**: 完成项目的生产环境部署

**部署要求**:

- ✅ Docker 容器化
- ✅ 环境变量配置完整
- ✅ 数据库迁移验证（`pnpm generate` → `pnpm migrate`）
- ✅ **任务队列测试**
- ✅ 监控系统集成（Sentry）
- ✅ 性能基准测试（对比开发/生产）
- ✅ 日志存储配置

#### 额外特色功能学习

**项目已实现的高级特性**（计划中未明确提及）：

1. **Cap.js 验证码系统**
   - 多种挑战类型
   - 数据库存储，支持分布式
   - 对比 `svg-captcha` 的安全性

2. **S3 对象存储集成**
   - 支持 Cloudflare R2、阿里云 OSS、AWS S3
   - 预签名 URL 生成

3. **声明式分页器**
   - 基于 Refine 规范
   - **扩展支持仅后端联表查询**
   - 安全的查询验证

4. **类型安全字典**
   - PostgreSQL Enum → Drizzle-Zod → OpenAPI
   - 前后端 100% 同步，编译时检查

---

## 💡 学习建议

### 📖 学习方法

1. **理论实践结合**: 每个概念学习后立即动手实践
2. **循序渐进**: 按阶段顺序学习，不要跳跃
3. **问题导向**: 遇到问题：
   - 第一步：查 CLAUDE.md（开发规范）
   - 第二步：看源码实现（`src/` 目录）
   - 第三步：查官方文档（Hono/Drizzle/Zod）
4. **对照学习**: 实际代码 vs 学习计划，确保知识点完整覆盖

### ⚡ 三大核心规则（必须背诵）

这是项目**最重要**的规范，所有代码必须遵守：

1. **响应包装 (Response Wrapping)** - ❗ **强制所有响应**

   ```typescript
   // ✅ 必须使用
   return c.json(Resp.ok(data), HttpStatusCodes.OK);
   return c.json(Resp.fail("错误"), HttpStatusCodes.BAD_REQUEST);

   // ❌ 严禁使用
   return c.json(data, HttpStatusCodes.OK);
   return c.json({ error: "..." }, 400);
   ```

2. **日志记录 (Logging)** - ❗ **严格格式**

   ```typescript
   // ✅ 必须使用
   logger.info({ userId }, "[用户]: 登录成功");
   logger.error(error, "[系统]: 初始化失败");

   // ❌ 严禁使用
   console.log("用户登录:", userId); // 不能用 console
   logger.info("数据:", data); // 不能数据在后
   ```

3. **类型安全 (Type Safety)** - ❗ **Handler 必须严格类型**

   ```typescript
   // ✅ 必须使用
   export const list: FeatureRouteHandlerType<"list"> = async (c) => {};

   // ❌ 严禁使用
   export const list = async (c: Context) => {}; // 太宽泛
   export const list: any = async (c) => {}; // any 是大忌
   ```

### 📋 代码规范补充

1. **文件命名**: `kebab-case`（`user-management.ts`）
2. **类命名**: `PascalCase`（`class UserService`）
3. **枚举值**: `UPPER_SNAKE_CASE`（`Status.ENABLED`）
4. **包管理器**: **仅用 pnpm**（`pnpm install`）
5. **数据库命名**: `snake_case`（Drizzle 自动转换）
6. **导入路径**: 使用 `@/` 别名（`import db from "@/db"`）

### 🛠️ 开发工具

- **编辑器**: VS Code + TypeScript 插件
- **API 调试**: Scalar UI (http://localhost:9999)
- **数据库可视化**: Drizzle Studio (`pnpm studio`)
- **测试**: Vitest (`pnpm test`)
- **代码检查**: ESLint (`pnpm lint`) + Prettier
- **Git Hooks**: simple-git-hooks（pre-commit 自动检查）

### 🔍 常用命令速查

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm studio           # 数据库可视化
pnpm push            # 推送数据库 schema（开发）
pnpm seed            # 填充种子数据

# 构建 & 部署
pnpm build           # 构建生产版本
pnpm start           # 启动生产环境
pnpm generate        # 生成迁移文件
pnpm migrate         # 执行迁移

# 质量控制
pnpm test            # 运行测试
pnpm lint            # 代码检查
pnpm lint:fix        # 自动修复
pnpm typecheck       # 类型检查
pnpm check           # 一次性检查（lint + typecheck + test）
```

### 📈 进度跟踪

- ✅ **每 25% 进度记录日志**（遵循日志规范）
- ✅ **每个阶段完成后代码对比**：对照项目现有实现
- ✅ **技术难点记录**：在 Clhoria-Learning-Plan.md 中添加注释
- ✅ **定期回顾 CLAUDE.md**：确保不遗漏核心规则

### 🎯 完成标准

完成所有阶段后，你将能够：

- ✅ 独立开发基于 Clhoria 的企业级后端应用
- ✅ **熟练掌握 Refine Query 声明式查询系统**
- ✅ **理解并应用"代码即权限"的创新理念**
- ✅ 熟练使用现代 TypeScript + Hono 开发模式
- ✅ 理解并应用 AI 辅助开发的优势
- ✅ 掌握完整的项目部署、监控和运维流程
- ✅ 生产环境调试和性能优化

---

## 📞 获取帮助

### 优先级

1. **项目文档**（最高优先级）
   - `CLAUDE.md`：开发规范、核心规则
   - `README.md`：项目特性、快速开始
   - 本学习计划：学习路径

2. **代码示例**（次优先级）
   - `src/routes/admin/system/users/` - 完整 CRUD + Refine Query 示例
   - `src/routes/admin/auth/` - 认证流程
   - `src/lib/refine-query/` - 查询系统源码

3. **官方文档**（参考）
   - [Hono](https://hono.dev/)
   - [Drizzle ORM](https://orm.drizzle.team/)
   - [Zod](https://zod.dev/)
   - [Casbin](https://casbin.org/)
   - [pg-boss](https://github.com/timgit/pg-boss)

### 常见问题

**Q: PostgreSQL 版本不兼容？**
A: 参考 README.md 中的降级方案，修改 `src/db/schema/_shard/base-columns.ts`

**Q: Refine Query 参数怎么写？**
A: 参考 `src/routes/admin/system/users/handlers.ts` 中的 `list` 函数

**Q: 权限不生效？**
A: 检查 1) Casbin 策略文件 2) JWT 有效期内 3) 路径匹配规则 (KeyMatch3)

**Q: 日志格式错误？**
A: 必须 `logger.info({data}, "[模块]: 描述")`，数据在前，描述在后

---

## 📝 附录

### A. 项目架构速查表

```
src/
├── app.ts                           # 应用入口
├── db/
│   ├── index.ts                     # 数据库实例
│   ├── schema/
│   │   ├── _shard/
│   │   │   ├── base-columns.ts      # 基础列（pg18+）
│   │   │   └── enums.ts             # 枚举定义
│   │   ├── admin/                   # 管理端表
│   │   └── client/                  # 客户端表
│   └── migrations/                  # 自动生成
├── lib/
│   ├── openapi.ts                   # OpenAPI 配置
│   ├── casbin/                      # RBAC 权限
│   ├── refine-query/                # 声明式查询 ⭐
│   ├── cap/                         # 验证码
│   └── create-app.ts                # Hono 实例创建
├── routes/
│   ├── public/                      # 无认证
│   ├── client/                      # JWT 认证
│   └── admin/                       # JWT + RBAC
│       ├── auth/                    # 认证模块
│       ├── system/
│       │   ├── users/               # 完整 CRUD + Refine Query 示例
│       │   ├── roles/               # RBAC 示例
│       │   └── ...
│       └── resources/               # 资源管理
├── services/                        # 复用服务（≥2次才创建）
├── middlewares/                     # 自定义中间件
└── utils/                           # 工具函数
```

### B. 核心流程速查

#### 认证流程

```
1. 用户登录 → /api/admin/auth/login
   - 验证码验证（生产环境）
   - 用户名密码验证
   - 查询角色 → 生成 JWT tokens
   - AccessToken 返回，RefreshToken 存 Cookie

2. 请求受保护接口
   - JWT 中间件验证
   - Casbin RBAC 验证（authorize 中间件）
   - 操作日志记录（operationLog 中间件）
   - 执行业务逻辑
   - 返回包装响应
```

#### Refine Query 流程

```
1. 请求参数：?current=1&pageSize=10&filters=[...]&sorters=[...]
2. Zod 验证：RefineQueryParamsSchema.safeParse()
3. 安全检查：JSON 长度/深度/敏感字段
4. 转换后：Drizzle WHERE 条件
5. JOIN 处理：joinConfig（多表联查）
6. 分页计算：LIMIT/OFFSET
7. 执行查询：db.select() + count()
8. 返回：{ data, total }
```

#### 权限流程

```
1. OpenAPI 路由定义 → 权限标识
2. JWT Token 解析 → 用户角色
3. Casbin KeyMatch3 → 路径匹配
4. Redis 缓存 → 性能优化
5. 返回：允许/拒绝
```

### C. 三大核心规则检查清单

在编写任何代码前，请检查：

- [ ] **响应包装**: 是否使用 `Resp.ok()` 或 `Resp.fail()`？
- [ ] **日志格式**: 是否 `logger.info({data}, "[模块]: 描述")`？
- [ ] **类型约束**: Handler 是否使用 `FeatureRouteHandlerType`？

### D. 学习时间预估

| 阶段              | 时间   | 累计     |
| ----------------- | ------ | -------- |
| 阶段1：入门准备   | 3-5 天 | 3-5 天   |
| 阶段2：核心技术栈 | 5-7 天 | 8-12 天  |
| 阶段3：架构实践   | 5-7 天 | 13-19 天 |
| 阶段4：数据与权限 | 7-9 天 | 20-28 天 |
| 阶段5：质量保障   | 5-6 天 | 25-34 天 |
| 阶段6：生产部署   | 4-5 天 | 29-39 天 |

**总预计时间：29-39 天（约 1-1.5 个月）**

---

> 🎯 **记住：多实践，勤思考，注重细节。Clhoria 的设计理念是"化繁为简"，通过严格的规范和现代化的工具链，让复杂的企业级开发变得简单而优雅。**
