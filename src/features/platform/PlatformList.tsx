import React from 'react';
import { Link } from 'react-router-dom';
import type { Platform } from '../../api/types';


interface Props {
    platforms: Platform[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onDelete?: (platformName: string) => void;
}

const PlatformList: React.FC<Props> = ({
    platforms,
    loading,
    error,
    onRefresh,
    onDelete
}) => {
    if (loading) {
        return <div className='p-6 text-center'>플랫폼 로딩 중...</div>
    }
    if (error) {
        return (
            <div className='p-6 text-center text-red-500'>
                에러: {error}
                <button onClick={onRefresh} className='ml-2 text-blue-500 hover:underline'>다시 시도</button>
            </div>
        );
    }

    if(platforms.length === 0) {
        return <div className='p-6 text-center'>등록된 플랫폼이 없습니다.</div>
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th scope="col" className="w-2/3 px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            플랫폼 이름
                        </th>
                        <th scope="col" className="w-1/3 px-8 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            관리
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {platforms.map((p) => (
                        <tr key={p.name}>
                            <td className="px-8 py-5 whitespace-nowrap text-base">
                                <Link
                                    to={`/platforms/${encodeURIComponent(p.name)}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {p.name}
                                </Link>
                            </td>
                            <td className="px-8 py-5 whitespace-nowrap text-right">
                                <button
                                    onClick={() => onDelete && onDelete(p.name)}
                                    className="text-red-600 hover:text-red-900 bg-transparent px-4 py-2 rounded border border-red-200 dark:border-red-800"
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlatformList;