import React, { useState, useEffect } from "react";
import type { Media, Tag } from '../../../api/types';
import { addTagsToMedia, removeTagsFromMedia } from "../../../api/client";
import TagSelect from "../../../shared/components/TagSelect";


interface MediaTagManagerProps {
    media: Media;
    allTags: Tag[];
    refreshMediaDetail: () => void;
    tagsLoading: boolean;
}


const MediaTagManager: React.FC<MediaTagManagerProps> = ({
    media,
    allTags,
    refreshMediaDetail,
    tagsLoading
}) => {
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [selectedForEdit, setSelectedTagsForEdit] = useState<number[]>([]);
    const [tagUpdateMessage, setTagUpdateMessage] = useState<string | null>(null);

    useEffect(() => {
        if(media && media.tags) {
            setSelectedTagsForEdit(media.tags.map(tag => tag.id));
        }
    }, [media]);

    const handleAddRemoveTags = async () => {
        setTagUpdateMessage(null);

        const currentTagIds = new Set(media.tags.map(tag => tag.id));
        const newTagIds = new Set(selectedForEdit);

        const tagsToAdd = selectedForEdit.filter(tagId => !currentTagIds.has(tagId));
        const tagsToRemove = media.tags.filter(tag => !newTagIds.has(tag.id)).map(tag => tag.id);

        try{
            const tagNamesToAdd = tagsToAdd.map(tagId => {
                const tag = allTags.find(t => t.id === tagId);
                return tag ? tag.name : '';
            }).filter(name => name !== '');

            if (tagNamesToAdd.length > 0) {
                await addTagsToMedia({ media_id: media.id, tag_names: tagNamesToAdd});
            }

            if (tagsToRemove.length > 0) {
                await removeTagsFromMedia({ media_id: media.id, tag_ids: tagsToRemove });
            }
            setTagUpdateMessage("태그가 성공적으로 업데이트 되었습니다.");
            refreshMediaDetail();
            setIsEditingTags(false);
        } catch (error: any) {
            setTagUpdateMessage(`태그 업데이트: ${error.message || '알 수 없는 오류'}`);
        }
    };

    if (tagsLoading) {
        return <div className="text-gray-500 dark:text-gray-400">태그 로딩 중...</div>;
    }

    return (
        <div className="mt-4">
            <h3 className="font-semibold text-md mb-2">태그:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {media.tags && media.tags.length > 0 ? (
                    media.tags.map(tag => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                        >
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">태그 없음</span>
                )}
            </div>

            <button
                onClick={() => setIsEditingTags(prev => !prev)}
                className="text-blue-500 hover:underline text-sm mb-2"
            >
                {isEditingTags ? '태그 편집 취소' : '태그 편집'}
            </button>

            {isEditingTags && (
                <div className="mt-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <TagSelect
                        tags={allTags}
                        selectedTagIds={selectedForEdit}
                        onChange={setSelectedTagsForEdit}
                        placeholder="태그 선택..."
                        className="w-full mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleAddRemoveTags}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            적용
                        </button>
                        <button
                            onClick={() => setIsEditingTags(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            취소
                        </button>
                    </div>
                    {tagUpdateMessage && (
                        <p className="mt-2 text-sm text-center text-green-600 dark:text-green-400">
                            {tagUpdateMessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}


export default MediaTagManager; 