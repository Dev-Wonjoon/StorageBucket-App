// src/features/media/MediaCard.tsx
import React from "react";
import type { Media } from '../../../api/types'; //
import type { UseMediaGridReturn } from "../hooks/useMediaGrid"; // 경로 조정
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

interface MediaCardProps {
    item: Media;
    helpers: UseMediaGridReturn;
    isSelected: boolean; // 추가: 이 카드가 선택되었는지 여부
    onSelect: (mediaId: number, isSelected: boolean) => void; // 추가: 선택/해제 핸들러
}

const MediaCard: React.FC<MediaCardProps> = ({ item, helpers, isSelected, onSelect }) => {
    const navigate = useNavigate();

    const { 
        imgErrors, 
        handleImageError, 
        getPlatformName, 
        getThumbnailUrl,
    } = helpers; //

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 버블링 중단
        console.log('Download clicked:', item);
        // 실제 다운로드 로직 추가
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 버블링 중단
        console.log('Delete clicked:', item);
        // 실제 삭제 로직 추가
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Shift 키를 누른 채 클릭하면 선택/해제
        if (e.shiftKey) {
            e.preventDefault(); // 기본 링크 이동 방지
            onSelect(item.id, !isSelected);
        } else {
            // Shift 키를 누르지 않았다면 상세 페이지로 이동
            navigate(`/media/${item.id}`);
        }
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-shadow duration-300 flex flex-col relative
                        ${isSelected ? 'ring-4 ring-blue-500' : 'hover:shadow-lg'}`}
            onClick={handleCardClick} // 카드 클릭 이벤트 처리
        >
            {/* 선택 체크박스 (우측 상단) */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation(); // 체크박스 클릭이 카드 클릭으로 전파되지 않도록 방지
                    onSelect(item.id, e.target.checked);
                }}
                className="absolute top-2 right-2 z-10 w-5 h-5 cursor-pointer accent-blue-500"
            />

            <div className="relative pb-[75%] overflow-hidden bg-gray-200 dark:bg-gray-700 group">
                {getThumbnailUrl(item) && !imgErrors[item.id] ? (
                    <img 
                        src={getThumbnailUrl(item)!}
                        alt={item.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={() => handleImageError(item.id)}
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
                            <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">이미지 없음</span>
                        </div>
                    </div>
                )}
                {/* 오버레이 버튼은 선택 모드일 때는 비활성화되거나 숨겨지는 것이 좋습니다. */}
                {!isSelected && ( // 선택 모드일 때만 보이도록 변경
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                            <button
                                onClick={handleDownload}
                                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-2 min-h-[2.5rem]">
                    {item.title}
                </h3>
                <div className="mt-auto">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                        {item.platform_id && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                {getPlatformName(item.platform_id)}
                            </span>
                        )}
                        {item.tags && item.tags.map(tag => (
                            <span 
                                key={tag.id} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaCard;