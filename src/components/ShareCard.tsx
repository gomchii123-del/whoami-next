'use client';

import { useRef, useState } from 'react';

interface ShareCardProps {
    lifePath: number;
    title: string;
    name: string;
    keywords: string[];
}

export default function ShareCard({ lifePath, title, name, keywords }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);

    const displayNumber = lifePath >= 100 ? lifePath - 89 : lifePath;

    const handleSaveImage = async () => {
        if (!cardRef.current || saving) return;
        setSaving(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `whoami-lifepath-${displayNumber}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (e) {
            console.error('Image save failed:', e);
        }
        setSaving(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText('https://whoami-test.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = 'https://whoami-test.com';
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-4">
            {/* Share card visual */}
            <div
                ref={cardRef}
                className="rounded-2xl overflow-hidden p-8 text-center space-y-4 relative"
                style={{
                    background: 'linear-gradient(135deg, #2D2D2D 0%, #1a1a2e 50%, #16213e 100%)',
                }}
            >
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] opacity-30"
                        style={{ background: '#88A096' }} />
                </div>

                <div className="relative z-10 space-y-4">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: '#88A096' }}>
                        WHOAMI · Soul Blueprint
                    </p>

                    <div className="text-5xl font-serif font-bold text-white leading-none">
                        {displayNumber}
                    </div>

                    <h3 className="text-lg font-serif text-white/90 leading-relaxed">
                        &ldquo;{title}&rdquo;
                    </h3>

                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {keywords.map((kw, i) => (
                            <span key={i} className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(136,160,150,0.2)', color: '#88A096' }}>
                                #{kw}
                            </span>
                        ))}
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-2">
                        <div className="h-px flex-1 max-w-[60px]" style={{ background: 'rgba(136,160,150,0.3)' }} />
                        <span className="text-xs font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            whoami-test.com
                        </span>
                        <div className="h-px flex-1 max-w-[60px]" style={{ background: 'rgba(136,160,150,0.3)' }} />
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleSaveImage}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
                    style={{ background: 'rgba(136,160,150,0.12)', color: '#88A096', border: '1px solid rgba(136,160,150,0.25)' }}
                >
                    📸 {saving ? '저장 중...' : '이미지 저장'}
                </button>
                <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97]"
                    style={{ background: 'rgba(136,160,150,0.12)', color: '#88A096', border: '1px solid rgba(136,160,150,0.25)' }}
                >
                    {copied ? '✅ 복사됨!' : '🔗 링크 복사'}
                </button>
            </div>
        </div>
    );
}
