import { useStarField } from "./use-star-field";

// Full-screen canvas of twinkling stars with the odd shooting star.
const StarField = ({ active = true }: { active?: boolean }) => {
  const canvasRef = useStarField(active);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
};

export default StarField;
