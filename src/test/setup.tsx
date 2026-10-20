import "@testing-library/jest-dom/vitest";

import { createElement } from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ priority, unoptimized, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; unoptimized?: boolean }) => {
    void priority;
    return createElement("img", {
      alt: props.alt ?? "",
      ...props,
      "data-unoptimized": unoptimized ? "true" : "false",
    });
  },
}));
