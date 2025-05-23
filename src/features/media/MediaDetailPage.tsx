import React from 'react'; // React import 추가
import { useParams, Navigate } from "react-router-dom";
import { useMediaDetail } from "./useMediaDetail";
import { useMediaGrid } from "./useMediaGrid";
import { useTags } from "../tags/useTags";

// 새로 만든 컴포넌트들을 임포트합니다.
import MediaDetailHeader from './component/MediaDetailHeader'
import MediaTagManager from './component/MediaTagManager';
import MediaContentDisplay from './component/MediaContent';


export default function MediaDetailPage() {
  const params = useParams<{ mediaId: string }>();
  const id = Number(params.mediaId);
  if (isNaN(id)) {
    return <Navigate to="/media/list" replace />;
  }

  const { data, loading, error, refreshMediaDetail } = useMediaDetail(id);
  const { getPlatformName, getThumbnailUrl, getFileUrl } = useMediaGrid();
  const { tags: allTags, loading: tagsLoading } = useTags();


  if (loading || tagsLoading) {
    return <div className="p-4">로딩 중...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">오류: {error}</div>;
  }
  if (!data) {
    return <div className="p-4">미디어를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 dark:text-white">
      {/* MediaDetailHeader 컴포넌트로 분리 */}
      <MediaDetailHeader data={data} getPlatformName={getPlatformName} />

      {/* MediaTagManager 컴포넌트로 분리 */}
      <MediaTagManager
        media={data}
        allTags={allTags}
        refreshMediaDetail={refreshMediaDetail}
        tagsLoading={tagsLoading}
      />

      <hr className="border-t border-gray-600 dark:border-gray-300 my-4"/>

      {/* MediaContentDisplay 컴포넌트로 분리 */}
      <MediaContentDisplay
        data={data}
        getThumbnailUrl={getThumbnailUrl}
        getFileUrl={getFileUrl}
      />
    </div>
  );
}