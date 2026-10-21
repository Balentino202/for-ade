import type { CSSProperties } from "react";

// One soft cloud drifting across the sky. Pure CSS animation.
type CloudProps = {
  top: string;
  width: number;
  duration: string;
  delay: string;
  opacity: number;
};

const Cloud = ({ top, width, duration, delay, opacity }: CloudProps) => {
  return (
    <svg
      viewBox="0 0 200 80"
      width={width}
      className="absolute left-0 animate-drift drop-shadow-[0_8px_16px_rgb(27_30_75/0.08)]"
      style={
        {
          top,
          opacity,
          animationDelay: delay,
          "--drift-duration": duration,
        } as CSSProperties
      }
      aria-hidden
    >
      <defs>
        <linearGradient id="cloud-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#efe6fb" />
        </linearGradient>
      </defs>
      <path
        d="M30 70 C10 70 4 52 18 44 C14 26 38 18 50 30 C56 10 88 6 98 26 C108 12 140 14 142 36 C160 30 180 42 174 56 C192 60 188 70 170 70 Z"
        fill="url(#cloud-fill)"
      />
    </svg>
  );
};

export default Cloud;
