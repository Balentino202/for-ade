import { useEffect, useRef } from "react";

// Drawing logic for StarField. Plain canvas (no library): a few hundred
// dots are far cheaper here than DOM nodes. Stars drift with the pointer
// for a soft parallax. The loop pauses while the tab is hidden or while
// `active` is false (e.g. during the day, when the stars are invisible),
// which saves a lot of battery on phones.

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
  phase: number;
  depth: number;
  color: string;
};

type Shooter = { x: number; y: number; vx: number; vy: number; life: number };

const COLORS = ["255,255,255", "191,230,255", "230,211,245", "135,206,235"];

export const useStarField = (active: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const startRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    activeRef.current = active;
    if (active) startRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let nextShooterAt = performance.now() + 3000;
    let frame = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(260, Math.floor((width * height) / 6500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.9 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const t = now / 1000;

      for (const s of stars) {
        const twinkle = reduceMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const x = s.x + pointer.x * s.depth * 24;
        const y = s.y + pointer.y * s.depth * 24;
        ctx.fillStyle = `rgba(${s.color},${s.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.2) {
          ctx.fillStyle = `rgba(${s.color},${0.08 * twinkle})`;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduceMotion && now > nextShooterAt) {
        shooters.push({
          x: Math.random() * width * 0.7 + width * 0.3,
          y: Math.random() * height * 0.35,
          vx: -(Math.random() * 6 + 7),
          vy: Math.random() * 3 + 3,
          life: 1,
        });
        nextShooterAt = now + 4000 + Math.random() * 6000;
      }
      shooters = shooters.filter((sh) => sh.life > 0);
      for (const sh of shooters) {
        const tailX = sh.x - sh.vx * 14;
        const tailY = sh.y - sh.vy * 14;
        const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${sh.life})`);
        grad.addColorStop(1, "rgba(191,230,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.012;
      }

      if (!reduceMotion && activeRef.current && !document.hidden) {
        frame = requestAnimationFrame(draw);
      } else {
        frame = 0;
      }
    };

    startRef.current = () => {
      if (frame === 0) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / width - 0.5;
      pointer.ty = e.clientY / height - 0.5;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden) startRef.current();
    };
    const onResize = () => {
      resize();
      if (reduceMotion) draw(performance.now());
    };

    resize();
    frame = 0;
    startRef.current();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      startRef.current = () => undefined;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return canvasRef;
};
