import React from 'react';


interface DownloadFormProps {
    url: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    message: string | null;
}

const DownloadForm: React.FC<DownloadFormProps> = ({
    url,
    onChange,
    onSubmit,
    loading,
    message,
}) => (
    <div className='max-w-2xl w-full p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg mt-20 mx-auto'>
        <h2 className='text-3xl text-gray-600 dark:text-white font-semibold mb-6 text-center'>다운로드</h2>
        <form onSubmit={onSubmit} className='space-y-6'>
            <input
                type="url"
                value={url}
                onChange={e => onChange(e.target.value)}
                placeholder='다운로드할 URL을 입력하세요'
                className='w-full bg-gray-100 dark:bg-gray-600 dark:text-white h-14 rounded-md text-center text-lg'
                required
            />
            <button
                type='submit'
                disabled={loading}
                className="w-full bg-blue-500 text-white font-medium rounded-md px-6 py-3 text-lg hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? '요청 중...' : '다운로드'}
            </button>
        </form>
        {message && (
            <p className='mt-6 text-center text-gray-700 dark:text-gray-200 text-lg whitespace-pre-wrap'>
                {message}
            </p>
        )}
    </div>
);

export default DownloadForm;