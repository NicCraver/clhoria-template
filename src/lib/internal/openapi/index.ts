import env from "@/env";

import { configureAllApp, createApps, createMainDocConfigurator } from "./helper";

export default function configureOpenAPI() {
  const isNotProd = env.NODE_ENV !== "production";
  const apps = createApps();

  const configureMainDoc = isNotProd ? createMainDocConfigurator(apps) : null;
  configureAllApp(apps);
  return { ...apps, configureMainDoc };
}
