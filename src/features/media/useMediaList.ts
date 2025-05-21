import { useState, useEffect, useCallback } from "react";
import { getMediaList } from '../../api/client';
import type { Media } from '../../api/types';

export function useMediaList(limit = 30) {
    const [items, setItems] = useState<Media[]>([]);
    const [cursor, setCursor] = useState<number | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPage = useCallback(async (cur?: number) => {
        setLoading(true);
        setError(null);
        try {
            const newItems = await getMediaList(cur, limit);
            setHasMore(newItems.length === limit);
            setItems(prev => 
                cur === undefined
                    ? newItems
                    : [...prev, ...newItems]
            );
            if (newItems.length) {
                setCursor(newItems[newItems.length - 1].id);
            }
        } catch(error: any) {
            setError(error.message || '불러오기 실패');
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const loadNext = useCallback(() => {
        if(!loading && hasMore) {
            return fetchPage(cursor);
        }
    }, [fetchPage, cursor, loading, hasMore]);

    const refresh = useCallback(() => {
        setItems([]);
        setCursor(undefined);
        setHasMore(true);
        fetchPage(undefined);
    }, [fetchPage]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { items, hasMore, loadNext, refresh, loading, error };
}