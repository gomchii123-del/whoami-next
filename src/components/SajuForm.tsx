'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, User, Info } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

export default function SajuForm() {
    const router = useRouter();
    const t = useT();
    const [loading, setLoading] = useState(false);
    // 12시진 간지 정의 (子~亥)
    const SIJIN_OPTIONS = [
        { idx: 0, branch: '子', korean: '자시', range: '23:00~01:00', hour: 0 },
        { idx: 1, branch: '丑', korean: '축시', range: '01:00~03:00', hour: 2 },
        { idx: 2, branch: '寅', korean: '인시', range: '03:00~05:00', hour: 4 },
        { idx: 3, branch: '卯', korean: '묘시', range: '05:00~07:00', hour: 6 },
        { idx: 4, branch: '辰', korean: '진시', range: '07:00~09:00', hour: 8 },
        { idx: 5, branch: '巳', korean: '사시', range: '09:00~11:00', hour: 10 },
        { idx: 6, branch: '午', korean: '오시', range: '11:00~13:00', hour: 12 },
        { idx: 7, branch: '未', korean: '미시', range: '13:00~15:00', hour: 14 },
        { idx: 8, branch: '申', korean: '신시', range: '15:00~17:00', hour: 16 },
        { idx: 9, branch: '酉', korean: '유시', range: '17:00~19:00', hour: 18 },
        { idx: 10, branch: '戌', korean: '술시', range: '19:00~21:00', hour: 20 },
        { idx: 11, branch: '亥', korean: '해시', range: '21:00~23:00', hour: 22 },
    ];

    const [formData, setFormData] = useState({
        name: '',
        gender: 'male' as 'male' | 'female',
        year: '',
        month: '',
        day: '',
        siJin: '0',  // 시진 인덱스 (0=子~11=亥)
        calendarType: 'solar' as 'solar' | 'lunar',
        isLeap: false
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
            sessionStorage.removeItem('arche_analysis_p2');
            sessionStorage.setItem('arche_report_type', 'saju');

            // 간지 단위 직접 전달 — 시간 변환 없음
            const sajuData = {
                name: formData.name,
                gender: formData.gender,
                year: parseInt(formData.year),
                month: parseInt(formData.month),
                day: parseInt(formData.day),
                branchIndex: parseInt(formData.siJin),  // 시진 인덱스 (0=子 ~ 11=亥)
                isLunar: formData.calendarType === 'lunar',
                isLeap: formData.isLeap
            };

            sessionStorage.setItem('arche_saju_data', JSON.stringify(sajuData));
            // For now, reuse the result page but we'll need to update ResultClient to handle saju
            window.location.href = '/result/?type=saju';
        } catch (err) {
            console.error(err);
            alert(t('common.error'));
            setLoading(false);
        }
    };

    const inputBase = [
        'w-full bg-gray-50 border-2 border-gray-100 rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans text-foreground placeholder-gray-500',
        'focus:border-[#B88A6A] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,106,0.1)]',
    ].join(' ');

    const toggleBase = "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2";

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-sage/5 border border-gray-100 w-full max-w-2xl">
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-4xl text-foreground font-serif">사주 팔자 분석</h2>
                    <p className="text-gray-600 text-[17px] font-sans leading-relaxed">타고난 명운과 대운의 흐름을 분석합니다.</p>
                </div>

                <div className="space-y-6">
                    {/* Name & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-foreground ml-1 block">{t('common.name')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input type="text" required placeholder={t('common.namePlaceholder')} className={`${inputBase} pl-12 pr-4`}
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-foreground ml-1 block">성별 (대운 결정 요소)</label>
                            <div className="flex bg-gray-50 p-1 rounded-xl border-2 border-gray-100">
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={`${toggleBase} ${formData.gender === 'male' ? 'bg-[#B88A6A] text-white shadow-sm' : 'text-gray-600'}`}>
                                    {t('common.male')} (乾)
                                </button>
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={`${toggleBase} ${formData.gender === 'female' ? 'bg-[#B88A6A] text-white shadow-sm' : 'text-gray-600'}`}>
                                    {t('common.female')} (坤)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Type */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-foreground ml-1 block">{t('common.calendar')}</label>
                        <div className="flex bg-gray-50 p-1 rounded-xl border-2 border-gray-100">
                            <button type="button" onClick={() => setFormData({ ...formData, calendarType: 'solar' })}
                                className={`${toggleBase} ${formData.calendarType === 'solar' ? 'bg-sage text-white shadow-sm' : 'text-gray-600'}`}>
                                {t('common.solar')}
                            </button>
                            <button type="button" onClick={() => setFormData({ ...formData, calendarType: 'lunar' })}
                                className={`${toggleBase} ${formData.calendarType === 'lunar' ? 'bg-sage text-white shadow-sm' : 'text-gray-600'}`}>
                                {t('common.lunar')}
                            </button>
                        </div>
                        {formData.calendarType === 'lunar' && (
                            <label className="flex items-center gap-2 mt-2 ml-1 cursor-pointer">
                                <input type="checkbox" checked={formData.isLeap} onChange={(e) => setFormData({ ...formData, isLeap: e.target.checked })} className="w-4 h-4 accent-sage" />
                                <span className="text-sm text-gray-600">{t('common.leapMonth')}</span>
                            </label>
                        )}
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-foreground ml-1 block">{t('common.birthDate')}</label>
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

                    {/* Birth Time — 12시진 간지 스크롤 선택 */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-foreground ml-1 block">태어난 시진 (時辰)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                            <select
                                className={`${inputBase} pl-12 pr-4 appearance-none`}
                                value={formData.siJin}
                                onChange={(e) => setFormData({ ...formData, siJin: e.target.value })}
                            >
                                {SIJIN_OPTIONS.map((sj) => (
                                    <option key={sj.idx} value={sj.idx}>
                                        {sj.branch}時 ({sj.korean}) · {sj.range}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 ml-1">모르시면 子時(자시)를 선택하세요</p>
                    </div>
                </div>

                {/* CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#B88A6A] text-white font-bold rounded-2xl shadow-lg shadow-sage/20 hover:bg-[#A67A5A] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[18px] active:scale-[0.98] min-h-[56px] px-6 mt-4"
                >
                    {loading ? (
                        <span className="animate-pulse">{t('saju.submitLoading')}</span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>{t('saju.submitBtn')}</span>
                        </>
                    )}
                </button>

                <p className="flex items-center gap-2 justify-center text-xs text-gray-500 font-sans">
                    <Info className="w-3 h-3" /> {t('saju.timeNote')}
                </p>
            </div>
        </form>
    );
}
