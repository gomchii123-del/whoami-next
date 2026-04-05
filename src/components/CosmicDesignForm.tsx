'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, User, MapPin, Info } from 'lucide-react';

export default function CosmicDesignForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male' as 'male' | 'female',
        year: '',
        month: '',
        day: '',
        hour: '0',
        minute: '0',
        birthPlace: '대한민국 서울'
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            sessionStorage.setItem('arche_report_type', 'cosmic_design');

            const data = {
                type: 'cosmic_design',
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

            sessionStorage.setItem('lastAnalysis', JSON.stringify(data));
            window.location.href = '/analyze/cosmic-design/result';
        } catch (err) {
            console.error(err);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            setLoading(false);
        }
    };

    const inputBase = [
        'w-full bg-slate-900 border border-violet-500/30 rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans text-cyan-50 placeholder-slate-500',
        'focus:border-cyan-400 focus:bg-slate-800 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    ].join(' ');

    const toggleBase = "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2";

    return (
        <form onSubmit={handleSubmit} className="bg-[#0B0A15]/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-cyan-900/20 border border-violet-500/20 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">HD × Numerology</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl text-cyan-50 font-serif font-bold">코스믹 디자인 프롬프트</h2>
                    <p className="text-violet-200/70 text-[15px] font-sans leading-relaxed">
                        휴먼디자인 바디그래프와 수비학 생명경로수를 결합한 궁극의 소명 분석 AI 프롬프트를 생성합니다.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-cyan-200 ml-1 block">이름</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 pointer-events-none" />
                                <input type="text" required placeholder="이름을 입력하세요" className={`${inputBase} pl-12 pr-4`}
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[14px] font-bold text-cyan-200 ml-1 block">성별</label>
                            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-violet-500/20">
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'male' })}
                                    className={`${toggleBase} ${formData.gender === 'male' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/50' : 'text-slate-400 hover:text-cyan-200'}`}>
                                    남성
                                </button>
                                <button type="button" onClick={() => setFormData({ ...formData, gender: 'female' })}
                                    className={`${toggleBase} ${formData.gender === 'female' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/50' : 'text-slate-400 hover:text-cyan-200'}`}>
                                    여성
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-cyan-200 ml-1 block">태어난 곳 (출생지)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 pointer-events-none" />
                            <input type="text" required placeholder="예: 대한민국 서울" className={`${inputBase} pl-12 pr-4`}
                                value={formData.birthPlace} onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[14px] font-bold text-cyan-200 ml-1 block">생년월일</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50 pointer-events-none" />
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
                        <label className="text-[14px] font-bold text-cyan-200 ml-1 block">태어난 시간 (정확할수록 좋습니다)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50 pointer-events-none" />
                                <select className={`${inputBase} pl-12 pr-4 appearance-none`}
                                    value={formData.hour} onChange={(e) => setFormData({ ...formData, hour: e.target.value })}>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <option key={i} value={i} className="bg-slate-900">{i}시 (HH)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative">
                                <select className={`${inputBase} px-4 appearance-none text-center`}
                                    value={formData.minute} onChange={(e) => setFormData({ ...formData, minute: e.target.value })}>
                                    {Array.from({ length: 60 }).map((_, i) => (
                                        <option key={i} value={i} className="bg-slate-900">{i}분 (MM)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-cyan-900/30 hover:from-cyan-500 hover:to-violet-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[18px] active:scale-[0.98] min-h-[60px] px-6 mt-4 border border-cyan-400/30"
                >
                    {loading ? (
                        <span className="animate-pulse flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"/>
                            우주 좌표 동기화 중...
                        </span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>통합 분석 프롬프트 열기</span>
                        </>
                    )}
                </button>

                <p className="flex items-center gap-2 justify-center text-[11px] text-violet-300/50 font-sans">
                    <Info className="w-3 h-3" /> 휴먼디자인은 태어난 시간에 따라 구조가 크게 달라집니다. 가급적 정확한 시간을 입력해주세요.
                </p>
            </div>
        </form>
    );
}
