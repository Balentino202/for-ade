// Turns a path from `data.ts` like "/media/video-1.mp4" into a URL that
// works wherever the site is hosted — at the domain root (Vercel,
// Netlify) or in a sub-folder (GitHub Pages: /for-ade/). Full links
// (https://…) pass through unchanged.
export const assetUrl = (path: string): string => {
  if (/^[a-z]+:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
};
