/** The Express app: JSON API under /api, and optionally the built client. */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express, { type ErrorRequestHandler } from "express";
import type { ApiError } from "../shared/types.ts";
import type { Db } from "./db.ts";
import { listTasks } from "./tasks.ts";

export interface AppOptions {
  /** Serve `dist/` (the built client) with a fallback to index.html. */
  serveClient?: boolean;
  clientDir?: string;
}

export function createApp(db: Db, options: AppOptions = {}): express.Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/tasks", (_req, res) => {
    res.json(listTasks(db));
  });

  app.use("/api", (_req, res) => {
    const body: ApiError = { error: "Not found" };
    res.status(404).json(body);
  });

  if (options.serveClient) {
    const dir = resolve(options.clientDir ?? "dist");
    if (!existsSync(resolve(dir, "index.html"))) {
      throw new Error(`no built client in ${dir}; run npm run build`);
    }
    app.use(express.static(dir));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(resolve(dir, "index.html"));
    });
  }

  const onError: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
    const status = (err as { status?: number }).status ?? 500;
    const body: ApiError = { error: status === 500 ? "Internal server error" : String((err as Error).message) };
    if (status === 500) console.error(err);
    res.status(status).json(body);
  };
  app.use(onError);
  return app;
}
