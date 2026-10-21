// Typed route paths. Import instead of hard-coding string literals so
// path changes are one-file edits and TypeScript catches typos.
export const RouteConstant = {
  app: {
    home: "/",
  },
  page: {
    notFound: "*",
  },
} as const;
