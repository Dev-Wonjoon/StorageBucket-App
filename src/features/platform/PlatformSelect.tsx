import { useNavigate } from "react-router-dom";
import type { Platform } from "../../api/types";

interface Props {
    platforms?: Platform[];
    loading: boolean;
    error: string | null;
    placeholder?: string;
    className?: string;
}

const PlatformSelect: React.FC<Props> = ({
    platforms = [],
    loading,
    error,
    placeholder = '플랫폼 선택',
    className = '',
}) => {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '') {
            navigate('/media');
        } else {
            navigate(`/media/platform/${encodeURIComponent(value)}`);
        }
    };

    if (loading) {
        return (
            <select disabled className="opacity-50 cursor-not-allowed">
                <option>플랫폼 로딩 중...</option>
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

    const safePlatforms = Array.isArray(platforms) ? platforms : [];

    return (
        <select
            onChange={handleChange}
            defaultValue=""
            className={[
                'border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400',
                'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
                className
            ].join(' ')}
        >
            <option value="">{placeholder}</option>
            {safePlatforms.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
            ))}
        </select>
    );
};

export default PlatformSelect; 