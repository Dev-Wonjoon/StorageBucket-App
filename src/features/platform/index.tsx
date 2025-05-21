import React, { useState } from 'react';
import PlatformList from './PlatformList';
import { usePlatform } from './usePlatform';
import { createPlatform, deletePlatform } from '../../api/client';

const PlatformPage: React.FC = () => {
    const { platforms, loading, error, refresh } = usePlatform();
    const [isCreating, setIsCreating] = useState(false);
    const [newPlatformName, setNewPlatformName] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [platformToDelete, setPlatformToDelete] = useState<string | null>(null);

    const handleCreatePlatform = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlatformName.trim()) return;

        try {
            setCreateError(null);
            await createPlatform(newPlatformName.trim());
            setIsCreating(false);
            setNewPlatformName('');
            refresh();
        } catch (error: any) {
            setCreateError(error.message || '플랫폼 생성 실패');
        }
    };

    const handleDeleteClick = (platformName: string) => {
        setPlatformToDelete(platformName);
        setIsDeleting(true);
    };

    const handleDeleteConfirm = async () => {
        if (!platformToDelete) return;

        try {
            setDeleteError(null);
            await deletePlatform(platformToDelete);
            setPlatformToDelete(null);
            setIsDeleting(false);
            refresh();
        } catch (error: any) {
            setDeleteError(error.message || '플랫폼 삭제 실패');
        }
    };

    const handleDeleteCancel = () => {
        setPlatformToDelete(null);
        setIsDeleting(false);
        setDeleteError(null);
    };

    return (
        <div className="max-w-5xl w-full text-gray-600 dark:text-white mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">플랫폼 관리</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    새 플랫폼 추가
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreatePlatform} className="mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPlatformName}
                                onChange={(e) => setNewPlatformName(e.target.value)}
                                placeholder="플랫폼 이름을 입력하세요"
                                className="flex-1 border rounded px-4 py-3 text-base"
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 text-base"
                            >
                                생성
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setCreateError(null);
                                }}
                                className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 text-base"
                            >
                                취소
                            </button>
                        </div>
                        {createError && (
                            <div className="text-red-500 text-sm mt-2">{createError}</div>
                        )}
                    </div>
                </form>
            )}

            {isDeleting && platformToDelete && (
                <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="mb-4 text-lg">
                        <strong>"{platformToDelete}"</strong> 플랫폼을 삭제하시겠습니까?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 text-base"
                        >
                            삭제
                        </button>
                        <button
                            onClick={handleDeleteCancel}
                            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 text-base"
                        >
                            취소
                        </button>
                    </div>
                    {deleteError && (
                        <div className="mt-3 text-red-500 text-base">{deleteError}</div>
                    )}
                </div>
            )}

            <PlatformList
                platforms={platforms}
                loading={loading}
                error={error}
                onRefresh={refresh}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default PlatformPage;
