import { useState } from "react";
import type { Media } from '../../api/types';
import { usePlatform } from "../platform/usePlatform";


const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export interface UseMediaGridReturn {
    imgErrors: Record<number, boolean>;
    handleImageError: (id: number) => void;
    getPlatformName: (platformId: number | null) => string | null;
    getThumbnailUrl: (item: Media) => string | null;
    getFileUrl: (item: Media) => string | null;
}

function encodePath(path: string): string {
    return path
        .split('/')
        .map(segment => encodeURIComponent(segment))
        .join('/');
}

export function useMediaGrid(): UseMediaGridReturn {
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
    const { platforms } = usePlatform();
    
    // 플랫폼 ID로 이름 가져오기
    const getPlatformName = (platformId: number | null) => {
        if (!platformId) return null;
        const platform = platforms.find(p => p.id === platformId);
        return platform ? platform.name : `플랫폼 #${platformId}`;
    };
    
    // 이미지 로드 에러 처리
    const handleImageError = (id: number) => {
        setImgErrors(prev => ({ ...prev, [id]: true }));
    };
    
    // 썸네일 URL 생성 함수
    const getThumbnailUrl = (item: Media): string | null => {
        let filepath = item.thumbnail_path || item.filepath;
        if(!filepath) return null;

        const idx = filepath.indexOf('downloads/');
        if (idx >= 0) {
            filepath = filepath.substring(idx);
        }

        if(filepath.startsWith('downloads/')) {
            filepath = filepath.replace("downloads/", "");
        }

        const safePath = encodePath(filepath);

        return `${API_BASE_URL}/api/file/${safePath}`
    };

    const getFileUrl = (item: Media): string | null => {
        if(!item.filepath) return null;
        const rel = item.filepath.replace("downloads/", "");
        const safePath = encodePath(rel);
        return `${API_BASE_URL}/api/file/${safePath}`;
    };

    return {
        imgErrors,
        handleImageError,
        getPlatformName,
        getThumbnailUrl,
        getFileUrl
    }
};