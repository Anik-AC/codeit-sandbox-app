import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../../src/server/app.ts";
import { type Db, DEMO_TASKS, openDb, seed } from "../../../src/server/db.ts";

describe("GET /api/tasks", () => {
  let db: Db;

  beforeEach(() => {
    db = openDb(":memory:");
  });

  it("returns an empty list when there are no tasks", async () => {
    const res = await request(createApp(db)).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns tasks newest first", async () => {
    seed(db);
    const res = await request(createApp(db)).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body.map((t: { title: string }) => t.title)).toEqual(
      DEMO_TASKS.map((t) => t.title).reverse(),
    );
    expect(res.body[0]).toMatchObject({
      id: expect.any(Number),
      description: "Check the agent PRs before lunch.",
      createdAt: "2026-01-01T09:02:00.000Z",
    });
  });
});

describe("GET /api/tasks/:id", () => {
  let db: Db;

  beforeEach(() => {
    db = openDb(":memory:");
  });

  it("returns 200 with the task when the id exists", async () => {
    seed(db);
    const reviewTask = DEMO_TASKS[2];
    const list = await request(createApp(db)).get("/api/tasks");
    const id = list.body[0].id;

    const res = await request(createApp(db)).get(`/api/tasks/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id, title: reviewTask?.title, description: reviewTask?.description });
  });

  it("returns 404 when no task has that id", async () => {
    const res = await request(createApp(db)).get("/api/tasks/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Task not found" });
  });

  it("returns 400 when the id is not a number", async () => {
    const res = await request(createApp(db)).get("/api/tasks/not-a-number");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Invalid task id" });
  });
});

describe("the API", () => {
  it("reports health", async () => {
    const res = await request(createApp(openDb(":memory:"))).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("responds to a ping", async () => {
    const res = await request(createApp(openDb(":memory:"))).get("/api/ping");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ pong: true });
  });

  it("returns a JSON 404 for unknown API routes", async () => {
    const res = await request(createApp(openDb(":memory:"))).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });

  it("refuses to serve a client that was not built", () => {
    expect(() => createApp(openDb(":memory:"), { serveClient: true, clientDir: "/nonexistent" })).toThrow(
      /npm run build/,
    );
  });
});

describe("migrations", () => {
  it("are idempotent across opens", () => {
    const db = openDb(":memory:");
    const version = db.prepare("PRAGMA user_version").get() as { user_version: number };
    expect(version.user_version).toBeGreaterThan(0);
  });
});
