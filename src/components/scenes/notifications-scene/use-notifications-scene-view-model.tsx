import { content } from "@/data";
import { useState } from "react";

// ViewModel for NotificationsScene. Notifications arrive in order, newest
// on top, one per tap.
export const useNotificationsSceneViewModel = () => {
  const copy = content.notifications;
  const [count, setCount] = useState(
    Math.min(copy.initialCount, copy.items.length)
  );

  const shown = copy.items
    .slice(0, count)
    .map((item, i) => ({ ...item, key: i }));

  return {
    copy,
    // Newest first, like a real lock screen.
    notifications: shown.reverse(),
    allSeen: count >= copy.items.length,
    burstKey: count,
    showAnother: () => setCount((c) => Math.min(c + 1, copy.items.length)),
  };
};
