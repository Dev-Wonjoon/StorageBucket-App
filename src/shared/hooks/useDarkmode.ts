import { useState, useEffect } from "react";

export function useDarkmode() {
    const [ isDark, setIsDark ] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        console.log('[useDarkmode] useEffect 실행, isDark:', isDark);
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return [isDark, setIsDark] as const;
}