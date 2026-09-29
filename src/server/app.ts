/** The Express app: JSON API under /api, and optionally the built client. */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express, { type ErrorRequestHandler } from "express";
import { z } from "zod";
import type { ApiError, Version } from "../shared/types.ts";
import type { Db } from "./db.ts";
import { getTask, listTasks } from "./tasks.ts";
import { getVersion } from "./version.ts";

const taskIdParam = z.coerce.number().int().positive();

export interface AppOptions {
  /** Serve `dist/` (the built client) with a fallback to index.html. */
  serveClient?: boolean;
  clientDir?: string;
}

export function createApp(db: Db, options: AppOptions = {}): express.Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/ping", (_req, res) => {
    res.json({ pong: true });
  });

  app.get("/api/tasks", (_req, res) => {
    res.json(listTasks(db));
  });

  app.get("/api/version", (_req, res) => {
    const body: Version = { version: getVersion() };
    res.json(body);
  });

  app.get("/api/tasks/:id", (req, res) => {
    const parsed = taskIdParam.safeParse(req.params.id);
    if (!parsed.success) {
      const body: ApiError = { error: "Invalid task id" };
      res.status(400).json(body);
      return;
    }
    const task = getTask(db, parsed.data);
    if (!task) {
      const body: ApiError = { error: "Task not found" };
      res.status(404).json(body);
      return;
    }
    res.json(task);
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
