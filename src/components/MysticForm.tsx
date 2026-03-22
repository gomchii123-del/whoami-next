'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, User } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

export default function MysticForm({ reportType = 'summary' }: { reportType?: string }) {
    const router = useRouter();
    const t = useT();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        person1: { name: '', year: '', month: '', day: '', hour: '' },
        person2: { name: '', year: '', month: '', day: '', hour: '' }
    });
    const isCompat = reportType === 'compat';

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
            sessionStorage.removeItem('arche_saju_data');
            sessionStorage.setItem('arche_report_type', reportType);

            // Format dates
            const p1 = formData.person1;
            const p2 = formData.person2;

            const p1Data = {
                name: p1.name,
                birth_date: `${p1.year}-${p1.month.padStart(2, '0')}-${p1.day.padStart(2, '0')}`,
                year: p1.year, month: p1.month, day: p1.day
            };

            if (isCompat) {
                const p2Data = {
                    name: p2.name,
                    birth_date: `${p2.year}-${p2.month.padStart(2, '0')}-${p2.day.padStart(2, '0')}`,
                    year: p2.year, month: p2.month, day: p2.day
                };
                sessionStorage.setItem('arche_analysis', JSON.stringify(p1Data));
                sessionStorage.setItem('arche_analysis_p2', JSON.stringify(p2Data));
            } else {
                sessionStorage.setItem('arche_analysis', JSON.stringify(p1Data));
                sessionStorage.removeItem('arche_analysis_p2');
            }

            window.location.href = '/result/';
        } catch (err) {
            console.error(err);
            alert(t('common.error'));
            setLoading(false);
        }
    };

    const inputBase = [
        'w-full rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans',
    ].join(' ');

    const inputStyle = {
        background: 'var(--input-bg)',
        border: '2px solid var(--input-border)',
        color: 'var(--foreground)',
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-[2rem] p-6 md:p-10 w-full" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl md:text-4xl font-serif" style={{ color: 'var(--foreground)' }}>{t('numerology.formTitle')}</h2>
                    <p className="text-[17px] font-sans leading-relaxed" style={{ color: 'var(--text-sub)' }}>{t('numerology.formDesc')}</p>
                </div>

                {/* Person 1 */}
                <div className="space-y-5">
                    {isCompat && <h3 className="text-xl font-serif text-sage pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>{t('numerology.person1Label')}</h3>}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold ml-1 block" style={{ color: 'var(--text-sub)' }}>{isCompat ? t('numerology.person1Label') : t('common.name')}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                            <input type="text" required placeholder={t('common.namePlaceholder')} className={`${inputBase} pl-12 pr-4`} style={{...inputStyle}}
                                value={formData.person1.name} onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, name: e.target.value } })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold ml-1 block" style={{ color: 'var(--text-sub)' }}>{t('common.birthDate')}</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative col-span-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                                <input type="number" required placeholder={t('common.year')} min="1900" max="2099" className={`${inputBase} pl-9 pr-2 text-center`} style={{...inputStyle}}
                                    value={formData.person1.year} onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, year: e.target.value } })} />
                            </div>
                            <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-4 text-center`} style={{...inputStyle}}
                                value={formData.person1.month} onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, month: e.target.value } })} />
                            <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-4 text-center`} style={{...inputStyle}}
                                value={formData.person1.day} onChange={(e) => setFormData({ ...formData, person1: { ...formData.person1, day: e.target.value } })} />
                        </div>
                    </div>
                </div>

                {/* Person 2 (Compat Only) */}
                {isCompat && (
                    <div className="space-y-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <h3 className="text-xl font-serif text-peach pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>{t('numerology.person2Title')}</h3>
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold ml-1 block" style={{ color: 'var(--text-sub)' }}>{t('numerology.person2Label')}</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                                <input type="text" required placeholder={t('common.namePlaceholder')} className={`${inputBase} pl-12 pr-4`} style={{...inputStyle}}
                                    value={formData.person2.name} onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, name: e.target.value } })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold ml-1 block" style={{ color: 'var(--text-sub)' }}>생년월일</label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="relative col-span-1">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                                    <input type="number" required placeholder="년" min="1900" max="2099" className={`${inputBase} pl-9 pr-2 text-center`} style={{...inputStyle}}
                                        value={formData.person2.year} onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, year: e.target.value } })} />
                                </div>
                                <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-4 text-center`} style={{...inputStyle}}
                                    value={formData.person2.month} onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, month: e.target.value } })} />
                                <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-4 text-center`} style={{...inputStyle}}
                                    value={formData.person2.day} onChange={(e) => setFormData({ ...formData, person2: { ...formData.person2, day: e.target.value } })} />
                            </div>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sage text-white font-bold rounded-2xl shadow-lg shadow-sage/20 hover:bg-sage/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[18px] active:scale-[0.98] min-h-[56px] px-6"
                >
                    {loading ? (
                        <span className="animate-pulse">{t('numerology.submitLoading')}</span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>{t('numerology.submitBtn')}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
