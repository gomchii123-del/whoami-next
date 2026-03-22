'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TarotCard, shuffleAndDraw } from '@/lib/tarot-engine';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useT } from '@/i18n/LocaleContext';

export default function TarotForm() {
    const router = useRouter();
    const t = useT();
    const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
    const [step, setStep] = useState<'intro' | 'picking' | 'done'>('intro');
    const [question, setQuestion] = useState('');
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);

    useEffect(() => {
        if (step === 'picking') {
            const fullDeck = shuffleAndDraw(78); // Shuffle all 78 cards
            setShuffledDeck(fullDeck);
            setSelectedIndices([]);
        }
    }, [step]);

    const handleStart = () => {
        if (!question.trim()) {
            alert(t('tarot.alertQuestion'));
            return;
        }
        setStep('picking');
    };

    const toggleCardSelection = (index: number) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            if (selectedIndices.length < 3) {
                setSelectedIndices([...selectedIndices, index]);
            }
        }
    };

    const handleConfirmSelection = () => {
        if (selectedIndices.length !== 3) return;
        const cards = selectedIndices.map(idx => shuffledDeck[idx]);

        // Streamline: Directly analyze and navigate to result
        const tarotData = {
            type: 'tarot',
            question,
            cards: cards,
            timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('lastAnalysis', JSON.stringify(tarotData));
        sessionStorage.setItem('arche_report_type', 'tarot');
        window.location.href = '/result/?type=tarot';
    };

    const handleAnalyze = () => {
        const tarotData = {
            type: 'tarot',
            question,
            cards: selectedCards,
            timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('arche_report_type', 'tarot');
        sessionStorage.setItem('lastAnalysis', JSON.stringify(tarotData));
        window.location.href = '/result/?type=tarot';
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === 'intro' && (
                <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40 space-y-6 text-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">{t('tarot.questionLabel')}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        현재의 고민이나 알고 싶은 미래에 대해 구체적으로 생각하며<br />
                        질문을 입력해 주세요. 마음을 가다듬는 과정이 중요합니다.
                    </p>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t('tarot.questionPlaceholder')}
                        className="w-full h-32 p-4 rounded-2xl border-2 border-purple-100 focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none bg-white/50 text-gray-700"
                    />
                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-purple-500 text-white rounded-2xl font-bold text-lg hover:bg-purple-600 active:scale-[0.98] transition-all shadow-lg shadow-purple-200"
                    >
                        {t('tarot.startReading')}
                    </button>
                </div>
            )}

            {step === 'picking' && (
                <div className="text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">{t('tarot.pickCards')}</h2>
                        <p className="text-purple-500 font-medium">선택된 카드: {selectedIndices.length} / 3</p>
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 max-w-5xl mx-auto px-4 pb-32">
                        {shuffledDeck.map((_, idx) => {
                            const isSelected = selectedIndices.includes(idx);
                            const selectionOrder = selectedIndices.indexOf(idx) + 1;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => toggleCardSelection(idx)}
                                    className={`
                                        relative w-full aspect-[2/3] rounded-md sm:rounded-lg cursor-pointer transition-all duration-300
                                        ${isSelected ? '-translate-y-3 ring-2 sm:ring-4 ring-purple-400 shadow-2xl z-10 scale-110' : 'hover:-translate-y-1 shadow-sm hover:shadow-md'}
                                        bg-gradient-to-br from-purple-800 to-indigo-950 border border-white/20
                                    `}
                                >
                                    <div className="absolute inset-0.5 sm:inset-1 border border-white/10 rounded sm:rounded-md flex items-center justify-center">
                                        <div className="text-white/10 text-xs sm:text-lg font-serif">🜔</div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-6 sm:h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-[8px] sm:text-xs font-bold shadow-lg border border-white animate-in zoom-in">
                                            {selectionOrder}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
                        <button
                            onClick={handleConfirmSelection}
                            disabled={selectedIndices.length !== 3}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl
                                ${selectedIndices.length === 3
                                    ? 'bg-gray-900 text-white hover:bg-black active:scale-[0.98]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            {selectedIndices.length === 3 ? t('tarot.confirmCards') : t('tarot.pickCards')}
                        </button>
                    </div>
                </div>
            )}

            {step === 'done' && (
                <div className="max-w-2xl mx-auto space-y-10 text-center animate-in zoom-in-95 duration-500">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">당신의 선택이 마감되었습니다</h2>
                        <p className="text-purple-500 font-medium">진심을 담은 분석 준비가 완료되었습니다</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        {selectedCards.map((card, idx) => (
                            <div key={card.id} className="w-28 h-40 sm:w-32 sm:h-48 bg-white rounded-xl shadow-lg border-2 border-purple-50 overflow-hidden flex flex-col items-center justify-center p-2">
                                <div className="text-2xl mb-1 text-purple-200">🜔</div>
                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">CARD {idx + 1}</div>
                                <div className="text-xs font-serif font-bold text-purple-600 mt-2 text-center line-clamp-2 px-1 leading-tight">{card.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 items-center">
                        <button
                            onClick={handleAnalyze}
                            className="w-full max-w-xs py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black active:scale-[0.98] transition-all shadow-xl"
                        >
                            {t('tarot.generateBtn')}
                        </button>
                        <button
                            onClick={() => setStep('picking')}
                            className="text-sm text-gray-400 hover:text-purple-500 transition-colors"
                        >
                            다시 뽑기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
