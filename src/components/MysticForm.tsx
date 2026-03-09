'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, User } from 'lucide-react';

export default function MysticForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        year: '',
        month: '',
        day: '',
        hour: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.success) {
                router.push(`/result/${result.recordId}`);
            }
        } catch (err) {
            console.error(err);
            alert('분석에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    // Shared input base class — font-size >= 16px prevents iOS auto-zoom
    const inputBase = [
        'w-full bg-gray-50 border-2 border-gray-100 rounded-xl',
        'py-[14px] outline-none transition-all duration-200',
        'text-[17px] font-sans text-foreground placeholder-gray-400',
        'focus:border-sage focus:bg-white focus:shadow-[0_0_0_3px_rgba(120,150,110,0.15)]',
    ].join(' ');

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-sage/5 border border-gray-100 w-full">
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-4xl text-foreground font-serif">당신의 본질 찾기</h2>
                    <p className="text-gray-500 text-[17px] font-sans leading-relaxed">탄생의 순간에 담긴 우주적 암호를 해독합니다.</p>
                </div>

                <div className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">이름</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                required
                                placeholder="성함을 입력해 주세요"
                                className={`${inputBase} pl-12 pr-4`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    {/* Birthdate */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">생년월일</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative col-span-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="number"
                                    required
                                    placeholder="년"
                                    inputMode="numeric"
                                    min="1900"
                                    max="2099"
                                    className={`${inputBase} pl-9 pr-2 text-center`}
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                            <input
                                type="number"
                                required
                                placeholder="월"
                                inputMode="numeric"
                                min="1"
                                max="12"
                                className={`${inputBase} px-4 text-center`}
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            />
                            <input
                                type="number"
                                required
                                placeholder="일"
                                inputMode="numeric"
                                min="1"
                                max="31"
                                className={`${inputBase} px-4 text-center`}
                                value={formData.day}
                                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-gray-400 ml-1">예: 1975 / 3 / 27</p>
                    </div>

                    {/* Birth Time (Optional) */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-bold text-gray-700 ml-1 block">
                            태어난 시간 <span className="font-normal text-gray-400 text-sm">(선택)</span>
                        </label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="number"
                                placeholder="0~23시 사이로 입력 (모르면 비워두세요)"
                                inputMode="numeric"
                                min="0"
                                max="23"
                                className={`${inputBase} pl-12 pr-4`}
                                value={formData.hour}
                                onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sage text-white font-bold rounded-2xl shadow-lg shadow-sage/20 hover:bg-sage/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-[18px] active:scale-[0.98] min-h-[56px] px-6"
                >
                    {loading ? (
                        <span className="animate-pulse">본질을 탐색하는 중...</span>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 shrink-0" />
                            <span>인생 리포트 확인하기</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
