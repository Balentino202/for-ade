import { content } from "@/data";
import type {
  NoticeNote,
  SnapshotMedia,
} from "@/model/frontend/experience-content";
import { useEffect, useMemo, useState } from "react";

// ViewModel for SnapshotsScene: the scrapbook of polaroids + notes, the
// full-screen viewer, and which notes she has unfolded.
//
// Missing files: during development they stay on the board as a
// placeholder naming the file to add; on the live site they are
// quietly dropped so she never sees a broken photo.
const SHOW_MISSING_PLACEHOLDERS = import.meta.env.DEV;

export type BoardItem =
  { kind: "media"; item: SnapshotMedia } | { kind: "note"; item: NoticeNote };

export const useSnapshotsSceneViewModel = () => {
  const copy = content.snapshots;
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());
  const [openNoteIds, setOpenNoteIds] = useState<Set<string>>(() => new Set());
  const [viewingId, setViewingId] = useState<string | null>(null);

  // Interleave photos and notes so the board feels like a scrapbook.
  const board = useMemo<BoardItem[]>(() => {
    const media = SHOW_MISSING_PLACEHOLDERS
      ? copy.media
      : copy.media.filter((m) => !failedIds.has(m.id));
    const out: BoardItem[] = [];
    const longest = Math.max(media.length, copy.notes.length);
    for (let i = 0; i < longest; i++) {
      if (media[i]) out.push({ kind: "media", item: media[i] });
      if (copy.notes[i]) out.push({ kind: "note", item: copy.notes[i] });
    }
    return out;
  }, [copy.media, copy.notes, failedIds]);

  const viewing = copy.media.find((m) => m.id === viewingId) ?? null;

  // Escape closes the viewer.
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewingId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  return {
    copy,
    board,
    viewing,
    isMissing: (id: string) => failedIds.has(id),
    markFailed: (id: string) =>
      setFailedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id))),
    isNoteOpen: (id: string) => openNoteIds.has(id),
    toggleNote: (id: string) =>
      setOpenNoteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    view: (id: string) => {
      if (!failedIds.has(id)) setViewingId(id);
    },
    closeViewer: () => setViewingId(null),
  };
};
