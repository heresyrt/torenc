import type { JSX } from "react";
export type Feature = {
  id: number;
  icon?: JSX.Element;
  link?: string;
  image: string;
  title: string;
  paragraph?: string;
};
