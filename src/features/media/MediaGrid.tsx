// src/features/media/MediaGrid.tsx
import React from "react";
import type { Media } from '../../api/types';
import { useMediaGrid } from "./hooks/useMediaGrid"; // 경로 조정
import MediaCard from "./MediaCard";

interface MediaGridProps {
    items: Media[];
    className?: string;
    selectedMediaIds: Set<number>; // 추가: 선택된 미디어 ID 집합
    onSelectMedia: (mediaId: number, isSelected: boolean) => void; // 추가: 미디어 선택/해제 핸들러
}

const MediaGrid: React.FC<MediaGridProps> = ({
    items,
    className = '',
    selectedMediaIds,
    onSelectMedia,
}) => {
    const helpers = useMediaGrid();

    if (items.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                미디어가 없습니다.
            </div>
        );
    }

    return (
        <div className={[
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4',
            className,
        ].join(' ')}
        >
            {items.map((item) => (
                <MediaCard
                    key={item.id}
                    item={item}
                    helpers={helpers}
                    isSelected={selectedMediaIds.has(item.id)} // 선택 상태 전달
                    onSelect={onSelectMedia} // 선택 핸들러 전달
                />
            ))}
        </div>
    );
};

export default MediaGrid;