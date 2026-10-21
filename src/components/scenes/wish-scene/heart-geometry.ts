// The classic parametric heart, scaled into a 0–100 box so stars can be
// positioned with percentages over the SVG (x: 8–92, y: 10–86 of 90).
export type Point = { x: number; y: number };

export const heartPoint = (t: number): Point => {
  const x = 16 * Math.sin(t) ** 3;
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x: 50 + x * 2.6, y: 41 + y * 2.6 };
};

/** `count` evenly spaced stars, starting at the dip at the top. */
export const heartStars = (count: number): Point[] =>
  Array.from({ length: count }, (_, i) =>
    heartPoint((i / count) * Math.PI * 2)
  );

/** A smooth SVG path of the full heart outline. */
export const heartPath = (() => {
  const pts = Array.from({ length: 120 }, (_, i) =>
    heartPoint((i / 120) * Math.PI * 2)
  );
  return (
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`
      )
      .join(" ") + " Z"
  );
})();

/** The curved stretch of heart outline between star `i` and the next. */
export const heartArc = (i: number, count: number): string => {
  const start = (i / count) * Math.PI * 2;
  const end = ((i + 1) / count) * Math.PI * 2;
  const steps = 16;
  return Array.from({ length: steps + 1 }, (_, s) => {
    const p = heartPoint(start + ((end - start) * s) / steps);
    return `${s === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(" ");
};
