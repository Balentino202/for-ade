import { createBrowserRouter } from "react-router";
import { mainRoutes } from "./routes/main.route";

// Single router entry. Keep this file thin — every route lives in its
// own `routes/*` module and is aggregated here.
// `basename` follows Vite's `base`, so the same build works at a domain
// root or in a GitHub Pages sub-folder.
export const router = createBrowserRouter([...mainRoutes], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
});
