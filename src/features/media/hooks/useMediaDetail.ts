import { useState, useEffect, useCallback } from "react";
import type { Media } from "../../../api/types";


const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
export function useMediaDetail(mediaId: number) {
  const [data, setData] = useState<Media | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/media/${mediaId}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err.detail as string) || `Error ${res.status}`);
      }
      const json = await res.json() as Media;
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [mediaId]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { data, loading, error, refreshMediaDetail: fetchMedia }; // Add refreshMediaDetail
}