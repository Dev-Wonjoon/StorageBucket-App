import React from 'react';

export interface Option<V> {
    value: V;
    label: string;
}

export interface DropdownProps<V> {
    options: Option<V>[];
    value: V;
    onChange: (value: V) => void;
    loading?: boolean;
    error?: string | null;
    placeholder?: string;
    className?: string;
}

export function Dropdown<V extends string | number>({
    options,
    value,
    onChange,
    loading = false,
    error = null,
    placeholder = 'Select...',
    className = '',
}: DropdownProps<V>) {
    if(loading) {
        return <span className='text-gray-500'>로딩 중...</span>;
    }
    if(error) {
        return <span className='text-red-500'>에러: {error}</span>;
    }

    return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as V)}
      className={[
        'border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400',
        'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
        className
      ].join(' ')}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}