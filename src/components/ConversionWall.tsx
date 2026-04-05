'use client';

import { useState } from 'react';
import { Lock, Check, Crown, Sparkles, Star, TrendingUp, Heart, Calendar } from 'lucide-react';
import {
    type Product,
    type AnalysisType,
    ALL_PRODUCTS,
    PRODUCT_YEARLY,
    PRODUCT_WEALTH,
    PRODUCT_CONCEPT,
    PRODUCT_VIP,
    formatPrice,
} from '@/lib/products';
import PaymentButton from './PaymentButton';

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface ConversionWallProps {
    analysisType?: AnalysisType;
    onUnlock: (productId: string) => void;
    userName?: string;
    recordId?: string;
}

// ─────────────────────────────────────────────
// 카테고리 아이콘 매핑
// ─────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, any> = {
    yearly: <Calendar className="w-5 h-5" />,
    wealth: <TrendingUp className="w-5 h-5" />,
    concept: <Heart className="w-5 h-5" />,
    vip: <Crown className="w-5 h-5" />,
};

// ─────────────────────────────────────────────
// 상품 카드
// ─────────────────────────────────────────────

function ProductCard({
    product,
    isSelected,
    onClick,
}: {
    product: Product;
    isSelected: boolean;
    onClick: () => void;
}) {
    const isVIP = product.category === 'vip';

    return (
        <button
            onClick={onClick}
            className="relative w-full rounded-2xl text-left transition-all duration-300"
            style={{
                padding: isVIP ? '1.5rem 1.25rem' : '1.25rem',
                background: isSelected
                    ? `linear-gradient(135deg, ${product.color}15, ${product.color}08)`
                    : 'rgba(255,255,255,0.6)',
                border: isSelected
                    ? `2px solid ${product.color}60`
                    : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isSelected
                    ? `0 8px 32px ${product.color}15`
                    : 'none',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            {/* Badge */}
            {product.badge && (
                <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black tracking-wider text-white"
                    style={{ background: product.color }}
                >
                    {product.badge}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-2 mt-1">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${product.color}15`, color: product.color }}
                    >
                        {product.icon}
                    </div>
                    <div>
                        <p className="font-bold text-[14px] text-gray-900">{product.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{product.tagline}</p>
                    </div>
                </div>
                <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all"
                    style={{
                        borderColor: isSelected ? product.color : '#D1D5DB',
                        background: isSelected ? product.color : 'transparent',
                    }}
                >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
            </div>

            {/* Features (compact) */}
            <div className="mt-3 space-y-1">
                {product.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <Check className="w-3 h-3 mt-0.5 shrink-0" style={{ color: product.color }} />
                        <span className="text-[11px] text-gray-500 leading-snug">{feat}</span>
                    </div>
                ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                    <>
                        <span className="text-sm text-gray-300 line-through">{formatPrice(product.originalPrice)}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${product.color}15`, color: product.color }}>
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                    </>
                )}
            </div>
        </button>
    );
}

// ─────────────────────────────────────────────
// ConversionWall
// ─────────────────────────────────────────────

export default function ConversionWall({
    analysisType,
    onUnlock,
    userName = '',
    recordId = '',
}: ConversionWallProps) {
    const [selectedId, setSelectedId] = useState(PRODUCT_VIP.id);
    const selectedProduct = ALL_PRODUCTS.find(p => p.id === selectedId) || PRODUCT_VIP;

    return (
        <div className="relative">
            {/* ── Stage 1: Gradient Blur Overlay ── */}
            <div
                className="absolute -top-48 left-0 right-0 h-48 pointer-events-none z-10"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, var(--bg-color, #F9F9F6) 100%)',
                }}
            />

            {/* ── Stage 2: Conversion Content ── */}
            <div className="relative z-20 pt-2">
                {/* Headline */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#6C5CE7]/20 to-[#D4AF37]/20 flex items-center justify-center mb-5">
                        <Lock className="w-7 h-7" style={{ color: '#6C5CE7' }} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-snug">
                        심층 분석 결과가<br />준비되었습니다
                    </h2>
                    <p className="text-gray-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                        아래 프리미엄 리포트를 선택하면<br />숨겨진 운세를 상세히 확인할 수 있습니다
                    </p>
                </div>

                {/* Product Cards — 2열 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto px-2">
                    {ALL_PRODUCTS.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isSelected={selectedId === product.id}
                            onClick={() => setSelectedId(product.id)}
                        />
                    ))}
                </div>

                {/* Social Proof */}
                <div className="flex items-center justify-center gap-2 mb-5 text-gray-400">
                    <div className="flex -space-x-1.5">
                        {['🧑', '👩', '🧑‍🦱', '👨', '👩‍🦰'].map((e, i) => (
                            <span key={i} className="text-sm">{e}</span>
                        ))}
                    </div>
                    <span className="text-xs">
                        지금까지 <strong className="text-[#6C5CE7]">2,847명</strong>이 프리미엄 리포트를 열람했습니다
                    </span>
                </div>

                {/* ── Stage 3: Payment ── */}
                <div className="max-w-md mx-auto px-4">
                    <PaymentButton
                        recordId={recordId}
                        userName={userName}
                        product={selectedProduct}
                        onUnlock={() => onUnlock(selectedId)}
                    />
                </div>

                {/* Value Anchor */}
                <div className="text-center mt-6 mb-4">
                    <p className="text-xs text-gray-300 italic">
                        ☕ 커피 한 잔 값으로 운명의 흐름을 읽으세요
                    </p>
                </div>

                {/* Free vs Premium */}
                <div className="mt-6 max-w-md mx-auto px-4">
                    <div className="bg-white/70 rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-2 text-center">
                            <div className="py-3 border-r border-b border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">무료</span>
                            </div>
                            <div className="py-3 border-b border-gray-100 bg-[#6C5CE7]/5">
                                <span className="text-[10px] font-bold text-[#6C5CE7] uppercase tracking-wider">프리미엄</span>
                            </div>
                        </div>
                        {[
                            ['기본 성향 요약 1줄', '심층 해설 전문 (2000자+)'],
                            ['차트·명반 이미지만', '차트 + 완전 해석 + 조언'],
                            ['—', '월별 운세 + 전환점 분석'],
                            ['—', '직업·재물·연애 심층 분석'],
                            ['—', 'PDF 리포트 다운로드'],
                        ].map(([free, prem], i) => (
                            <div key={i} className="grid grid-cols-2 text-center">
                                <div className="py-2.5 border-r border-b border-gray-50 text-[11px] text-gray-400">
                                    {free}
                                </div>
                                <div className="py-2.5 border-b border-gray-50 text-[11px] text-gray-600 font-medium bg-[#6C5CE7]/5">
                                    {prem}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
