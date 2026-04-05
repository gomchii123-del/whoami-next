'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Calendar, Clock, User } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

export default function OmniversePage() {
    const t = useT();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '00',
        gender: 'male',
        isLunar: false,
    });
    
    // Check if time is unknown
    const [unknownTime, setUnknownTime] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            sessionStorage.removeItem('arche_saju_data');
            sessionStorage.setItem('arche_report_type', 'omniverse');

            const dataToSave = {
                name: formData.name,
                birth_date: `${formData.year}-${String(formData.month).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`,
                year: formData.year,
                month: formData.month,
                day: formData.day,
                hour: unknownTime ? '12' : formData.hour,
                minute: unknownTime ? '00' : formData.minute,
                gender: formData.gender,
                isLunar: formData.isLunar,
                timeUnknown: unknownTime
            };

            sessionStorage.setItem('arche_analysis', JSON.stringify(dataToSave));
            
            // Go to custom omniverse result loading page
            window.location.href = '/result/omniverse/';
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
        'focus:border-purple-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(216,180,254,0.3)]',
    ].join(' ');

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-5 md:p-16 overflow-hidden" style={{ background: '#0f0c29', backgroundSize: 'cover', backgroundImage: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)' }}>
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-2xl space-y-8 py-8 md:py-14 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-sans text-sm font-semibold group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    돌아가기
                </Link>

                <div className="text-center space-y-4">
                    <span className="inline-block text-amber-300 font-bold tracking-widest text-xs uppercase bg-amber-300/10 border border-amber-300/20 px-4 py-2 rounded-full">
                        Ultimate Prompt Engineering
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif text-white leading-[1.2] drop-shadow-md">
                        우주의 흐름을 담아낸 <br />
                        당신만의 마스터 프롬프트
                    </h1>
                    <p className="text-base text-gray-300 font-sans leading-relaxed max-w-md mx-auto">
                        동양의 명리학, 자미두수별, 그리고 서양의 점성술 별자리까지<br />
                        모든 지혜를 하나로 모아 당신만의 절대적 통찰을 찾아냅니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-2xl border border-white/20 w-full">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-gray-200 ml-1 block">이름</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input type="text" required placeholder="이름을 입력하세요" className={`${inputBase} pl-12 pr-4 bg-white/60 text-gray-900 border-none placeholder-gray-500`}
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-gray-200 ml-1 block">생년월일</label>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="relative col-span-2">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <input type="number" required placeholder="년도 (예: 1995)" min="1900" max="2099" className={`${inputBase} pl-9 pr-2 text-center bg-white/60 text-gray-900 border-none placeholder-gray-500`}
                                        value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <input type="number" required placeholder="월" min="1" max="12" className={`${inputBase} px-2 text-center bg-white/60 text-gray-900 border-none placeholder-gray-500`}
                                    value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} />
                                <input type="number" required placeholder="일" min="1" max="31" className={`${inputBase} px-2 text-center bg-white/60 text-gray-900 border-none placeholder-gray-500`}
                                    value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-3 mt-2 px-1">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                                    <input type="radio" checked={formData.gender === 'male'} onChange={() => setFormData({ ...formData, gender: 'male' })} className="accent-purple-400" /> 남자
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                                    <input type="radio" checked={formData.gender === 'female'} onChange={() => setFormData({ ...formData, gender: 'female' })} className="accent-purple-400" /> 여자
                                </label>
                                <div className="w-px h-3 bg-gray-500 mx-2" />
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                                    <input type="checkbox" checked={formData.isLunar} onChange={(e) => setFormData({ ...formData, isLunar: e.target.checked })} className="accent-purple-400 rounded-sm" /> 음력
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[15px] font-bold text-gray-200 ml-1 block">태어난 시간 (정확한 분석을 위해 필수)</label>
                            <div className="grid grid-cols-2 gap-3 relative">
                                <div className="relative">
                                    <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${unknownTime ? 'opacity-50' : ''}`} />
                                    <input type="number" required={!unknownTime} disabled={unknownTime} placeholder="시 (0~23)" min="0" max="23" className={`${inputBase} pl-9 pr-2 text-center bg-white/60 text-gray-900 border-none placeholder-gray-500 disabled:opacity-50 disabled:bg-gray-200`}
                                        value={formData.hour} onChange={(e) => setFormData({ ...formData, hour: e.target.value })} />
                                </div>
                                <input type="number" required={!unknownTime} disabled={unknownTime} placeholder="분 (0~59)" min="0" max="59" className={`${inputBase} px-4 text-center bg-white/60 text-gray-900 border-none placeholder-gray-500 disabled:opacity-50 disabled:bg-gray-200`}
                                    value={formData.minute} onChange={(e) => setFormData({ ...formData, minute: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2 mt-2 px-1">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-amber-300/80 hover:text-amber-300 transition-colors">
                                    <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="accent-amber-500 rounded-sm" /> 
                                    시간을 모릅니다 (오차 발생 가능성 있음)
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full mt-4 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-[18px] active:scale-[0.98] min-h-[60px] px-6 text-indigo-950 disabled:opacity-50 outline-none"
                            style={{ background: 'linear-gradient(to right, #f6d365 0%, #fda085 100%)' }}>
                            {loading ? <span className="animate-pulse">분석 준비 중...</span> : <><Sparkles className="w-5 h-5 shrink-0" /> 별의 파동 읽기</>}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
