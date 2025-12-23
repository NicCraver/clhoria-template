import { jwt } from "hono/jwt";

import type { RouteModule } from "@/types/lib";

import configureOpenAPI from "@/lib/internal/openapi";

import env from "./env";
import createApp from "./lib/internal/create-app";
import { authorize } from "./middlewares/authorize";
import { operationLog } from "./middlewares/operation-log";

// 使用 import.meta.glob 自动加载路由模块
const adminModules = import.meta.glob<RouteModule>("./routes/admin/**/index.ts", { eager: true });
const clientModules = import.meta.glob<RouteModule>("./routes/client/**/index.ts", { eager: true });
const publicModules = import.meta.glob<RouteModule>("./routes/public/**/index.ts", { eager: true });

// 获取OpenAPIHono实例
const { adminApp, clientApp, publicApp, allApp, configureMainDoc } = configureOpenAPI();

// 创建主应用
const app = createApp();

// 配置文档主页（非生产环境）
configureMainDoc?.(app);

if (env.SENTRY_DSN) {
  const { sentry } = await import("@hono/sentry");
  app.use("*", sentry({ dsn: env.SENTRY_DSN }));
}

// #region 公共路由
for (const module of Object.values(publicModules)) {
  publicApp.route("/", module.default);
}
// #endregion

// #region 客户端路由
clientApp.use("/*", jwt({ secret: env.CLIENT_JWT_SECRET }));
for (const module of Object.values(clientModules)) {
  clientApp.route("/", module.default);
}
// #endregion

// #region 后管路由
// tip: 如果你要用 trpc 请参考 https://github.com/honojs/hono/issues/2399#issuecomment-2675421823

// 1. 先注册跳过全局认证的模块（如 auth 模块，内部自己处理 JWT）
for (const module of Object.values(adminModules)) {
  if (module.skipGlobalAuth) {
    adminApp.route("/", module.default);
  }
}

// 2. 应用全局中间件
adminApp.use("/*", jwt({ secret: env.ADMIN_JWT_SECRET }));
adminApp.use("/*", authorize());
adminApp.use("/*", operationLog({ moduleName: "后台管理", description: "后台管理操作日志" }));

// 3. 注册需要全局认证的模块
for (const module of Object.values(adminModules)) {
  if (!module.skipGlobalAuth) {
    adminApp.route("/", module.default);
  }
}
// #endregion

/** 路由分组 顺序很重要，直接影响了中间件的执行顺序，公共路由必须放最前面 */
app.route("/", publicApp);
app.route("/", clientApp);
app.route("/", adminApp);

// 将所有路由注册到 allApp（用于生成完整的 OpenAPI 文档）
for (const module of Object.values(publicModules)) {
  allApp.route("/", module.default);
}
for (const module of Object.values(clientModules)) {
  allApp.route("/", module.default);
}
// admin 的所有模块
for (const module of Object.values(adminModules)) {
  allApp.route("/", module.default);
}

// 挂载 allApp，使 /api/openapi.json 可访问
app.route("/", allApp);

export default app;
