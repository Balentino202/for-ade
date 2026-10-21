import type { SceneTone } from "@/constants/scene-constant";
import { cn } from "@/lib/utils";

// Vertical dots on the right edge — one per scene — to jump around the day.
export type SceneDot = {
  id: string;
  label: string;
  time: string;
};

type SceneDotsProps = {
  scenes: SceneDot[];
  activeId: string;
  tone: SceneTone;
  onSelect: (id: string) => void;
};

const SceneDots = ({ scenes, activeId, tone, onSelect }: SceneDotsProps) => {
  const isNight = tone === "night";
  return (
    <nav
      aria-label="Times of day"
      className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 sm:block"
    >
      <ol className="flex flex-col gap-3">
        {scenes.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${s.time} — ${s.label}`}
                className="group flex cursor-pointer items-center justify-end gap-3 py-1 focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                    isNight ? "glass-night text-starlight" : "glass text-ink"
                  )}
                >
                  {s.time}
                </span>
                <span
                  className={cn(
                    "block rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-lilac-deep",
                    isActive ? "h-6 w-2" : "size-2",
                    isNight
                      ? isActive
                        ? "bg-lilac-light"
                        : "bg-white/35"
                      : isActive
                        ? "bg-ink"
                        : "bg-ink/30"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default SceneDots;
