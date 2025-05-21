import React from "react";
import type { Media } from '../../api/types';
import { useMediaGrid } from "./useMediaGrid";
import MediaCard from "./MediaCard";
import { Link } from "react-router-dom";

interface MediaGridProps {
    items: Media[];
    className?: string;
}

const MediaGrid: React.FC<MediaGridProps> = ({
    items,
    className = '',
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
                <Link key={item.id} to={`/media/${item.id}`} className="block">
                    <MediaCard
                    key={item.id}
                    item={item}
                    helpers={helpers}
                    />
                </Link>
            ))}
        </div>
    );
};

export default MediaGrid;