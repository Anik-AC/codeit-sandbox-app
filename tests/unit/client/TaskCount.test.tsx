/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskCount } from "../../../src/client/TaskCount.tsx";

describe("TaskCount", () => {
  it("shows the plural count for 3 tasks", () => {
    render(<TaskCount count={3} />);
    expect(screen.getByText("You have 3 tasks")).toBeInTheDocument();
  });

  it("shows the singular count for 1 task", () => {
    render(<TaskCount count={1} />);
    expect(screen.getByText("You have 1 task")).toBeInTheDocument();
  });

  it("renders nothing for 0 tasks", () => {
    const { container } = render(<TaskCount count={0} />);
    expect(container).toBeEmptyDOMElement();
  });
});
