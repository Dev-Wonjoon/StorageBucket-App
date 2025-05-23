import React from 'react';
import type { Tag } from '../../api/types';

interface TagSelectProps {
    tags: Tag[];
    selectedTagIds: number[];
    // 여기를 수정합니다: Number[] -> number[]
    onChange: (tagIds: number[]) => void; 
    loading?: boolean;
    error?: string | null;
    placeholder?: string;
    className?: string;
}

const TagSelect: React.FC<TagSelectProps> = ({
    tags,
    selectedTagIds,
    onChange,
    loading = false,
    error = null,
    placeholder = '모든 태그',
    className = '',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Number() 생성자가 아닌, Number 전역 함수를 사용하면 primitive number를 반환합니다.
        // 하지만 타입 선언이 잘못되었기 때문에 오류가 발생한 것입니다.
        const value = Array.from(e.target.selectedOptions, option => Number(option.value));
        onChange(value);
    };

    if (loading) {
        return (
            <select disabled className="opacity-50 cursor-not-allowed">
                <option>태그 로딩 중...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select disabled className="text-red-500 cursor-not-allowed">
                <option>로드 실패: {error}</option>
            </select>
        );
    }

    return (
        <select
            multiple
            value={selectedTagIds.map(String)} 
            onChange={handleChange}
            className={[
                'border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400',
                'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
                className
            ].join(' ')}
        >
            <option value="">{placeholder}</option>
            {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                    {tag.name}
                </option>
            ))}
        </select>
    );
};

export default TagSelect;