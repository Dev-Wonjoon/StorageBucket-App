import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlatformMediaList } from './usePlatformMediaList';
import MediaGrid from '../media/MediaGrid';

const PlatformDetail: React.FC = () => {
    const { platformName } = useParams<{ platformName: string }>();
    const { items: mediaList, loading, error } = usePlatformMediaList(platformName || '');

    if (!platformName) {
        return <div className="p-6 text-center">잘못된 접근입니다.</div>;
    }

    if (loading) {
        return <div className="p-6 text-center">미디어 로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                에러: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{decodeURIComponent(platformName)} 플랫폼</h1>
                <Link
                    to="/platform"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    목록으로 돌아가기
                </Link>
            </div>

            <MediaGrid items={Array.isArray(mediaList) ? mediaList : []} />
        </div>
    );
};

export default PlatformDetail; 