import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "uninotes_last_visited";
const EXCLUDED_ROUTES = ["/login", "/signup", "/bookmarks", "/profile", "/profile/edit"];

export const useTrackLastVisited = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (!EXCLUDED_ROUTES.includes(path) && path !== "/") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ path, timestamp: Date.now() })
      );
    }
  }, [location.pathname]);
};

export const getLastVisited = (): { path: string; timestamp: number } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
};

export const getLastVisitedLabel = (path: string): string => {
  if (path.startsWith("/resource/")) return "Last viewed resource";
  if (path.startsWith("/subject/")) return "Last browsed subject";
  if (path === "/browse") return "Browse page";
  if (path === "/scoreboard") return "Scoreboard";
  if (path === "/upload") return "Upload page";
  return "Last visited page";
};
