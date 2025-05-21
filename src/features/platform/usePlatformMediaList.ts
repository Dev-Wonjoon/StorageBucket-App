import { useState, useEffect } from "react";
import { getMediaList, getPlatformList } from '../../api/client';
import type { Media, Platform } from '../../api/types';

export function usePlatformMediaList(platformName: string) {
    const [items, setItems] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!platformName) return;
        setLoading(true);

        // 플랫폼 ID를 가져오고 해당 플랫폼의 미디어만 필터링
        Promise.all([getPlatformList(), getMediaList()])
            .then(([platforms, mediaList]) => {
                const platform = platforms.find(p => p.name === platformName);
                if (!platform) {
                    setError('플랫폼을 찾을 수 없습니다.');
                    return;
                }
                const filteredMedia = mediaList.filter(media => media.platform_id === platform.id);
                setItems(filteredMedia);
            })
            .catch(error => setError(error.message || '미디어 로드 실패'))
            .finally(() => setLoading(false));
    }, [platformName]);

    return { items, loading, error };
} 