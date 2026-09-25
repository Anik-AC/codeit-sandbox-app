/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../../../src/client/App.tsx";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("loads and shows tasks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json([{ id: 1, title: "Loaded task", description: null, createdAt: "2026-01-01T00:00:00Z" }]),
      ),
    );
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Loaded task")).toBeInTheDocument();
  });

  it("shows the task count under the heading once tasks load", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json([
          { id: 1, title: "First", description: null, createdAt: "2026-01-01T00:00:00Z" },
          { id: 2, title: "Second", description: null, createdAt: "2026-01-01T00:01:00Z" },
          { id: 3, title: "Third", description: null, createdAt: "2026-01-01T00:02:00Z" },
        ]),
      ),
    );
    render(<App />);
    const count = await screen.findByText("3 tasks");
    expect(screen.getByRole("heading", { name: "Tasks" }).nextElementSibling).toBe(count);
  });

  it("shows an error when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 500 })));
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load tasks (500)");
  });
});
