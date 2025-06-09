// src/features/media/components/MediaContentDisplay.tsx
import React from 'react';
import type { Media } from '../../../api/types'; // types.ts 경로에 따라 조정
import type { UseMediaGridReturn } from '../hooks/useMediaGrid'; // useMediaGrid 경로에 따라 조정
import VideoPlayer from '../../../shared/components/VideoPlayer'; // VideoPlayer 경로에 따라 조정

interface MediaContentDisplayProps {
    data: Media;
    getThumbnailUrl: UseMediaGridReturn['getThumbnailUrl'];
    getFileUrl: UseMediaGridReturn['getFileUrl'];
}

const VideoExtensions = /\.(mp4|webm|ogg)$/i; // 비디오 확장자 정규식

const MediaContentDisplay: React.FC<MediaContentDisplayProps> = ({
    data,
    getThumbnailUrl,
    getFileUrl,
}) => {
    const isVideo = VideoExtensions.test(data.filepath || ""); // 비디오 여부 체크
    const videoUrl = isVideo ? getFileUrl(data) : null; // 동영상 파일 URL
    const posterUrl = getThumbnailUrl(data); // 썸네일 URL (포스터로 사용)

    return (
        <div className="mb-4">
            {isVideo && videoUrl ? (
                <VideoPlayer
                    url={videoUrl}
                    posterUrl={posterUrl || undefined}
                    title={data.title}
                    className="mb-6"
                />
            ) : posterUrl ? (
                <img
                    src={posterUrl}
                    alt={data.title}
                    className="w-full rounded-lg mb-6 object-contain"
                />
            ) : (
                <div className="h-64 bg-gray-200 flex items-center justify-center mb-6 rounded-lg">
                    이미지 없음
                </div>
            )}
        </div>
    );
};

export default MediaContentDisplay;