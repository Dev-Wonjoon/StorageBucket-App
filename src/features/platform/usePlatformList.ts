import { useState, useEffect } from "react";
import { getPlatformList } from '../../api/client';
import type { Platform } from '../../api/types';

export function usePlatformList() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getPlatformList()
            .then(setPlatforms)
            .catch(error => setError(error.message || '플랫폼 로드 실패'))
            .finally(() => setLoading(false));
    }, []);

    return { platforms, loading, error };
} 