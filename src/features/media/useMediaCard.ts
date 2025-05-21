import type { Media } from "../../api/types";
import type { UseMediaGridReturn } from "./useMediaGrid";

export const useMediaCard = (item: Media, helpers: UseMediaGridReturn) => {
    const handleClick = () => {
        // 미디어 상세 보기 또는 미리보기 로직
        console.log('Media clicked:', item);
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 다운로드 로직
        console.log('Download clicked:', item);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 삭제 로직
        console.log('Delete clicked:', item);
    };

    return {
        handleClick,
        handleDownload,
        handleDelete
    };
}; 