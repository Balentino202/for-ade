import { cn } from "@/lib/utils";
import { SparkleIcon } from "lucide-react";

// A thin divider with a small sparkle in the middle.
const Flourish = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center gap-3 text-lilac-deep",
        className
      )}
    >
      <span className="h-px w-14 bg-linear-to-r from-transparent to-sky/70" />
      <SparkleIcon className="size-4" fill="currentColor" strokeWidth={0} />
      <span className="h-px w-14 bg-linear-to-l from-transparent to-lilac/70" />
    </div>
  );
};

export default Flourish;
