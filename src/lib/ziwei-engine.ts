// @ts-nocheck
// ZiWei Engine — powered by iztro (battle-tested open-source ZiWei Dou Shu library)
import { astro } from 'iztro';

export interface ZiWeiPalace {
    index: number;
    name: string;
    branch: string;
    stem: string;
    stars: string[];
    majorStars: string[];
    minorStars: string[];
    brightness: string[];
    isLifePalace?: boolean;
    isBodyPalace?: boolean;
}

export interface ZiWeiResult {
    palaces: ZiWeiPalace[];
    lifePalaceIndex: number;
    bodyPalaceIndex: number;
    mainStars: string[];
    fiveElementBureau: string;
    bureauNumber: number;
    zodiac: string;
    fourPillars: string;
    solarDate: string;
    lunarDate: string;
}

// iztro Korean palace names → display name
const PALACE_DISPLAY: Record<string, string> = {
    '명궁': '명궁(命宮)', '형제': '형제궁(兄弟宮)',
    '부처': '부처궁(夫妻宮)', '자녀': '자녀궁(子女宮)',
    '재백': '재백궁(財帛宮)', '질액': '질액궁(疾厄宮)',
    '천이': '천이궁(遷移宮)', '노복': '노복궁(奴僕宮)',
    '관록': '관록궁(官祿宮)', '전택': '전택궁(田宅宮)',
    '복덕': '복덕궁(福德宮)', '부모': '부모궁(父母宮)',
    '래인': '래인궁(來因宮)',
};

// iztro Korean branch → branch display with Chinese
const BRANCH_DISPLAY: Record<string, string> = {
    '인': '인(寅)', '묘': '묘(卯)', '진': '진(辰)', '사': '사(巳)',
    '오': '오(午)', '미': '미(未)', '신': '신(申)', '유': '유(酉)',
    '술': '술(戌)', '해': '해(亥)', '자': '자(子)', '축': '축(丑)',
};

// Map iztro Korean branch to our palace index (0=寅, 1=卯, …, 10=子, 11=丑)
const BRANCH_TO_IDX: Record<string, number> = {
    '인': 0, '묘': 1, '진': 2, '사': 3, '오': 4, '미': 5,
    '신': 6, '유': 7, '술': 8, '해': 9, '자': 10, '축': 11,
};

// Bureau label
const BUREAU_DISPLAY: Record<string, string> = {
    '수이국': '수이국(水二局)', '목삼국': '목삼국(木三局)',
    '금사국': '금사국(金四局)', '토오국': '토오국(土五局)',
    '화육국': '화육국(火六局)',
};

function getBureauNum(bureau: string): number {
    if (bureau?.includes('이')) return 2;
    if (bureau?.includes('삼')) return 3;
    if (bureau?.includes('사')) return 4;
    if (bureau?.includes('오')) return 5;
    if (bureau?.includes('육')) return 6;
    return 3;
}

// Life palace name keywords
const LIFE_PALACE_NAMES = ['명궁', '命宫', '命宮'];

export const ZiWeiEngine = {
    calculate(
        year: number, month: number, day: number,
        hour: number, minute: number,
        isLunar: boolean = false, isLeap: boolean = false
    ): ZiWeiResult {
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || year === 0) {
            throw new Error("Invalid birth data provided to ZiWeiEngine");
        }

        // Convert hour to Chinese shichen index (0=子, 1=丑, …, 11=亥)
        let shichen = Math.floor((hour + 1) / 2) % 12;
        if (hour === 23) shichen = 0;

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        console.log(`ZiWei(iztro): date=${dateStr}, shichen=${shichen}, isLunar=${isLunar}`);

        let astrolabe: any;
        try {
            if (isLunar) {
                astrolabe = astro.byLunar(dateStr, shichen, '남', isLeap, true, 'ko-KR');
            } else {
                astrolabe = astro.bySolar(dateStr, shichen, '남', true, 'ko-KR');
            }
        } catch (e) {
            console.error('iztro error with ko-KR, trying zh-CN:', e);
            try {
                if (isLunar) {
                    astrolabe = astro.byLunar(dateStr, shichen, '男', isLeap, true, 'zh-CN');
                } else {
                    astrolabe = astro.bySolar(dateStr, shichen, '男', true, 'zh-CN');
                }
            } catch (e2) {
                console.error('iztro fallback error:', e2);
                throw new Error("날짜 범위가 지원되지 않습니다");
            }
        }

        const iztoPalaces = astrolabe?.palaces || [];
        if (iztoPalaces.length === 0) {
            throw new Error("iztro returned empty palaces");
        }

        // Build our 12-slot palace array
        const palaces: ZiWeiPalace[] = Array.from({ length: 12 }, (_, i) => ({
            index: i, name: '', branch: '', stem: '', stars: [],
            majorStars: [], minorStars: [], brightness: [],
        }));

        let lifePalaceIndex = 0;
        let bodyPalaceIndex = 0;

        for (const ip of iztoPalaces) {
            const branch = ip.earthlyBranch || '';
            const pIdx = BRANCH_TO_IDX[branch] ?? -1;
            if (pIdx < 0) {
                console.warn('Unknown branch from iztro:', branch);
                continue;
            }

            // Palace name
            const rawName = ip.name || '';
            const displayName = PALACE_DISPLAY[rawName] || rawName;

            // Collect stars
            const majorStars: string[] = [];
            const minorStars: string[] = [];
            const brightness: string[] = [];
            const allStars: string[] = [];

            if (ip.majorStars) {
                for (const s of ip.majorStars) {
                    const name = s.name || '';
                    if (name) {
                        majorStars.push(name);
                        allStars.push(name);
                        if (s.brightness) brightness.push(`${name}${s.brightness}`);
                    }
                }
            }

            if (ip.minorStars) {
                for (const s of ip.minorStars) {
                    const name = s.name || '';
                    if (name) minorStars.push(name);
                }
            }

            // Detect life/body palace
            const isLife = LIFE_PALACE_NAMES.some(n => rawName.includes(n));
            const isBody = !!ip.isBodyPalace;
            if (isLife) lifePalaceIndex = pIdx;
            if (isBody) bodyPalaceIndex = pIdx;

            palaces[pIdx] = {
                index: pIdx,
                name: displayName,
                branch: BRANCH_DISPLAY[branch] || branch,
                stem: ip.heavenlyStem || '',
                stars: allStars,
                majorStars,
                minorStars,
                brightness,
                isLifePalace: isLife,
                isBodyPalace: isBody,
            };
        }

        // Mark body palace in name
        if (bodyPalaceIndex !== lifePalaceIndex && palaces[bodyPalaceIndex]) {
            const nm = palaces[bodyPalaceIndex].name;
            if (!nm.includes('신궁')) {
                palaces[bodyPalaceIndex].name += ' · 신궁(身宮)';
            }
        }

        // Five Elements Bureau
        const rawBureau = astrolabe?.fiveElementsClass || '';
        const bureauLabel = BUREAU_DISPLAY[rawBureau] || rawBureau || '미정';
        const bureauNum = getBureauNum(rawBureau);

        console.log(`ZiWei(iztro) DONE: Bureau=${bureauLabel}, Life=${lifePalaceIndex}, Body=${bodyPalaceIndex}, Palaces=${iztoPalaces.length}`);

        return {
            palaces,
            lifePalaceIndex,
            bodyPalaceIndex,
            mainStars: palaces.flatMap(p => p.majorStars),
            fiveElementBureau: bureauLabel,
            bureauNumber: bureauNum,
            zodiac: astrolabe?.zodiac || '',
            fourPillars: '',
            solarDate: astrolabe?.solarDate || dateStr,
            lunarDate: astrolabe?.lunarDate || '',
        };
    }
};
