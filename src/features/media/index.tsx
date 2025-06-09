// src/features/media/index.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import MediaGrid from "./MediaGrid";
import { useMediaList } from "./hooks/useMediaList"; // 경로 조정
import { usePlatform } from "../platform/usePlatform"; // 경로 조정
import PlatformSelect from "../platform/PlatformSelect"; // 경로 조정
import TagSelect from "../../shared/components/TagSelect"; // 경로 조정
import { useTags } from "../tags/useTags"; // 경로 조정
import { addTagsToMedia, removeTagsFromMedia } from '../../api/client'; // 클라이언트 API
import type { Tag } from '../../api/types'; // 타입 정의

const MediaPage: React.FC = () => {
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const { items, hasMore, loading, error, loadNext, refresh } = useMediaList(30);

    const { platforms, loading: platformsLoading } = usePlatform();
    const { tags: allTags, loading: tagsLoading, refreshTags } = useTags();
    const sentinelRef = useRef<HTMLDivElement | null >(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');

    // --- 미디어 선택 상태 관리 ---
    const [selectedMediaIds, setSelectedMediaIds] = useState<Set<number>>(new Set());
    const [isBulkTagging, setIsBulkTagging] = useState(false);
    const [bulkTagsToAdd, setBulkTagsToAdd] = useState<number[]>([]);
    const [bulkTagsToRemove, setBulkTagsToRemove] = useState<number[]>([]);
    const [bulkTagMessage, setBulkTagMessage] = useState<string | null>(null);

    const handleSelectMedia = useCallback((mediaId: number, isSelected: boolean) => {
        setSelectedMediaIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(mediaId);
            } else {
                newSet.delete(mediaId);
            }
            return newSet;
        });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedMediaIds(new Set());
        setIsBulkTagging(false);
        setBulkTagsToAdd([]);
        setBulkTagsToRemove([]);
        setBulkTagMessage(null);
    }, []);

    const handleApplyBulkTags = async () => {
        setBulkTagMessage(null);
        if (selectedMediaIds.size === 0) {
            setBulkTagMessage("선택된 미디어가 없습니다.");
            return;
        }

        try {
            const mediaIdsArray = Array.from(selectedMediaIds);
            const tagsToAddNames = bulkTagsToAdd.map(tagId => allTags.find(t => t.id === tagId)?.name).filter(Boolean) as string[];
            const tagsToRemoveIds = bulkTagsToRemove;

            await Promise.all(mediaIdsArray.map(async (mediaId) => {
                if (tagsToAddNames.length > 0) {
                    await addTagsToMedia({ media_id: mediaId, tag_names: tagsToAddNames });
                }
                if (tagsToRemoveIds.length > 0) {
                    await removeTagsFromMedia({ media_id: mediaId, tag_ids: tagsToRemoveIds });
                }
            }));

            setBulkTagMessage("태그가 성공적으로 일괄 업데이트되었습니다.");
            handleClearSelection(); // 선택 해제
            refresh(); // 미디어 목록 새로고침
        } catch (err: any) {
            setBulkTagMessage(`태그 일괄 업데이트 실패: ${err.message || '알 수 없는 오류'}`);
        }
    };

    // --- 기존 로직 ---
    useEffect(() => {
        if(!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting && !loading && hasMore) {
                    loadNext();
                }
            }, { rootMargin: "20px" }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadNext]);

    useEffect(() => {
        refresh();
    }, [selectedTagIds, refresh]);

    const handlePlatformChange = (value: string) => {
        setSelectedPlatform(value);
        // 라우팅 대신 필터링을 직접 하려면 useMediaList에 selectedPlatform을 전달해야 합니다.
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('검색어:', searchTerm);
        console.log('선택된 플랫폼:', selectedPlatform);
        console.log('선택된 태그 ID:', selectedTagIds);
        refresh(); // 현재 검색/필터 상태로 새로고침
    };

    const filteredItems = items;

    if((loading && items.length === 0) || platformsLoading || tagsLoading) {
        return <div className="max-w-6xl mx-auto p-6 text-center text-xl dark:text-white mt-20">로딩 중...</div>;
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">미디어 라이브러리</h1>
                
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
                    
                    <div className="md:w-1/4">
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

                    <div className="md:w-1/4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            태그
                        </label>
                        <TagSelect
                            tags={allTags}
                            selectedTagIds={selectedTagIds}
                            onChange={setSelectedTagIds}
                            loading={tagsLoading}
                            error={null}
                            placeholder="태그 선택"
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
                
                <MediaGrid
                    items={filteredItems}
                    className="mb-4"
                    selectedMediaIds={selectedMediaIds}
                    onSelectMedia={handleSelectMedia}
                />

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

            {/* --- 일괄 태그 관리 UI (Google 포토 스타일) --- */}
            {selectedMediaIds.size > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white p-4 rounded-lg shadow-xl flex items-center space-x-4 z-50">
                    <span className="text-lg font-semibold">
                        {selectedMediaIds.size}개 선택됨
                    </span>
                    <button
                        onClick={() => setIsBulkTagging(true)}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                        태그 관리
                    </button>
                    <button
                        onClick={handleClearSelection}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        선택 해제
                    </button>
                </div>
            )}

            {isBulkTagging && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            선택된 미디어에 태그 적용
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                추가할 태그
                            </label>
                            <TagSelect
                                tags={allTags}
                                selectedTagIds={bulkTagsToAdd}
                                onChange={setBulkTagsToAdd}
                                loading={tagsLoading}
                                error={null}
                                placeholder="추가할 태그 선택"
                                className="w-full"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                제거할 태그
                            </label>
                            <TagSelect
                                tags={allTags}
                                selectedTagIds={bulkTagsToRemove}
                                onChange={setBulkTagsToRemove}
                                loading={tagsLoading}
                                error={null}
                                placeholder="제거할 태그 선택"
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleApplyBulkTags}
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
                            >
                                적용
                            </button>
                            <button
                                onClick={() => setIsBulkTagging(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
                            >
                                취소
                            </button>
                        </div>
                        {bulkTagMessage && (
                            <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-200">
                                {bulkTagMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaPage;