export interface KobaiStats {
    career: number;
    creativity: number;
    leadership: number;
    intuition: number;
    communication: number;
    financial: number;
    health: number;
    spirituality: number;
    adaptability: number;
    patience: number;
    analytical: number;
    social: number;
    innovation: number;
    responsibility: number;
    artistic: number;
    empathy: number;
    decision: number;
    focus: number;
    resilience: number;
    diplomacy: number;
}

export interface INDScore {
    scoreTotal: number;      // 0.0~1.0 정규화된 통합 길흉 지수
    fWeight: number;          // 선천 가중치 (40%)
    cWeight: number;          // 주기 가중치 (40%)
    rWeight: number;          // 보정 가중치 (20%)
    label: string;            // 상태 라벨
}

export interface Biorhythm {
    physical: number;         // 신체 사인파 값 (-1~1)
    emotional: number;        // 감성 사인파 값 (-1~1)
    intellectual: number;     // 지성 사인파 값 (-1~1)
    composite: number;        // 합성 파동 값
    isZeroCrossing: boolean;  // 위험일 여부 (0점 통과)
    daysSinceBirth: number;
}

export interface RiskDynamics {
    mEvent: number;           // 사건 하중 (2.5 초과 시 경보)
    sDepth: number;           // 시스템 정지 깊이
    vEsc: number;             // 탈출 속도
    riskLevel: 'STABLE' | 'WARNING' | 'CRITICAL' | 'SYSTEM_REBOOT';
    riskMessage: string;
}

export interface KellyStrategy {
    winProb: number;          // 운의 기대값 p
    odds: number;             // 환경 배당률 o
    allocation: number;       // 최적 투입 비중 d (%)
    strategyType: 'ATTACK' | 'DEFENSE';
    message: string;
}

export interface EnergyLoop {
    loopType: 'SPIRITUAL' | 'MATERIAL';  // 3-6-9 vs 1-2-4-8-7-5
    reductionVal: number;
    message: string;
}

export interface GridInterpretation {
    base10: { index: number; theme: string };
    base22: { index: number; theme: string };
    base60: { index: number; theme: string };
}

export interface FractalPrediction {
    seedAge: number;
    nextResonanceAge: number;
    nextResonanceYear: number;
}

export interface AnalysisResult {
    // New Expanded Categories
    lifePath: number;      // alpha: Evolutionary Path (운명수)
    bornEssence: number;   // P_core: Born Seed (본질수)
    shadow: number;        // Shadow: Inner Vulnerability
    career: number;        // P_type: Career & Wealth
    relationship: number;  // F_rel: Love & Relationships
    soulUrge: number;      // Origin_O: Hidden Desires
    yearlyCycle: number;   // Yearly: Flow of the Year

    // Legacy/Internal Support
    lifePathNumber: number; // For backward compatibility (maps to alpha now)
    destinyNumber: number;  // alpha
    personalYear: number;   // yearlyCycle (legacy name)

    lifeScore: number;
    kobaiStats: KobaiStats;
    lifetimeFlow: Array<{ age: number; year: number; energy: number }>;
    dailyFortune: any;
    physics: {
        amplitude: number;
        phase: number;
        isMaster: boolean;
        energyCapacity: number; // E_total
    };
    systemStatus: any;
    strategy: any;

    // ── 통합수리 동역학(IND) 확장 필드 ──
    indScore: INDScore;
    biorhythm: Biorhythm;
    riskDynamics: RiskDynamics;
    kellyStrategy: KellyStrategy;
    energyLoop: EnergyLoop;
    gridInterpretation: GridInterpretation;
    fractalPrediction: FractalPrediction;
    fullSum: number;  // 전합(Full Sum) — 자릿수 합산 이전의 총량
}

export class ArcheEngine {
    static reduceToSingle(num: number | string, preserveMaster: boolean = true): number {
        const masterNumbers = preserveMaster ? [11, 22, 33] : [];
        let n = typeof num === 'string' ? num.split('').reduce((s, d) => s + parseInt(d, 10), 0) : num;

        while (n > 9 && !masterNumbers.includes(n)) {
            n = n.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
        }
        return n;
    }

    static calculatePcore(day: string): number {
        // P_core: Derived from the Day of birth. Preserve 11, 22.
        return ArcheEngine.reduceToSingle(parseInt(day, 10), true);
    }

    static calculateAlpha(year: string, month: string, day: string): number {
        // alpha: Y_red + Birth Month + Birth Day. Preserve 11, 22, 33.
        const yRed = ArcheEngine.reduceToSingle(year, false);
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        return ArcheEngine.reduceToSingle(yRed + m + d, true);
    }

    static calculateOriginO(year: string, month: string, day: string): number {
        // Origin_O: Sum of every individual digit in YYYYMMDD.
        const fullDate = year + month.padStart(2, '0') + day.padStart(2, '0');
        return fullDate.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    }

    static calculateShadow(dayIn: string, monthIn: string): number {
        // Shadow: (Day % 4 || 4) - M_env (1:Div, 2:Exp, 3:Conv, 4:Cond). if <=0, add 4.
        const day = parseInt(dayIn, 10);
        const month = parseInt(monthIn, 10);
        const dMode = (day % 4) || 4;
        const mEnv = ((month - 1) % 4) + 1; // Simplified mapping 1-4
        let shadow = dMode - mEnv;
        if (shadow <= 0) shadow += 4;
        return shadow;
    }

    static calculateCareerType(pCore: number, alpha: number): number {
        // Career Execution: (P_core + alpha) % 3.
        return (pCore + alpha) % 3;
    }

    static calculateYearlyCycle(pCore: number, alpha: number, targetYear: number): number {
        // Yearly: (P_core + alpha + Reduced_Target_Year) % 9. (normalized to 1-9 for UI)
        const yRed = ArcheEngine.reduceToSingle(targetYear.toString(), false);
        let cycle = (pCore + alpha + yRed) % 9;
        return cycle === 0 ? 9 : cycle;
    }

    static calculateLifeScore(lp: number, de: number, originO: number): number {
        const masterBonus = [11, 22, 33].includes(lp) ? 15 : 0;
        const baseScore = 60 + ((lp + de + originO) % 26);
        return Math.min(100, Math.round(baseScore + masterBonus));
    }

    static performAnalysis(year: string, month: string, day: string, hour?: string): AnalysisResult {
        const pCore = ArcheEngine.calculatePcore(day);
        const alpha = ArcheEngine.calculateAlpha(year, month, day);
        const originO = ArcheEngine.calculateOriginO(year, month, day);
        const shadow = ArcheEngine.calculateShadow(day, month);
        const career = ArcheEngine.calculateCareerType(pCore, alpha);
        const currentYear = new Date().getFullYear();
        const yearly = ArcheEngine.calculateYearlyCycle(pCore, alpha, currentYear);

        const isMaster = [11, 22, 33].includes(alpha);
        const energyCapacity = alpha * (isMaster ? 1.5 : 1.0);

        const physics = {
            amplitude: Math.min(100, Math.round(energyCapacity * 3.5)), // Scaled for UI
            phase: (pCore * 40) % 360,
            isMaster: isMaster,
            energyCapacity: energyCapacity
        };

        const ls = ArcheEngine.calculateLifeScore(pCore, alpha, originO);

        // ── IND 확장 연산 ──
        const fullDate = year + month.padStart(2, '0') + day.padStart(2, '0');
        const fullSum = ArcheEngine.calculateFullSum(fullDate);
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const biorhythm = ArcheEngine.calculateBiorhythm(birthDate, new Date());
        const indScore = ArcheEngine.calculateINDScore(pCore, alpha, originO, biorhythm, yearly);
        const riskDynamics = ArcheEngine.calculateRiskDynamics(pCore, alpha, originO, fullSum, biorhythm);
        const kellyStrategy = ArcheEngine.calculateKellyStrategy(indScore.scoreTotal, yearly);
        const energyLoop = ArcheEngine.identifyEnergyLoop(fullSum);
        const gridInterpretation = ArcheEngine.calculateGridInterpretation(fullSum);
        const birthYear = parseInt(year);
        const currentAge = currentYear - birthYear;
        const fractalPrediction = ArcheEngine.calculateFractalPrediction(birthYear, currentAge);

        return {
            lifePath: alpha,
            bornEssence: pCore,
            shadow: shadow,
            career: career,
            relationship: (originO % 22) || 22, // Simplified Friction Proxy
            soulUrge: ArcheEngine.reduceToSingle(originO),
            yearlyCycle: yearly,

            lifePathNumber: alpha,
            destinyNumber: alpha,
            personalYear: yearly,

            lifeScore: ls,
            kobaiStats: ArcheEngine.calculateKobaiStats(pCore, alpha, originO),
            lifetimeFlow: ArcheEngine.calculateLifetimeFlow(parseInt(year), pCore),
            dailyFortune: ArcheEngine.calculateDailyFortuneDetail(pCore, alpha, originO, ls),
            physics: physics,
            systemStatus: ArcheEngine.calculateSystemStatus(pCore, alpha, yearly),
            strategy: ArcheEngine.calculateStrategy(physics.amplitude, yearly, currentAge, birthYear),

            // ── IND 확장 필드 ──
            fullSum,
            indScore,
            biorhythm,
            riskDynamics,
            kellyStrategy,
            energyLoop,
            gridInterpretation,
            fractalPrediction,
        };
    }

    // ── IND 통합수리 동역학 메서드 ──

    /** 전합(Full Sum) — 자릿수 합산 이전의 총량으로 사건의 질량/파괴력 결정 */
    static calculateFullSum(data: string): number {
        return data.split('').reduce((sum, ch) => {
            const n = parseInt(ch, 10);
            return isNaN(n) ? sum : sum + n;
        }, 0);
    }

    /** 바이오리듬 3파동(신체23일/감성28일/지성33일) + Zero-crossing 감지 */
    static calculateBiorhythm(birthDate: Date, targetDate: Date): Biorhythm {
        const diffMs = targetDate.getTime() - birthDate.getTime();
        const daysSinceBirth = Math.floor(diffMs / 86400000);

        const physical = Math.sin((2 * Math.PI * daysSinceBirth) / 23);
        const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / 28);
        const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / 33);
        const composite = (physical + emotional + intellectual) / 3;

        // Zero-crossing: 사인파가 0에 가까우면 위상 전이 불안정기
        const zeroCrossingThreshold = 0.05;
        const isZeroCrossing =
            Math.abs(physical) < zeroCrossingThreshold ||
            Math.abs(emotional) < zeroCrossingThreshold ||
            Math.abs(intellectual) < zeroCrossingThreshold;

        return {
            physical: Math.round(physical * 1000) / 1000,
            emotional: Math.round(emotional * 1000) / 1000,
            intellectual: Math.round(intellectual * 1000) / 1000,
            composite: Math.round(composite * 1000) / 1000,
            isZeroCrossing,
            daysSinceBirth,
        };
    }

    /** Score_Total = (F_weight * 0.4) + (C_weight * 0.4) + (R_weight * 0.2) */
    static calculateINDScore(pCore: number, alpha: number, originO: number, bio: Biorhythm, yearly: number): INDScore {
        // F_weight (선천 가중치): 피타고라스 생명수 기반 — 본질수와 운명수의 조화도
        const harmonicGap = Math.abs(pCore - (alpha > 9 ? ArcheEngine.reduceToSingle(alpha, false) : alpha));
        const fWeight = Math.max(0, Math.min(1, 1 - harmonicGap * 0.1)) *
            ([11, 22, 33].includes(alpha) ? 1.15 : 1.0); // 마스터 수 보너스

        // C_weight (주기 가중치): 바이오리듬 합성파 + 연도주기 공명
        const bioNorm = (bio.composite + 1) / 2; // -1~1 → 0~1
        const yearlyNorm = yearly / 9;
        const cWeight = Math.max(0, Math.min(1, bioNorm * 0.6 + yearlyNorm * 0.4));

        // R_weight (보정 가중치): 오리진 O 기반 보정 (이름수/공간 대용)
        const rWeight = Math.max(0, Math.min(1, (originO % 10) / 10));

        const scoreTotal = Math.max(0, Math.min(1, fWeight * 0.4 + cWeight * 0.4 + rWeight * 0.2));

        let label = '';
        if (scoreTotal >= 0.85) label = '골든 타임 — 최상의 에너지 흐름';
        else if (scoreTotal >= 0.7) label = '순항 구간 — 적극적 행동 권장';
        else if (scoreTotal >= 0.5) label = '균형 구간 — 안정적 유지';
        else if (scoreTotal >= 0.3) label = '에너지 충돌 — 방어적 전략 필요';
        else label = '정체기 — 에너지 충전 및 재정비';

        return {
            scoreTotal: Math.round(scoreTotal * 1000) / 1000,
            fWeight: Math.round(fWeight * 1000) / 1000,
            cWeight: Math.round(cWeight * 1000) / 1000,
            rWeight: Math.round(rWeight * 1000) / 1000,
            label,
        };
    }

    /** M_event, S_depth, V_esc 리스크 동역학 */
    static calculateRiskDynamics(pCore: number, alpha: number, originO: number, fullSum: number, bio: Biorhythm): RiskDynamics {
        const PHI = 1.618;
        const base22Impact = fullSum % 22 || 22;
        const kFactor = (alpha > 9 ? 1.5 : 1.0);
        const phiBase360 = (fullSum % 360) / 360 * PHI + 0.5;

        // V_esc = (O + P_core) × ΔM
        const deltaM = Math.abs(bio.composite) + 0.1;
        const vEsc = (originO + pCore) * deltaM;

        // M_event = (Base22 충격 × k) / (V_esc × Φ(Base 360))
        const mEvent = (base22Impact * kFactor) / (vEsc * phiBase360 + 0.01);

        // S_depth = Base22×β + Base18×γ + Base16×δ
        const base18 = fullSum % 18 || 18;
        const base16 = fullSum % 16 || 16;
        const sDepth = base22Impact * 0.4 + base18 * 0.35 + base16 * 0.25;

        // Zero-crossing 보정: 위험일이면 리스크 3.2배
        const zeroCrossingMultiplier = bio.isZeroCrossing ? 3.2 : 1.0;
        const adjustedMEvent = mEvent * zeroCrossingMultiplier;

        const normalPressure = 10;
        let riskLevel: RiskDynamics['riskLevel'] = 'STABLE';
        let riskMessage = '안정적인 흐름 위에 있습니다. 현재의 흐름을 유지하세요.';

        if (sDepth > normalPressure * 5.4) {
            riskLevel = 'SYSTEM_REBOOT';
            riskMessage = '에너지 정체가 임계점에 도달했습니다. 지금은 어떤 노력보다 완전한 휴식이 필요한 시점입니다.';
        } else if (adjustedMEvent > 2.5) {
            riskLevel = 'CRITICAL';
            riskMessage = '강력한 외부 충격이 예상됩니다. 재산 손실이나 사고 리스크가 평시보다 높으니 무리한 확장은 자제하세요.';
        } else if (adjustedMEvent > 1.5 || sDepth > normalPressure * 3) {
            riskLevel = 'WARNING';
            riskMessage = '주의가 필요한 구간입니다. 중요한 결정은 신중하게 접근하세요.';
        }

        if (bio.isZeroCrossing && riskLevel === 'STABLE') {
            riskLevel = 'WARNING';
            riskMessage = '지금은 에너지가 전환되는 불안정한 시기입니다. 중요한 계약이나 결정은 피하세요.';
        }

        return {
            mEvent: Math.round(adjustedMEvent * 100) / 100,
            sDepth: Math.round(sDepth * 100) / 100,
            vEsc: Math.round(vEsc * 100) / 100,
            riskLevel,
            riskMessage,
        };
    }

    /** 켈리 기준: d = (po - (1-p)) / o */
    static calculateKellyStrategy(scoreTotal: number, yearly: number): KellyStrategy {
        // p = 운의 기대값 (scoreTotal 기반)
        const winProb = Math.max(0.1, Math.min(0.9, scoreTotal));
        // o = 환경 배당률 (yearly 기반  — yearly가 높을수록 배당 상승)
        const odds = 1 + (yearly / 9) * 2;
        // d = (po - (1-p)) / o
        const d = (winProb * odds - (1 - winProb)) / odds;
        const allocation = Math.max(0, Math.min(100, Math.round(d * 100)));

        const strategyType = d > 0 ? 'ATTACK' as const : 'DEFENSE' as const;
        let message = '';
        if (d > 0.5) {
            message = `현재 기대 승률이 매우 높습니다. 총 에너지와 자산 중 약 ${allocation}%를 과감히 투입해도 좋은 시기입니다.`;
        } else if (d > 0.2) {
            message = `양호한 운의 흐름입니다. 에너지의 ${allocation}%를 전략적으로 투입하세요.`;
        } else if (d > 0) {
            message = `소극적 공격이 적합합니다. 전체 자원의 ${allocation}%만 투입하고 나머지는 보존하세요.`;
        } else {
            message = '현재는 투입보다 보존이 우선입니다. 자원 투입 비중을 최소화하고 에너지를 비축하세요.';
        }

        return {
            winProb: Math.round(winProb * 100) / 100,
            odds: Math.round(odds * 100) / 100,
            allocation,
            strategyType,
            message,
        };
    }

    /** 에너지 루프 판독: 3-6-9(정신) vs 1-2-4-8-7-5(물질) */
    static identifyEnergyLoop(n: number): EnergyLoop {
        const reductionVal = n % 9 || 9;
        const spiritualAxis = [3, 6, 9];
        const loopType = spiritualAxis.includes(reductionVal) ? 'SPIRITUAL' as const : 'MATERIAL' as const;
        const message = loopType === 'SPIRITUAL'
            ? '정신적 변곡점에 위치해 있습니다. 의지적 개입과 내면 성찰이 필요한 시기입니다.'
            : '세속적 순환 주기에 있습니다. 자금 흐름이나 물리적 이동이 발생하는 물질적 주기입니다.';

        return { loopType, reductionVal, message };
    }

    /** 다차원 격자 필터링: Base 10 / 22 / 60 Modulo */
    static calculateGridInterpretation(fullSum: number): GridInterpretation {
        const base10Themes: Record<number, string> = {
            1: '독립 및 신규 창업의 에너지',
            2: '협력과 외교의 에너지',
            3: '표현과 창조의 에너지',
            4: '안착 및 조직 구축의 에너지',
            5: '변화와 자유의 에너지',
            6: '책임과 헌신의 에너지',
            7: '분석과 내면 탐구의 에너지',
            8: '자산 획득과 권력의 에너지',
            9: '완성과 초월의 에너지',
            0: '순환의 끝과 새로운 시작',
        };
        const base22Themes: Record<number, string> = {
            0: '무한한 가능성이 열려 있는 원점의 에너지입니다. 정해진 길이 없기에 어디로든 나아갈 수 있지만, 방향을 정하지 않으면 표류할 수 있습니다.',
            1: '강한 의지력과 실현력이 결합된 시기입니다. 머릿속 구상을 현실로 끌어내릴 수 있는 집중력이 극대화되어 있습니다.',
            2: '직관과 감수성이 예민하게 살아나는 시기입니다. 논리보다 느낌을 따라가면 숨겨진 기회를 포착할 수 있습니다.',
            3: '풍요와 창조의 에너지가 넘치는 시기입니다. 새로운 생명, 작품, 사업 등 무언가를 탄생시키기에 최적의 조건입니다.',
            4: '질서와 구조를 세우는 에너지가 강한 시기입니다. 흩어진 것들을 체계화하고 기틀을 잡는 데 집중하면 큰 성과를 거둡니다.',
            5: '전통과 경험에서 오는 지혜가 빛을 발하는 시기입니다. 멘토의 조언이나 검증된 방법론을 따르는 것이 현명합니다.',
            6: '중대한 선택의 기로에 놓이는 에너지입니다. 두 갈래 길 앞에서 머리가 아닌 마음의 소리에 귀 기울이세요.',
            7: '목표를 향해 강하게 전진하는 추진력의 에너지입니다. 장애물이 있더라도 의지력으로 돌파할 수 있는 시기입니다.',
            8: '내면의 힘과 절제력이 요구되는 시기입니다. 급한 감정을 다스리고 인내하면 결국 원하는 것을 얻게 됩니다.',
            9: '깊은 성찰과 내면 탐구의 에너지입니다. 소음에서 벗어나 조용히 자신만의 답을 찾는 시간이 필요합니다.',
            10: '삶의 흐름이 크게 전환되는 변곡점에 서 있습니다. 예기치 않은 변화가 오지만, 그 안에 새로운 기회가 숨어 있습니다.',
            11: '과거의 행동에 대한 결산이 이루어지는 시기입니다. 뿌린 대로 거두게 되니 정직한 대응이 최선의 전략입니다.',
            12: '관점의 전환이 필요한 때입니다. 지금까지의 방식을 고수하면 벽에 부딪히지만, 시선을 바꾸면 전혀 새로운 해법이 보입니다.',
            13: '끝과 시작이 교차하는 강력한 변형의 에너지입니다. 낡은 것을 과감히 놓아야 새로운 것이 들어올 수 있습니다.',
            14: '대립하는 요소들 사이에서 균형을 잡아야 하는 시기입니다. 극단을 피하고 중용의 길을 걸으면 최상의 결과를 얻습니다.',
            15: '집착이나 유혹에 시험받는 에너지입니다. 물질적 욕망에 끌려가지 않도록 자기 절제가 중요한 시기입니다.',
            16: '갑작스러운 외부 충격으로 기존 구조가 흔들릴 수 있습니다. 무너진 자리에서 더 단단한 기반을 다시 세울 기회로 삼으세요.',
            17: '어둠 뒤에 찾아오는 희망과 회복의 에너지입니다. 어려운 시기를 지나왔다면 이제 서서히 빛이 비치기 시작합니다.',
            18: '불확실함 속에서 불안이 커질 수 있는 시기입니다. 환상과 현실을 구분하는 냉정한 판단력이 필요하며, 감정에 휘둘리지 않는 것이 중요합니다.',
            19: '자신감과 활력이 넘치는 성공의 에너지입니다. 당신의 존재 자체가 빛나는 시기이며, 독자적인 길을 가도 좋은 결과를 얻습니다.',
            20: '깊은 깨달음과 재도약의 에너지입니다. 과거의 실수에서 배운 교훈이 새로운 차원의 성장으로 이어집니다.',
            21: '한 주기의 완성을 향해 나아가는 대성취의 에너지입니다. 오랫동안 쌓아온 노력이 마침내 결실을 맺는 시기입니다.',
        };
        const base60Themes: Record<number, string> = {
            0: '대운의 완성과 새 주기 진입',
        };

        const b10 = fullSum % 10;
        const b22 = fullSum % 22;
        const b60 = fullSum % 60;

        return {
            base10: { index: b10, theme: base10Themes[b10] || base10Themes[0] },
            base22: { index: b22, theme: base22Themes[b22] || '거대한 흐름 속에서 중요한 전환점에 서 있습니다. 큰 조직이나 시스템과의 접점에서 의미 있는 변화가 일어날 수 있습니다.' },
            base60: {
                index: b60,
                theme: b60 === 0
                    ? base60Themes[0]
                    : b60 <= 15 ? '생애 초반부의 기초 에너지가 축적되는 구간에 해당합니다. 서두르지 말고 차근차근 내공을 다지세요.'
                    : b60 <= 30 ? '확장과 발전의 에너지가 흐르는 구간입니다. 새로운 도전이나 투자에 적합한 시기입니다.'
                    : b60 <= 45 ? '오랫동안 노력해온 것들이 결실을 맺는 성취의 구간에 접어들고 있습니다.'
                    : '정리와 재편의 에너지가 흐르는 시기입니다. 낡은 것을 내려놓고 새로운 주기를 준비하세요.',
            },
        };
    }

    /** 프랙탈 시간 공명: T_future = Age_Seed × 1.618^n */
    static calculateFractalPrediction(birthYear: number, currentAge: number): FractalPrediction {
        const PHI = 1.618;
        // 시드 연령 = 과거 변곡점 (7의 배수 중 가장 최근)
        let seedAge = Math.max(7, Math.floor(currentAge / 7) * 7);
        if (seedAge >= currentAge) seedAge = Math.max(7, seedAge - 7);

        // 다음 공명일 = seedAge × PHI^1 (1차 공명)
        let nextResonanceAge = Math.round(seedAge * PHI);
        // 이미 지난 공명이면 PHI^2로
        if (nextResonanceAge <= currentAge) {
            nextResonanceAge = Math.round(seedAge * PHI * PHI);
        }
        const nextResonanceYear = birthYear + nextResonanceAge;

        return { seedAge, nextResonanceAge, nextResonanceYear };
    }

    static calculateKobaiStats(lp: number, de: number, so: number): KobaiStats {
        const seed = lp * 100 + de * 10 + so;
        const getStat = (offset: number) => {
            const x = Math.sin(seed * (offset + 1)) * 10000;
            return Math.floor(Math.abs(x - Math.floor(x)) * 60) + 40;
        };
        return {
            career: getStat(0), creativity: getStat(1), leadership: getStat(2), intuition: getStat(3), communication: getStat(4),
            financial: getStat(5), health: getStat(6), spirituality: getStat(7), adaptability: getStat(8), patience: getStat(9),
            analytical: getStat(10), social: getStat(11), innovation: getStat(12), responsibility: getStat(13), artistic: getStat(14),
            empathy: getStat(15), decision: getStat(16), focus: getStat(17), resilience: getStat(18), diplomacy: getStat(19)
        };
    }

    static calculateLifetimeFlow(birthYear: number, lp: number): Array<{ age: number; year: number; energy: number }> {
        const points = [];
        for (let age = 0; age <= 90; age++) {
            const year = birthYear + age;
            const cyclePos = (year + lp) % 9;
            let energy = 50 + Math.sin((cyclePos / 9) * Math.PI * 2) * 30;
            points.push({ age, year, energy: Math.min(100, Math.max(30, Math.round(energy))) });
        }
        return points;
    }

    static calculateDailyFortuneDetail(lp: number, de: number, so: number, score: number): any {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const theta = ((lp * 40) + (dayOfYear * 10)) % 360;
        const colors = ["금색", "보라색", "청록색", "주황색", "분홍색", "초록색", "남색", "빨간색", "노란색"];
        return {
            weather: score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 45 ? 2 : 1,
            oracle: { phase: 'stable', messageIdx: (lp + de + so) % 3 },
            risk: { eventLoad: Math.round(Math.abs(Math.sin(dayOfYear * 0.1)) * 100) },
            lucky: {
                color: colors[(lp + dayOfYear) % 9],
                direction: "동쪽",
                timeSlot: "오전"
            }
        };
    }

    static calculateSystemStatus(lp: number, de: number, py: number): any {
        return { status: "STABLE", depth: (lp + de) * 0.5 };
    }

    static calculateStrategy(amplitude: number, py: number, age: number, birthYear: number): any {
        return { allocation: Math.round(amplitude * 0.8), fractalDates: [] };
    }

    static getCareerAptitude(stats: KobaiStats): { title: string; description: string; careers: string[] } {
        const categories = {
            "Competence": [stats.career, stats.analytical, stats.decision, stats.focus, stats.responsibility],
            "Stability": [stats.financial, stats.health, stats.patience, stats.resilience, stats.adaptability],
            "Sociality": [stats.leadership, stats.communication, stats.social, stats.empathy, stats.diplomacy],
            "Growth": [stats.creativity, stats.intuition, stats.spirituality, stats.innovation, stats.artistic]
        };

        let maxAvg = 0;
        let topCategory = "Competence";

        for (const [key, values] of Object.entries(categories)) {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            if (avg > maxAvg) {
                maxAvg = avg;
                topCategory = key;
            }
        }

        switch (topCategory) {
            case "Competence":
                return {
                    title: "전략적 실행가 (Strategic Executor)",
                    description: "뛰어난 분석력과 책임감을 바탕으로 복잡한 문제를 해결하고 실질적인 성과를 만들어내는 능력이 탁월합니다.",
                    careers: ["경영 컨설턴트", "프로젝트 매니저", "데이터 분석가", "금융 전문가", "변호사"]
                };
            case "Stability":
                return {
                    title: "안정적 관리자 (Stable Guardian)",
                    description: "탄탄한 내면의 힘과 인내심으로 조직의 기반을 다지고 리스크를 관리하며 지속 가능한 성장을 이끕니다.",
                    careers: ["자산 운용가", "의료/보건 전문가", "부동산 전문가", "농업/환경 전문가", "품질 관리자"]
                };
            case "Sociality":
                return {
                    title: "영향력 있는 리더 (Influential Leader)",
                    description: "탁월한 소통 능력과 공감력으로 사람들의 마음을 움직이고 조직을 하나로 묶어 비전을 제시합니다.",
                    careers: ["CEO/임원", "정치/외교가", "홍보/마케팅 디렉터", "교육자", "상담 심리사"]
                };
            case "Growth":
                return {
                    title: "창조적 혁신가 (Creative Innovator)",
                    description: "직관과 영감을 통해 기존의 틀을 깨고 새로운 가치를 창출하며 미래를 앞서 나가는 통찰력이 있습니다.",
                    careers: ["아티스트/디자이너", "콘텐츠 크리에이터", "창업가", "연구원", "트렌드 분석가"]
                };
            default:
                return {
                    title: "다재다능한 밸런서 (Versatile Balancer)",
                    description: "모든 영역에서 균형 잡힌 능력을 보유하고 있어 어떤 상황에서도 유연하게 대처합니다.",
                    careers: ["제너럴리스트", "기획자", "코디네이터"]
                };
        }
    }
}

