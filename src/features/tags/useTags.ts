import { useState, useEffect, useCallback } from "react";
import { getAllTags } from "../../api/client";
import type { Tag } from "../../api/types";

export function useTags() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTags = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllTags();
            if(Array.isArray(data)) {
                setTags(data);
            } else {
                setTags([]);
                setError("Invalid data format");
            }
        } catch (error: any) {
            setError(error.message || "Failed to load tags");
            setTags([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshTags();
    }, [refreshTags]);

    return { tags, loading, error, refreshTags };
}