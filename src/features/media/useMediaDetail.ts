import { useState, useEffect } from "react";
import type { Media } from "../../api/types";


const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
export function useMediaDetail(mediaId: number) {
  const [data, setData] = useState<Media | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/media/${mediaId}`)
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err.detail as string) || `Error ${res.status}`);
        }
        return res.json() as Promise<Media>;
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [mediaId]);

  return { data, loading, error };
}
