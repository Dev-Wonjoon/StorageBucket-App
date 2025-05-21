import React from 'react';
import DownloadForm from './DownloadForm';
import { useDownload } from './useDownload';

const DownloadPage: React.FC = () => {
    const { url, setUrl, loading, message, handleSubmit } = useDownload();

    return (
        <div className='items-center'>
            <h1 className='text-center text-gray-600 font-semibold text-5xl pt-26 dark:text-white'>Storage Bucket</h1>
            <DownloadForm
                url={url}
                onChange={setUrl}
                onSubmit={handleSubmit}
                loading={loading}
                message={message}
            />
        </div>
    );

};

export default DownloadPage;