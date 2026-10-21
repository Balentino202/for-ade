import { content } from "@/data";
import { useState } from "react";

// ViewModel for WishScene. Stars stay lit once tapped; the wish shown is
// the one for the star she tapped last.
export const useWishSceneViewModel = () => {
  const copy = content.wishes;
  const [lit, setLit] = useState<number[]>([]);
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const light = (index: number) => {
    setLastIndex(index);
    setLit((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  return {
    copy,
    // Written inside the heart once it's complete.
    name: content.herNickname.trim(),
    isLit: (index: number) => lit.includes(index),
    litCount: lit.length,
    total: copy.items.length,
    isComplete: lit.length === copy.items.length,
    lastWish: lastIndex === null ? null : copy.items[lastIndex],
    lastIndex,
    light,
  };
};
