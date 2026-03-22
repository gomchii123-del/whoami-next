// @ts-nocheck
// Astrology Engine — Moshier Ephemeris via circular-natal-horoscope-js
import { Origin, Horoscope } from 'circular-natal-horoscope-js';

export interface PlanetPosition {
    name: string;
    sign: string;
    signKr: string;
    degree: number;        // 0-360
    signDegree: number;    // 0-30 within sign
    isRetrograde: boolean;
    house: number;
}

export interface HouseInfo {
    index: number;         // 1-12
    sign: string;
    signKr: string;
    degree: number;
}

export interface AspectInfo {
    body1: string;
    body2: string;
    type: string;
    typeKr: string;
    orb: number;
}

export interface AstrologyResult {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    sunDegree: number;
    moonDegree: number;
    risingDegree: number;
    planets: PlanetPosition[];
    houses: HouseInfo[];
    aspects: AspectInfo[];
    elements: { fire: number; earth: number; air: number; water: number };
    modalities: { cardinal: number; fixed: number; mutable: number };
}

// ── Constants ──────────────────────────────────────────────

const SIGN_KR: Record<string, string> = {
    "Aries": "양자리 ♈", "Taurus": "황소자리 ♉", "Gemini": "쌍둥이자리 ♊",
    "Cancer": "게자리 ♋", "Leo": "사자자리 ♌", "Virgo": "처녀자리 ♍",
    "Libra": "천칭자리 ♎", "Scorpio": "전갈자리 ♏", "Sagittarius": "궁수자리 ♐",
    "Capricorn": "염소자리 ♑", "Aquarius": "물병자리 ♒", "Pisces": "물고기자리 ♓",
};

const SIGN_ELEMENT: Record<string, string> = {
    "Aries": "fire", "Leo": "fire", "Sagittarius": "fire",
    "Taurus": "earth", "Virgo": "earth", "Capricorn": "earth",
    "Gemini": "air", "Libra": "air", "Aquarius": "air",
    "Cancer": "water", "Scorpio": "water", "Pisces": "water",
};

const SIGN_MODALITY: Record<string, string> = {
    "Aries": "cardinal", "Cancer": "cardinal", "Libra": "cardinal", "Capricorn": "cardinal",
    "Taurus": "fixed", "Leo": "fixed", "Scorpio": "fixed", "Aquarius": "fixed",
    "Gemini": "mutable", "Virgo": "mutable", "Sagittarius": "mutable", "Pisces": "mutable",
};

const ASPECT_KR: Record<string, string> = {
    "conjunction": "합(0°)", "opposition": "충(180°)", "trine": "삼합(120°)",
    "square": "형(90°)", "sextile": "육합(60°)", "quincunx": "인컨(150°)",
    "semi-square": "반형(45°)", "semi-sextile": "반육합(30°)",
    "quintile": "오분(72°)", "septile": "칠분(51°)",
};

const PLANET_KR: Record<string, string> = {
    "sun": "태양 ☉", "moon": "달 ☽", "mercury": "수성 ☿",
    "venus": "금성 ♀", "mars": "화성 ♂", "jupiter": "목성 ♃",
    "saturn": "토성 ♄", "uranus": "천왕성 ♅", "neptune": "해왕성 ♆",
    "pluto": "명왕성 ♇", "chiron": "카이론 ⚷",
    "northnode": "북교점 ☊", "southnode": "남교점 ☋", "lilith": "릴리스 ⚸",
};

function kr(sign: string) { return SIGN_KR[sign] || sign; }

// ── Seoul defaults ──────────────────────────────────────────
const DEFAULT_LAT = 37.5665;  // Seoul
const DEFAULT_LON = 126.9780;

// ── Public API ──────────────────────────────────────────────

export const AstrologyEngine = {
    calculate(
        year: number, month: number, day: number,
        hour: number, minute: number,
        latitude: number = DEFAULT_LAT,
        longitude: number = DEFAULT_LON
    ): AstrologyResult {
        // circular-natal-horoscope-js month is 0-indexed (0=Jan)
        const origin = new Origin({
            year,
            month: month - 1,
            date: day,
            hour,
            minute,
            latitude,
            longitude,
        });

        const horoscope = new Horoscope({
            origin,
            houseSystem: "placidus",
            zodiac: "tropical",
            aspectPoints: ['bodies', 'points', 'angles'],
            aspectWithPoints: ['bodies', 'points', 'angles'],
            aspectTypes: ["major"],
            customOrbs: {},
            language: 'en',
        });

        // ── Extract planet positions ──
        const planets: PlanetPosition[] = [];
        const elements = { fire: 0, earth: 0, air: 0, water: 0 };
        const modalities = { cardinal: 0, fixed: 0, mutable: 0 };

        const bodyKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

        for (const key of bodyKeys) {
            const body = horoscope.CelestialBodies?.[key];
            if (!body) continue;

            const signName = body.Sign?.label || 'Aries';
            const deg = body.ChartPosition?.Ecliptic?.DecimalDegrees || 0;
            const signDeg = deg % 30;

            planets.push({
                name: PLANET_KR[key] || key,
                sign: signName,
                signKr: kr(signName),
                degree: Math.round(deg * 100) / 100,
                signDegree: Math.round(signDeg * 100) / 100,
                isRetrograde: !!body.isRetrograde,
                house: body.House?.id || 0,
            });

            // Count elements & modalities for main 7 bodies
            if (['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(key)) {
                const el = SIGN_ELEMENT[signName] as keyof typeof elements;
                if (el) elements[el]++;
                const mod = SIGN_MODALITY[signName] as keyof typeof modalities;
                if (mod) modalities[mod]++;
            }
        }

        // ── Points (nodes, lilith) ──
        const pointKeys = ['northnode', 'southnode', 'lilith'];
        for (const key of pointKeys) {
            const pt = horoscope.CelestialPoints?.[key];
            if (!pt) continue;
            const signName = pt.Sign?.label || 'Aries';
            const deg = pt.ChartPosition?.Ecliptic?.DecimalDegrees || 0;
            planets.push({
                name: PLANET_KR[key] || key,
                sign: signName,
                signKr: kr(signName),
                degree: Math.round(deg * 100) / 100,
                signDegree: Math.round((deg % 30) * 100) / 100,
                isRetrograde: false,
                house: pt.House?.id || 0,
            });
        }

        // ── Houses ──
        const houses: HouseInfo[] = [];
        if (horoscope.Houses) {
            for (let i = 0; i < horoscope.Houses.length; i++) {
                const h = horoscope.Houses[i];
                const signName = h.Sign?.label || 'Aries';
                houses.push({
                    index: i + 1,
                    sign: signName,
                    signKr: kr(signName),
                    degree: Math.round((h.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees || 0) * 100) / 100,
                });
            }
        }

        // ── Angles ──
        const ascSign = horoscope.Ascendant?.Sign?.label || 'Aries';
        const mcSign = horoscope.Midheaven?.Sign?.label || 'Capricorn';
        const ascDeg = horoscope.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees || 0;
        const mcDeg = horoscope.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees || 0;

        // ── Aspects ──
        const aspects: AspectInfo[] = [];
        if (horoscope.Aspects?.all) {
            for (const asp of horoscope.Aspects.all.slice(0, 20)) {
                aspects.push({
                    body1: PLANET_KR[asp.point1Key] || asp.point1Key,
                    body2: PLANET_KR[asp.point2Key] || asp.point2Key,
                    type: asp.label || asp.key || '',
                    typeKr: ASPECT_KR[asp.key] || asp.label || '',
                    orb: Math.round((asp.orb || 0) * 100) / 100,
                });
            }
        }

        // ── Sun / Moon signs ──
        const sunBody = horoscope.CelestialBodies?.sun;
        const moonBody = horoscope.CelestialBodies?.moon;
        const sunSign = kr(sunBody?.Sign?.label || 'Aries');
        const moonSign = kr(moonBody?.Sign?.label || 'Aries');
        const risingSign = kr(ascSign);

        return {
            sunSign,
            moonSign,
            risingSign,
            sunDegree: Math.round((sunBody?.ChartPosition?.Ecliptic?.DecimalDegrees || 0) * 100) / 100,
            moonDegree: Math.round((moonBody?.ChartPosition?.Ecliptic?.DecimalDegrees || 0) * 100) / 100,
            risingDegree: Math.round(ascDeg * 100) / 100,
            planets,
            houses,
            aspects,
            elements,
            modalities,
        };
    }
};
