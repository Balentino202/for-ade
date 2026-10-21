import { RouteConstant } from "@/constants/route-constant";
import { ErrorView, ExperienceView, NotFoundView } from "@/view";
import { createElement } from "react";
import type { RouteObject } from "react-router";

// Route table. One screen — the experience — plus error + 404.
export const mainRoutes: RouteObject[] = [
  {
    errorElement: createElement(ErrorView),
    children: [
      { path: RouteConstant.app.home, Component: ExperienceView },
      { path: RouteConstant.page.notFound, Component: NotFoundView },
    ],
  },
];
