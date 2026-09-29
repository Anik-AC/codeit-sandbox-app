import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/server/app.ts";
import { openDb, seed } from "../../../src/server/db.ts";

describe("GET /api/tasks/count", () => {
  it("counts the seeded tasks", async () => {
    const db = openDb(":memory:");
    seed(db);
    const res = await request(createApp(db)).get("/api/tasks/count");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ count: 3 });
  });

  it("returns 0 when there are no tasks", async () => {
    const res = await request(createApp(openDb(":memory:"))).get("/api/tasks/count");
    expect(res.body).toEqual({ count: 0 });
  });
});
