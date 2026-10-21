import MusicProvider from "@/components/providers/music-provider";
import { MotionConfig } from "framer-motion";
import { RouterProvider } from "react-router";
import { router } from "./router";

// App shell. Keep this file tiny — routing + global providers only.
// `reducedMotion="user"` makes every Framer Motion animation honour the
// visitor's "reduce motion" OS setting (transforms are skipped, fades
// stay).
const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <RouterProvider router={router} />
      </MusicProvider>
    </MotionConfig>
  );
};

export default App;
