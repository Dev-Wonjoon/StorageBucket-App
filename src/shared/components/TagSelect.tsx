// src/shared/components/TagSelect.tsx
import React from 'react';
import type { Tag } from '../../api/types';

export interface Option<V> {
    value: V;
    label: string;
}

export interface TagSelectProps { // Renamed from DropdownProps
    tags: Tag[]; // Changed to tags for clarity
    selectedTagIds: number[];
    onChange: (tagIds: number[]) => void; // Corrected to number[]
    loading?: boolean;
    error?: string | null;
    placeholder?: string;
    className?: string;
}

export function TagSelect({ // Renamed from Dropdown
    tags,
    selectedTagIds,
    onChange,
    loading = false,
    error = null,
    placeholder = '태그 선택',
    className = '',
}: TagSelectProps) { // Used TagSelectProps
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      multiple // Allow multiple selections
      value={selectedTagIds.map(String)} // Convert numbers to strings for select value
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
}

export default TagSelect;