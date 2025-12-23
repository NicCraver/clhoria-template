import * as z from "zod";

import app from "./app";
import env from "./env";

// 配置 Zod 使用中文错误消息
z.config(z.locales.zhCN());

// 生产环境启动服务器
if (import.meta.env.PROD) {
  const { serve } = await import("@hono/node-server");
  const logger = (await import("./lib/logger")).default;

  serve({ fetch: app.fetch, port: env.PORT });
  logger.info({ port: env.PORT }, "[服务]: 启动成功");
}

export default app;
