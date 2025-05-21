import React from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";


export interface VideoPlayerProps {
    url: string;
    posterUrl?: string;
    aspectRatio?: number;
    className?: string;
    title?: string;
    subtitle?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    url,
    posterUrl,
    aspectRatio = 56.25,
    className = "",
    title,
    subtitle
}: VideoPlayerProps) => {
    const paddingTop = `${aspectRatio}%`;
    return (
        <motion.div
      className={[
        "relative overflow-hidden rounded-xl",
        "shadow-lg hover:shadow-2xl transition-shadow duration-300",
        className,
      ].join(" ")}
      whileHover={{ scale: 1.02 }}
      onClick={(e) => {
        // 클릭 시 ReactPlayer가 재생 포커스를 잡을 수 있도록 방해하지 않습니다.
        e.stopPropagation();
      }}
    >
      {/* 썸네일 + 플레이 버튼 오버레이 */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0
                   hover:opacity-100 transition-opacity duration-200 cursor-pointer z-20"
        onClick={() => {
          /* 포스터 클릭 시 재생 시작을 위해 ReactPlayer 내부 버튼을 트리거하거나,
             컨트롤 직접 호출 로직을 넣을 수도 있습니다. */
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* optional title/subtitle overlay */}
      {(title || subtitle) && (
        <div className="absolute top-4 left-4 z-30 text-white">
          {title && <h3 className="text-lg font-semibold drop-shadow-md">{title}</h3>}
          {subtitle && <p className="text-sm drop-shadow-sm">{subtitle}</p>}
        </div>
      )}

      {/* 16:9 비율 유지 */}
      <div className="w-full" style={{ paddingTop }}>
        <ReactPlayer
          url={url}
          light={posterUrl}
          controls
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </motion.div>
    )
}

export default VideoPlayer;