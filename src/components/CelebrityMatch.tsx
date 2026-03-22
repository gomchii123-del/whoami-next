'use client';

interface CelebrityMatchProps {
    lifePath: number;
}

interface Celebrity {
    name: string;
    field: string;
    emoji: string;
}

const CELEBRITIES: Record<number, Celebrity[]> = {
    1: [
        { name: '스티브 잡스', field: '혁신의 아이콘', emoji: '💻' },
        { name: '마틴 루터 킹', field: '인권의 선구자', emoji: '✊' },
        { name: '니키 미나즈', field: '음악계의 독보적 존재', emoji: '🎵' },
    ],
    2: [
        { name: '마하트마 간디', field: '비폭력 평화의 상징', emoji: '🕊' },
        { name: '바락 오바마', field: '조율의 리더십', emoji: '🏛' },
        { name: '제니퍼 애니스턴', field: '친밀감의 아이콘', emoji: '🎬' },
    ],
    3: [
        { name: '빌 머레이', field: '유머의 천재', emoji: '😄' },
        { name: '존 트라볼타', field: '무대 위의 카리스마', emoji: '🕺' },
        { name: 'BTS 지민', field: '표현의 아티스트', emoji: '🎤' },
    ],
    4: [
        { name: '빌 게이츠', field: '체계적 혁신가', emoji: '💡' },
        { name: '오프라 윈프리', field: '꾸준함의 힘', emoji: '📺' },
        { name: '아놀드 슈왈제네거', field: '의지의 건축가', emoji: '💪' },
    ],
    5: [
        { name: '에이브러햄 링컨', field: '변화를 이끈 지도자', emoji: '🎩' },
        { name: '안젤리나 졸리', field: '자유로운 영혼', emoji: '✈️' },
        { name: '스티븐 스필버그', field: '모험의 스토리텔러', emoji: '🎬' },
    ],
    6: [
        { name: '존 레논', field: '사랑의 전도사', emoji: '☮️' },
        { name: '마더 테레사', field: '헌신의 아이콘', emoji: '🤲' },
        { name: '아인슈타인', field: '인류를 위한 천재', emoji: '🧠' },
    ],
    7: [
        { name: '니콜라 테슬라', field: '고독한 천재 발명가', emoji: '⚡' },
        { name: '크리스토퍼 놀란', field: '심오한 이야기꾼', emoji: '🎥' },
        { name: '마리 퀴리', field: '진리 탐구의 상징', emoji: '🔬' },
    ],
    8: [
        { name: '넬슨 만델라', field: '위대한 극복의 아이콘', emoji: '✊' },
        { name: '도널드 트럼프', field: '야망의 상징', emoji: '🏢' },
        { name: '산드라 불록', field: '성취의 아이콘', emoji: '🏆' },
    ],
    9: [
        { name: '달라이 라마', field: '자비의 스승', emoji: '🙏' },
        { name: '지미 카터', field: '봉사의 리더', emoji: '🌍' },
        { name: '모건 프리먼', field: '지혜의 목소리', emoji: '🎭' },
    ],
    100: [ // Master 11
        { name: '모차르트', field: '영감의 천재', emoji: '🎹' },
        { name: '해리 후디니', field: '불가능의 파괴자', emoji: '🎩' },
        { name: '마이클 조던', field: '초월의 아이콘', emoji: '🏀' },
    ],
    101: [ // Master 22
        { name: '조지 워싱턴', field: '국가의 건축자', emoji: '🏛' },
        { name: '폴 매카트니', field: '음악의 건축가', emoji: '🎸' },
        { name: '딘 마틴', field: '다재다능한 거장', emoji: '🌟' },
    ],
    102: [ // Master 33
        { name: '프란시스코 교황', field: '영적 지도자', emoji: '⛪' },
        { name: '로버트 드 니로', field: '예술의 스승', emoji: '🎬' },
        { name: '스티비 원더', field: '영혼의 음악가', emoji: '🎵' },
    ],
};

export default function CelebrityMatch({ lifePath }: CelebrityMatchProps) {
    const celebs = CELEBRITIES[lifePath] || CELEBRITIES[1];
    const displayNumber = lifePath >= 100 ? lifePath - 89 : lifePath;

    return (
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-lg border border-gray-100 space-y-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'rgba(196,168,130,0.12)' }}>
                    ⭐
                </div>
                <div>
                    <h3 className="font-serif font-semibold text-gray-800 text-base">같은 에너지의 유명인</h3>
                    <p className="text-xs text-gray-400">Life Path {displayNumber}번과 같은 파동</p>
                </div>
            </div>

            <div className="space-y-3">
                {celebs.map((celeb, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-gray-50"
                        style={{ background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}
                    >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0"
                            style={{ background: 'rgba(196,168,130,0.1)' }}>
                            {celeb.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800 truncate">{celeb.name}</p>
                            <p className="text-xs text-gray-400">{celeb.field}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0"
                            style={{ background: 'rgba(136,160,150,0.1)', color: '#88A096' }}>
                            {displayNumber}번
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
                이들과 당신은 같은 우주적 진동 패턴을 공유합니다.<br />
                비슷한 강점과 약점, 그리고 잠재력을 가지고 있어요.
            </p>
        </div>
    );
}
