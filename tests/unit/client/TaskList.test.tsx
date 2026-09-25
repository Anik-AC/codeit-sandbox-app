/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskList } from "../../../src/client/TaskList.tsx";

describe("TaskList", () => {
  it("shows an empty state", () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
  });

  it("lists titles and descriptions", () => {
    render(
      <TaskList
        tasks={[
          { id: 1, title: "First", description: "Details", createdAt: "2026-01-01T00:00:00Z" },
          { id: 2, title: "Second", description: null, createdAt: "2026-01-01T00:01:00Z" },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("FirstDetails");
    expect(items[1]).toHaveTextContent("Second");
  });
});
