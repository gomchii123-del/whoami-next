/**
 * WHOAMI — 프리미엄 상품 카탈로그 (포스텔러 스타일)
 *
 * 무료: 오늘의 운세, 기본 사주/수비학 차트 → 조건 없이 전부 공개
 * 유료: 4가지 카테고리 심층 리포트
 *
 * Firebase Functions(functions/src/index.ts) PRODUCT_PRICES와 동기화 필수.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AnalysisType = 'numerology' | 'saju' | 'tarot' | 'ziwei' | 'astrology';
export type ProductTier = 'individual' | 'bundle' | 'master';
export type ProductCategory = 'yearly' | 'wealth' | 'concept' | 'vip';

export interface Product {
    id: string;
    tier: ProductTier;
    category: ProductCategory;
    name: string;
    nameEn: string;
    tagline: string;
    description: string;
    price: number;
    originalPrice?: number;
    includes: AnalysisType[];
    features: string[];
    badge?: string;
    icon: string;
    color: string;
}

export interface FreeScope {
    analysisType: AnalysisType;
    visibleSections: string[];
    teaserRatio: number;
    blurAfter: string;
}

// ─────────────────────────────────────────────
// 1. 2026년 신년 종합 운세 (Yearly)
// ─────────────────────────────────────────────

export const PRODUCT_YEARLY: Product = {
    id: 'yearly_fortune_2026',
    tier: 'individual',
    category: 'yearly',
    name: '2026년 신년 종합 운세',
    nameEn: '2026 Yearly Fortune',
    tagline: '올 한 해의 운명 흐름을 한눈에',
    description: '2026년 월별 운세 + 대운 흐름 + 핵심 전환점 분석',
    price: 5900,
    includes: ['numerology', 'saju'],
    features: [
        '2026년 12개월 월별 상세 운세',
        '수비학 Personal Year 사이클 분석',
        '사주 세운(歲運) · 월운 해석',
        '올해의 행운 숫자·색상·방위',
        '핵심 전환점 & 주의 시기 안내',
    ],
    icon: '📅',
    color: '#6C5CE7',
};

// ─────────────────────────────────────────────
// 2. 재물 및 직업 성공 운세 (Wealth & Career)
// ─────────────────────────────────────────────

export const PRODUCT_WEALTH: Product = {
    id: 'wealth_career_fortune',
    tier: 'individual',
    category: 'wealth',
    name: '재물 & 직업 성공 운세',
    nameEn: 'Wealth & Career Fortune',
    tagline: '돈과 성공의 흐름을 읽다',
    description: '재물운 · 투자 적기 · 직업 궁합 · 승진 타이밍 종합 분석',
    price: 5900,
    includes: ['numerology', 'saju', 'ziwei'],
    features: [
        '타고난 재물 성향 & 돈 버는 패턴',
        '올해 투자·이직 적기 분석',
        '직업 궁합 TOP 5 추천',
        '사주 재성(財星) 심층 해석',
        '자미두수 재백궁(財帛宮) 분석',
    ],
    icon: '💰',
    color: '#FDCB6E',
};

// ─────────────────────────────────────────────
// 3. 특정 테마 / 컨셉 운세 (Concept)
// ─────────────────────────────────────────────

export const PRODUCT_CONCEPT: Product = {
    id: 'concept_theme_fortune',
    tier: 'bundle',
    category: 'concept',
    name: '연애 & 인간관계 운세',
    nameEn: 'Love & Relationship Fortune',
    tagline: '사랑과 관계의 숨겨진 코드',
    description: '연애 궁합 · 이상형 분석 · 인간관계 패턴 · 결혼운 종합',
    price: 5900,
    includes: ['numerology', 'tarot', 'ziwei'],
    features: [
        '타고난 연애 스타일 & 이상형 코드',
        '올해 연애운 월별 흐름',
        '타로 3장 연애 심층 리딩',
        '자미두수 부처궁(夫妻宮) 해석',
        '인간관계 갈등 패턴 & 해결 가이드',
    ],
    icon: '💕',
    color: '#E17055',
};

// ─────────────────────────────────────────────
// 4. VIP 프리미엄 종합 운세 (All-in-one)
// ─────────────────────────────────────────────

export const PRODUCT_VIP: Product = {
    id: 'vip_premium_all',
    tier: 'master',
    category: 'vip',
    name: 'VIP 프리미엄 종합 운세',
    nameEn: 'VIP Premium All-in-One',
    tagline: '당신의 운명 전체를 해독합니다',
    description: '5종 전체 심층 분석 + 신년운세 + 재물운 + 연애운 통합 리포트',
    price: 14900,
    originalPrice: 23600,
    includes: ['numerology', 'saju', 'tarot', 'ziwei', 'astrology'],
    features: [
        '위 3종 리포트 전부 포함',
        '5종 동서양 교차 분석 리포트',
        '인생 총운 그래프 (10년 바이오리듬)',
        '에너지 프로필 레이더 차트',
        'PDF 다운로드 + 이메일 발송',
    ],
    badge: 'BEST VALUE',
    icon: '👑',
    color: '#D4AF37',
};

// ─────────────────────────────────────────────
// 전체 카탈로그
// ─────────────────────────────────────────────

export const ALL_PRODUCTS: Product[] = [
    PRODUCT_YEARLY,
    PRODUCT_WEALTH,
    PRODUCT_CONCEPT,
    PRODUCT_VIP,
];

/** ID로 상품 찾기 */
export function getProductById(id: string): Product | undefined {
    return ALL_PRODUCTS.find(p => p.id === id);
}

/** 개별 분석 유형에 해당하는 상품들 */
export function getProductsForAnalysis(type: AnalysisType): Product[] {
    return ALL_PRODUCTS.filter(p => p.includes.includes(type));
}

/** 가격 포맷팅 */
export function formatPrice(price: number): string {
    return `₩${price.toLocaleString()}`;
}

// ─────────────────────────────────────────────
// 무료 범위 — 기본 결과는 전부 무료 공개
// 심층 해설만 유로
// ─────────────────────────────────────────────

export const FREE_SCOPES: FreeScope[] = [
    {
        analysisType: 'numerology',
        visibleSections: ['lifePath'],
        teaserRatio: 0.2,
        blurAfter: 'lifePath',
    },
    {
        analysisType: 'saju',
        visibleSections: ['fourPillarsChart', 'fiveElementsChart'],
        teaserRatio: 0.15,
        blurAfter: 'fiveElementsChart',
    },
    {
        analysisType: 'tarot',
        visibleSections: ['cardReveal'],
        teaserRatio: 0.2,
        blurAfter: 'cardReveal',
    },
    {
        analysisType: 'ziwei',
        visibleSections: ['chartImage'],
        teaserRatio: 0.1,
        blurAfter: 'chartImage',
    },
    {
        analysisType: 'astrology',
        visibleSections: ['natalChart', 'sunSign'],
        teaserRatio: 0.15,
        blurAfter: 'sunSign',
    },
];

export function getFreeScope(type: AnalysisType): FreeScope | undefined {
    return FREE_SCOPES.find(s => s.analysisType === type);
}

/** 서버 동기화용 가격표 */
export const PRODUCT_PRICES: Record<string, number> = Object.fromEntries(
    ALL_PRODUCTS.map(p => [p.id, p.price])
);
