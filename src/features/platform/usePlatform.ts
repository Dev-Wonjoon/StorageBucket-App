import { useCallback, useEffect, useState } from "react";
import { getMediaByPlatformName, getPlatformList } from "../../api/client";
import type { Platform } from '../../api/types';


export function usePlatform() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        setPlatforms([]);

        try {
            const data = await getPlatformList();
            if (Array.isArray(data)) {
                setPlatforms(data);
            } else {
                setPlatforms([]);
                setError('플랫폼 데이터 형식이 올바르지 않습니다.');
            }
        } catch(error: any) {
            setError(error.message || '플랫폼 로드 실패');
            setPlatforms([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { platforms, loading, error, refresh };
}