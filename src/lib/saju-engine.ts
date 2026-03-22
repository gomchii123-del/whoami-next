/**
 * 사주 만세력 엔진 — @fullstackfamily/manseryeok 기반
 *
 * 한국천문연구원(KASI) 데이터 기반 정확한 만세력 계산
 * - 절기 기반 년주/월주 자동 전환 (입춘 기준)
 * - 진태양시(True Solar Time) 보정 지원
 * - 1900~2050년 지원
 */

import {
    calculateSaju as manseryeokCalculateSaju,
    calculateSajuSimple,
    lunarToSolar,
    solarToLunar,
    type SajuResult as ManseryeokSajuResult,
} from '@fullstackfamily/manseryeok';

// ─────────────────────────────────────────────
// 공개 인터페이스
// ─────────────────────────────────────────────

export interface SajuPillar {
    stem: string;       // 한글 천간 (갑, 을, ...)
    branch: string;     // 한글 지지 (자, 축, ...)
    stemHanja: string;  // 한자 천간 (甲, 乙, ...)
    branchHanja: string;// 한자 지지 (子, 丑, ...)
    stemElement: string;
    branchElement: string;
    stemYinYang: string;
    branchYinYang: string;
}

export interface Daeun {
    age: number;
    pillar: SajuPillar;
}

export interface SajuResult {
    pillars: {
        year: SajuPillar;
        month: SajuPillar;
        day: SajuPillar;
        hour: SajuPillar;
    };
    daeun: Daeun[];
    daeunAge: number;
    palPum?: {
        name: string;
        range: string;
        mission: string;
        dangRyeong: string;
    };
    /** 진태양시 보정 여부 */
    isTimeCorrected?: boolean;
    /** 보정된 시간 */
    correctedTime?: { hour: number; minute: number };
}

// ─────────────────────────────────────────────
// 내부 상수
// ─────────────────────────────────────────────

const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STEMS_KOREAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCHES_KOREAN = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const STEM_ELEMENTS: Record<string, string> = {
    '甲': '목', '乙': '목', '丙': '화', '丁': '화', '戊': '토',
    '己': '토', '庚': '금', '辛': '금', '壬': '수', '癸': '수'
};

const BRANCH_ELEMENTS: Record<string, string> = {
    '子': '수', '丑': '토', '寅': '목', '卯': '목', '辰': '토', '巳': '화',
    '午': '화', '未': '토', '申': '금', '酉': '금', '戌': '토', '亥': '수'
};

const STEM_YINYANG: Record<string, string> = {
    '甲': '양', '丙': '양', '戊': '양', '庚': '양', '壬': '양',
    '乙': '음', '丁': '음', '己': '음', '辛': '음', '癸': '음'
};

const BRANCH_YINYANG: Record<string, string> = {
    '子': '양', '寅': '양', '辰': '양', '午': '양', '申': '양', '戌': '양',
    '丑': '음', '卯': '음', '巳': '음', '未': '음', '酉': '음', '亥': '음'
};

// 시진 인덱스(0~11) → 대표 시간 (시주 계산에 사용)
const BRANCH_TO_HOUR: number[] = [
    0,   // 子時: 23:00~01:00 → 0시 (자정)
    2,   // 丑時: 01:00~03:00
    4,   // 寅時: 03:00~05:00
    6,   // 卯時: 05:00~07:00
    8,   // 辰時: 07:00~09:00
    10,  // 巳時: 09:00~11:00
    12,  // 午時: 11:00~13:00
    14,  // 未時: 13:00~15:00
    16,  // 申時: 15:00~17:00
    18,  // 酉時: 17:00~19:00
    20,  // 戌時: 19:00~21:00
    22,  // 亥時: 21:00~23:00
];

// ─────────────────────────────────────────────
// 간지 문자열 → SajuPillar 변환
// ─────────────────────────────────────────────

/**
 * 한글 간지(예: "갑자") → SajuPillar 객체
 */
function parseKoreanPillar(korean: string, hanja: string): SajuPillar {
    const stemK = korean[0];
    const branchK = korean[1];
    const stemH = hanja[0];
    const branchH = hanja[1];

    return {
        stem: stemK,
        branch: branchK,
        stemHanja: stemH,
        branchHanja: branchH,
        stemElement: STEM_ELEMENTS[stemH] || '',
        branchElement: BRANCH_ELEMENTS[branchH] || '',
        stemYinYang: STEM_YINYANG[stemH] || '',
        branchYinYang: BRANCH_YINYANG[branchH] || '',
    };
}

// ─────────────────────────────────────────────
// 대운 계산 (절기 기반)
// ─────────────────────────────────────────────

/**
 * 대운수 계산 — 3일 = 1년 환산
 */
function computeDaeunAge(solarYear: number, solarMonth: number, solarDay: number, isForward: boolean): number {
    // 간단한 절기 기반 대운수 계산
    // 절기 날짜 근사값 사용 (정확한 절기는 manseryeok 라이브러리의 getSolarTermForDate로 보완 가능)
    const JEOLGI_APPROX: [number, number][] = [
        [2, 4],   // 입춘
        [3, 6],   // 경칩
        [4, 5],   // 청명
        [5, 6],   // 입하
        [6, 6],   // 망종
        [7, 7],   // 소서
        [8, 8],   // 입추
        [9, 8],   // 백로
        [10, 8],  // 한로
        [11, 7],  // 입동
        [12, 7],  // 대설
        [1, 6],   // 소한 (다음해)
    ];

    const birthDate = new Date(solarYear, solarMonth - 1, solarDay);
    let daysDiff = 15; // 기본값

    if (isForward) {
        // 순행: 출생일 → 다음 절기까지 일수
        for (const [m, d] of JEOLGI_APPROX) {
            const jeolgiYear = m < solarMonth || (m === solarMonth && d <= solarDay) ? solarYear + 1 : solarYear;
            const jeolgiDate = new Date(jeolgiYear, m - 1, d);
            const diff = Math.floor((jeolgiDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) {
                daysDiff = diff;
                break;
            }
        }
    } else {
        // 역행: 이전 절기 → 출생일까지 일수
        for (let i = JEOLGI_APPROX.length - 1; i >= 0; i--) {
            const [m, d] = JEOLGI_APPROX[i];
            const jeolgiYear = m > solarMonth || (m === solarMonth && d > solarDay) ? solarYear - 1 : solarYear;
            const jeolgiDate = new Date(jeolgiYear, m - 1, d);
            const diff = Math.floor((birthDate.getTime() - jeolgiDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) {
                daysDiff = diff;
                break;
            }
        }
    }

    const fullYears = Math.floor(daysDiff / 3);
    const remainder = daysDiff % 3;
    return Math.max(1, remainder >= 2 ? fullYears + 1 : fullYears);
}

/**
 * 대운 목록 생성 — 월주로부터 순/역행
 */
function buildDaeunList(monthPillarHanja: string, isForward: boolean, daeunAge: number, count: number): Daeun[] {
    const monthStemIdx = STEMS_HANJA.indexOf(monthPillarHanja[0]);
    const monthBranchIdx = BRANCHES_HANJA.indexOf(monthPillarHanja[1]);
    const result: Daeun[] = [];

    for (let i = 1; i <= count; i++) {
        const direction = isForward ? i : -i;
        const stemIdx = ((monthStemIdx + direction) % 10 + 10) % 10;
        const branchIdx = ((monthBranchIdx + direction) % 12 + 12) % 12;

        const hanja = STEMS_HANJA[stemIdx] + BRANCHES_HANJA[branchIdx];
        const korean = STEMS_KOREAN[stemIdx] + BRANCHES_KOREAN[branchIdx];

        result.push({
            age: daeunAge + (i - 1) * 10,
            pillar: parseKoreanPillar(korean, hanja)
        });
    }

    return result;
}

// ─────────────────────────────────────────────
// 팔품 계산
// ─────────────────────────────────────────────

function getPalPum(solarMonth: number, solarDay: number) {
    // 절기 근사 기반 팔품 판정
    const md = solarMonth * 100 + solarDay;

    if (md >= 1207 || md < 204) {
        return { name: '자축(子丑)품', range: '동지~입춘', dangRyeong: '계수(癸水)', mission: '지식체계 확립 및 감성 체계. 내적 잉태와 기초 준비.' };
    } else if (md >= 204 && md < 321) {
        return { name: '인묘(寅卯)품', range: '입춘~춘분', dangRyeong: '갑목(甲木)', mission: '지식체계 확립 및 교육 체계. 싹이 트고 성장을 시작하는 발산.' };
    } else if (md >= 321 && md < 506) {
        return { name: '묘진(卯辰)품', range: '춘분~입하', dangRyeong: '을목(乙木)', mission: '사회체계 확립 및 정책 체계. 본격적인 확산과 실무 능력.' };
    } else if (md >= 506 && md < 621) {
        return { name: '사오(巳午)품', range: '입하~하지', dangRyeong: '병화(丙火)', mission: '사회체계 확립 및 소통 체계. 화려함이 드러나고 가치 창출.' };
    } else if (md >= 621 && md < 808) {
        return { name: '오미(午未)품', range: '하지~입추', dangRyeong: '정화(丁火)', mission: '기술체계 확립 및 기술 체계. 내실을 다지고 전문 기술 연마.' };
    } else if (md >= 808 && md < 923) {
        return { name: '신유(申酉)품', range: '입추~추분', dangRyeong: '경금(庚金)', mission: '기술체계 확립 및 생산 체계. 결실을 맺고 가치를 고도화.' };
    } else if (md >= 923 && md < 1107) {
        return { name: '유술(酉戌)품', range: '추분~입동', dangRyeong: '신금(辛金)', mission: '시장체계 확립 및 운용 체계. 상품 가치 완성 및 정밀성 발휘.' };
    } else {
        return { name: '해자(亥子)품', range: '입동~동지', dangRyeong: '임수(壬水)', mission: '시장체계 확립 및 유통 체계. 결과물 유통 및 지혜의 정제.' };
    }
}

// ─────────────────────────────────────────────
// 메인 엔진
// ─────────────────────────────────────────────

export const SajuEngine = {
    /**
     * 사주 계산 — @fullstackfamily/manseryeok 기반
     *
     * @param year  출생 년도 (양력)
     * @param month 출생 월
     * @param day   출생 일
     * @param branchIndex 시진 인덱스 (0=子 ~ 11=亥) — 유저가 간지로 직접 선택
     * @param gender 성별
     * @param isLunar 음력 여부
     * @param isLeap 윤달 여부
     */
    calculate(
        year: number,
        month: number,
        day: number,
        branchIndex: number,
        gender: 'male' | 'female',
        isLunar: boolean = false,
        isLeap: boolean = false
    ): SajuResult {
        try {
            // ═══════════════════════════════════════
            // 1. 음력 → 양력 변환 (필요시)
            // ═══════════════════════════════════════
            let solarYear = year;
            let solarMonth = month;
            let solarDay = day;

            if (isLunar) {
                const converted = lunarToSolar(year, month, day, isLeap);
                solarYear = converted.solar.year;
                solarMonth = converted.solar.month;
                solarDay = converted.solar.day;
                console.log(`SajuEngine: 음력 ${year}-${month}-${day}${isLeap ? '(윤)' : ''} → 양력 ${solarYear}-${solarMonth}-${solarDay}`);
            }

            // ═══════════════════════════════════════
            // 2. 시진(branchIndex) → 대표 시간 변환
            // ═══════════════════════════════════════
            const clampedBranch = ((branchIndex % 12) + 12) % 12;
            const representativeHour = BRANCH_TO_HOUR[clampedBranch];

            const sijinKo = BRANCHES_KOREAN[clampedBranch];
            const sijinHj = BRANCHES_HANJA[clampedBranch];
            console.log(`SajuEngine: Input(${solarYear}-${solarMonth}-${solarDay} ${sijinHj}時(${sijinKo}시) branchIndex=${clampedBranch})`);

            // ═══════════════════════════════════════
            // 3. 만세력 사주 계산 (KASI 데이터 기반)
            //
            //    @fullstackfamily/manseryeok가 자동으로:
            //    - 입춘 기준 년주 전환
            //    - 절기 기준 월주 계산
            //    - 일주 계산
            //    - 오서둔(五鼠遁) 기반 시주 계산
            //    - 진태양시 보정 (서울 경도 127° 기준)
            // ═══════════════════════════════════════
            let ms: ManseryeokSajuResult;

            try {
                ms = manseryeokCalculateSaju(
                    solarYear, solarMonth, solarDay,
                    representativeHour, 0,
                    { longitude: 127, applyTimeCorrection: true }
                );
            } catch {
                // 진태양시 보정 실패 시 간단 계산으로 폴백
                console.warn('SajuEngine: 진태양시 보정 실패, 간단 계산 모드 사용');
                ms = calculateSajuSimple(solarYear, solarMonth, solarDay, representativeHour);
            }

            console.log(`SajuEngine: 四柱 = ${ms.yearPillar}년 ${ms.monthPillar}월 ${ms.dayPillar}일 ${ms.hourPillar || '?'}시`);
            console.log(`SajuEngine: 漢字 = ${ms.yearPillarHanja} ${ms.monthPillarHanja} ${ms.dayPillarHanja} ${ms.hourPillarHanja || '?'}`);

            if (ms.isTimeCorrected && ms.correctedTime) {
                console.log(`SajuEngine: 진태양시 보정: ${representativeHour}시 → ${ms.correctedTime.hour}시 ${ms.correctedTime.minute}분`);
            }

            // ═══════════════════════════════════════
            // 4. SajuPillar 객체 조립
            // ═══════════════════════════════════════
            const pillars = {
                year: parseKoreanPillar(ms.yearPillar, ms.yearPillarHanja),
                month: parseKoreanPillar(ms.monthPillar, ms.monthPillarHanja),
                day: parseKoreanPillar(ms.dayPillar, ms.dayPillarHanja),
                hour: ms.hourPillar && ms.hourPillarHanja
                    ? parseKoreanPillar(ms.hourPillar, ms.hourPillarHanja)
                    : parseKoreanPillar(STEMS_KOREAN[0] + BRANCHES_KOREAN[clampedBranch], STEMS_HANJA[0] + BRANCHES_HANJA[clampedBranch]),
            };

            // ═══════════════════════════════════════
            // 5. 대운 계산
            // ═══════════════════════════════════════
            const yearStemH = ms.yearPillarHanja[0];
            const isYangStem = STEM_YINYANG[yearStemH] === '양';
            const isMale = gender === 'male';
            const isForward = (isMale && isYangStem) || (!isMale && !isYangStem);

            const daeunAge = computeDaeunAge(solarYear, solarMonth, solarDay, isForward);
            const daeunList = buildDaeunList(ms.monthPillarHanja, isForward, daeunAge, 10);

            console.log(`SajuEngine: 대운수=${daeunAge}세, 방향=${isForward ? '순행' : '역행'}`);

            // ═══════════════════════════════════════
            // 6. 팔품 판정
            // ═══════════════════════════════════════
            const palPum = getPalPum(solarMonth, solarDay);

            return {
                pillars,
                daeun: daeunList,
                daeunAge,
                palPum,
                isTimeCorrected: ms.isTimeCorrected,
                correctedTime: ms.correctedTime,
            };
        } catch (error) {
            console.error('SajuEngine Error:', error);
            throw error;
        }
    }
};
