import { useParams, Navigate } from "react-router-dom";
import { useMediaDetail } from "./useMediaDetail";
import { useMediaGrid } from "./useMediaGrid";
import VideoPlayer from "../../shared/components/VideoPlayer";

const VideoExtensions = /\.(mp4|webm|ogg)$/i;

export default function MediaDetailPage() {
  const params = useParams<{ mediaId: string }>();
  const id = Number(params.mediaId);
  if (isNaN(id)) {
    return <Navigate to="/media/list" replace />;
  }

  const { data, loading, error } = useMediaDetail(id);
  const { getPlatformName, getThumbnailUrl, getFileUrl } = useMediaGrid();

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">오류: {error}</div>;
  }
  if (!data) {
    return <div className="p-4">미디어를 찾을 수 없습니다.</div>;
  }

  // 비디오 여부 체크
  const isVideo = VideoExtensions.test(data.filepath || "");
  // ReactPlayer가 쓸 URL (썸네일 URL의 "thumbnails/" 부분을 실제 파일 경로로 치환)
  const playerUrl = isVideo
    ? getThumbnailUrl(data)!.replace("/thumbnails/", "/")
    : undefined;
  // poster로 쓸 썸네일 URL
  const posterUrl = getThumbnailUrl(data);
  const videoUrl = isVideo ? getFileUrl(data) : null;

  return (
    <div className="max-w-3xl mx-auto p-4 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <hr className="border-t border-gray-600 dark:border-gray-300 my-4"/>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="font-semibold text-md">플랫폼</dt>
        <dd className="text-md">{getPlatformName(data.platform_id) || "알 수 없음"}</dd>
        <dt className="font-semibold text-md">생성일</dt><dd className="text-md">{new Date(data.created_at).toLocaleString()}</dd>
      </dl>
      <hr className="border-t border-gray-600 dark:border-gray-300 my-4"/>

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
    </div>
  );
}
