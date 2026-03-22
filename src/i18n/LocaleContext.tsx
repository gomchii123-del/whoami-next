'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ko from './locales/ko.json';
import en from './locales/en.json';

export type Locale = 'ko' | 'en';

const dictionaries: Record<Locale, Record<string, any>> = { ko, en };

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
    locale: 'ko',
    setLocale: () => { },
    t: (key: string) => key,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('ko');

    // Load saved locale from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('whoami_locale') as Locale | null;
        if (saved && (saved === 'ko' || saved === 'en')) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('whoami_locale', newLocale);
    }, []);

    // Translation function: access nested keys like "home.heroTitle1"
    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let value: any = dictionaries[locale];
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback: try Korean, then return key
                let fallback: any = dictionaries['ko'];
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in fallback) {
                        fallback = fallback[fk];
                    } else {
                        return key; // key itself as fallback
                    }
                }
                return typeof fallback === 'string' ? fallback : key;
            }
        }
        return typeof value === 'string' ? value : key;
    }, [locale]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}

export function useT() {
    const { t } = useContext(LocaleContext);
    return t;
}
