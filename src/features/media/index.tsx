import React, { useEffect, useRef, useState } from "react";
import MediaGrid from "./MediaGrid";
import { useMediaList } from "./useMediaList";
import { usePlatform } from "../platform/usePlatform";
import PlatformSelect from "../platform/PlatformSelect";


const MediaPage: React.FC = () => {
    const { items, hasMore, loading, error, loadNext, refresh } = useMediaList();
    const { platforms, loading: platformsLoading } = usePlatform();
    const sentinelRef = useRef<HTMLDivElement | null >(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');

    useEffect(() => {
        if(!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting && !loading) {
                    loadNext();
                }
            }, { rootMargin: "20px" }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadNext]);

    // 실제 검색 기능 구현 필요
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('검색어:', searchTerm);
        console.log('선택된 플랫폼:', selectedPlatform);
        // TODO: 검색 구현
    };

    const filteredItems = items;

    if(loading && items.length === 0) {
        return <div className="max-w-6xl mx-auto p-6 text-center text-xl dark:text-white mt-20">미디어 로딩 중...</div>;
    }

    if(error) {
        return (
            <div className="max-w-6xl mx-auto p-6 mt-20 text-center">
                <h1 className="text-2xl text-red-500 mb-4">에러: {error}</h1>
                <button
                    onClick={refresh}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* 헤더 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">미디어 라이브러리</h1>
                
                {/* 검색 폼 */}
                <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            검색어
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="미디어 제목 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    
                    <div className="md:w-1/3">
                        <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            플랫폼
                        </label>
                        <PlatformSelect
                            platforms={platforms}
                            loading={platformsLoading}
                            error={null}
                            placeholder="모든 플랫폼"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
                    >
                        검색
                    </button>
                </form>
            </div>
            
            {/* 미디어 그리드 */}
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {filteredItems.length > 0
                            ? `미디어 목록 (${filteredItems.length})`
                            : '미디어 없음'}
                    </h2>
                    
                    <button
                        onClick={refresh}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        새로고침
                    </button>
                </div>
                
                <MediaGrid items={filteredItems} className="mb-4" />

                {loading && (
                    <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                        추가 미디어 로딩 중...
                    </div>
                )}

                {!hasMore && items.length > 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        모든 미디어를 불러왔습니다.
                    </div>
                )}
                <div ref={sentinelRef} />
            </div>
        </div>
    );
};

export default MediaPage;