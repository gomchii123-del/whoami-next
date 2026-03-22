'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/i18n/LocaleContext';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLocale();
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('whoami-theme');
        let isDark = false;
        if (saved === 'dark') isDark = true;
        else if (!saved && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) isDark = true;
        setDark(isDark);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, []);

    const toggleLang = () => {
        setLocale(locale === 'ko' ? 'en' : 'ko');
    };

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        localStorage.setItem('whoami-theme', next ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
        window.dispatchEvent(new CustomEvent('whoami-theme-change', { detail: next ? 'dark' : 'light' }));
    };

    return (
        <div className="fixed top-3 right-3 z-[100] flex items-center gap-2">
            {/* 테마 토글 */}
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110"
                style={{
                    background: dark ? 'rgba(20,28,43,0.9)' : 'rgba(255,255,255,0.9)',
                    border: `1px solid ${dark ? 'rgba(201,169,110,0.3)' : 'rgba(0,0,0,0.08)'}`,
                }}
                aria-label="Toggle theme"
            >
                {dark ? (
                    <span className="text-sm" style={{ color: '#C9A96E' }}>☀️</span>
                ) : (
                    <span className="text-sm" style={{ color: '#88A096' }}>🌙</span>
                )}
            </button>

            {/* 언어 토글 */}
            <button
                onClick={toggleLang}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md shadow-lg transition-all text-sm font-bold tracking-wide"
                style={{
                    background: dark ? 'rgba(20,28,43,0.9)' : 'rgba(255,255,255,0.9)',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    color: dark ? '#F0F0F0' : '#1A1A1A',
                }}
                aria-label="언어 전환 / Language Toggle"
            >
                <span className={`text-base transition-opacity ${locale === 'ko' ? 'opacity-100' : 'opacity-40'}`}>
                    KR
                </span>
                <span style={{ color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}>|</span>
                <span className={`text-base transition-opacity ${locale === 'en' ? 'opacity-100' : 'opacity-40'}`}>
                    US
                </span>
            </button>
        </div>
    );
}
