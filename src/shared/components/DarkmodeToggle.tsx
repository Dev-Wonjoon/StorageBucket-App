import React from 'react';
import { useDarkmode } from '../hooks/useDarkmode';

const DarkmodeToggle: React.FC = () => {
    const [isDark, setIsDark] = useDarkmode();

    return (
        <button
            onClick={() => setIsDark(prev => !prev)}
            className='p-2 rounded bg-gray-200 dark:bg-gray-700 text-xl'
            aria-label='Toggle Dark Mode'>
                {isDark ? '🌙' : '☀️'}
            </button>
    );
};

export default DarkmodeToggle;