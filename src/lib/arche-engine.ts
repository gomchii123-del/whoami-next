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
            strategy: ArcheEngine.calculateStrategy(physics.amplitude, yearly, currentYear - parseInt(year), parseInt(year))
        };
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
}
