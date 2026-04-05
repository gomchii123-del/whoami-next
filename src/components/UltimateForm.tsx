'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, User, MapPin, Info } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

export default function UltimateForm() {
    const router = useRouter();
    const t = useT();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male' as 'male' | 'female',
        year: '',
        month: '',
        day: '',
        hour: '0',
        minute: '0',
        birthPlace: ''
    });

    // Auto-fill from sessionStorage if available
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('arche_analysis');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.year && parsed.month && parsed.day) {
                    setFormData(prev => ({
                        ...prev,
                        year: String(parsed.year),
                        month: String(parsed.month),
                        day: String(parsed.day)
                    }));
                }
            }
        } catch {}
    }, []);

    // Reset loading when page is restored from bfcache (back button)
    useEffect(() => {
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) setLoading(false);
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            sessionStorage.setItem('arche_report_type', 'astrology');

            const ultimateData = {
                type: 'ultimate',
                name: formData.name,
                gender: formData.gender,
                year: parseInt(formData.year),
                month: parseInt(formData.month),
                day: parseInt(formData.day),
                hour: parseInt(formData.hour),
                minute: parseInt(formData.minute),
                birthPlace: formData.birthPlace,
                timestamp: new Date().toISOString()
            };

            sessionStorage.setItem('ultimate_data', JSON.stringify(ultimateData));
            router.push('/analyze/ultimate/result');
        } catch (err) {
            console.error(err);
            alert(t('common.error'));
            setLoading(false);
        }
    };

    const inputBase = [
        'w-full bg-gray-50 border-2 border-gray-100 rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans text-foreground placeholder-gray-400',
        'focus:border-[#A07868] focus:bg-white focus:shadow-[0_0_0_3px_rgba(160,120,104,0.1)]',
    ].join(' ');

    const toggleBase = "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2";

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-sage/5 border border-gray-100 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-4xl text-foreground font-serif">얼티밋 프롬프트</h2>
                    <p className="text-gray-500 text-[17px] font-sans leading-relaxed">5대 시스템 통합 마스터 엔진</p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.name')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input type="text" required placeholder={t('common.namePlaceholder')} className={`${inputBase} pl-12 pr-4`}
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.gender')}</label>
                            <div className="flex bg-gray-50 p-1 rounded-xl border-2 border-gray-100">
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={`${toggleBase} ${formData.gender === 'male' ? 'bg-[#A07868] text-white shadow-sm' : 'text-gray-400'}`}>
                                    {t('common.male')}
                                </button>
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={`${toggleBase} ${formData.gender === 'female' ? 'bg-[#A07868] text-white shadow-sm' : 'text-gray-400'}`}>
                                    {t('common.female')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('astrology.birthPlace')}</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input type="text" required placeholder="태어난 도시 (예: 서울)" className={`${inputBase} pl-12 pr-4`}
                                value={formData.birthPlace} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.birthDate')}</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input type="number" required placeholder="년" min="1900" max="2100" className={`${inputBase} pl-9 pr-2 text-center`}
                                    value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                            </div>
                            <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-4 text-center`}
                                value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                            <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-4 text-center`}
                                value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">{t('common.birthTime')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select className={`${inputBase} pl-12 pr-4 appearance-none`}
                                    value={formData.hour} onChange={(e) => setFormData({ ...formData, hour: e.target.value })}>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <option key={i} value={i}>{i}시</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative">
                                <select className={`${inputBase} px-4 appearance-none text-center`}
                                    value={formData.minute} onChange={(e) => setFormData({ ...formData, minute: e.target.value })}>
                                    {Array.from({ length: 60 }).map((_, i) => (
                                        <option key={i} value={i}>{i}분</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#A07868] text-white font-bold rounded-2xl shadow-lg shadow-orange/20 hover:bg-[#8F6A5B] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[18px] active:scale-[0.98] min-h-[56px] px-6 mt-4"
                >
                    {loading ? (
                        <span className="animate-pulse">{t('astrology.submitLoading')}</span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>얼티밋 프롬프트 생성</span>
                        </>
                    )}
                </button>

                <p className="flex items-center gap-2 justify-center text-xs text-gray-400 font-sans">
                    <Info className="w-3 h-3" /> {t('astrology.timeNote')}
                </p>
            </div>
        </form>
    );
}
