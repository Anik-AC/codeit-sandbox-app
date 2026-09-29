import { readFileSync } from "node:fs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/server/app.ts";
import { openDb } from "../../../src/server/db.ts";

describe("GET /api/version", () => {
  it("returns 200 with the version field of package.json", async () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8")) as { version: string };

    const res = await request(createApp(openDb(":memory:"))).get("/api/version");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version: pkg.version });
  });
});
