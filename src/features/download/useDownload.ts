import { useState } from 'react';
import { post } from '../../shared/utils/apiClient';

export function useDownload() {
    const [url, setUrl] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState<string | null>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!url.trim()) {
            setMessage('URL을 입력해주세요.');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await post<{detail?: string}>('/api/download', { url });
            setMessage('다운로드 요청이 전송되었습니다.');
            setUrl('');
        } catch (error: any) {
            setMessage(`${error.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        url,
        setUrl,
        loading,
        message,
        handleSubmit,
    };
}

