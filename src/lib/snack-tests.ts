/**
 * 인스턴트 스낵 테스트 콘텐츠 라이브러리
 *
 * ~9 기반 9가지 바이럴 테스트.
 * 규칙: 별표, 소괄호 절대 금지. 대괄호만 섹션 구분.
 */

import { SNACK_TESTS_VOL5 } from './snack-tests-vol5';
export interface SnackTest {
    id: string;
    emoji: string;
    title: string;
    subtitle: string;
    gradient: string;
    darkGradient: string;
    accentColor: string;
    thumbnailBg: string;
}

export const SNACK_TESTS: SnackTest[] = [
    // ── 기존 9종 ──
    { id: 'night-persona', emoji: '🌙', title: '밤의 페르소나', subtitle: '해가 지면 깨어나는 진짜 나', gradient: 'linear-gradient(135deg, #1a0533, #2d1b69)', darkGradient: 'linear-gradient(180deg, #0D0520, #1a0533, #2d1b69)', accentColor: '#B388FF', thumbnailBg: '#1a0533' },
    { id: 'past-life', emoji: '⚖️', title: '전생의 죄목', subtitle: '전생에서 당신이 저지른 업보', gradient: 'linear-gradient(135deg, #1a1a0a, #2d2d0a)', darkGradient: 'linear-gradient(180deg, #0D0D05, #1a1a0a, #2d2d0a)', accentColor: '#FFD54F', thumbnailBg: '#1a1a0a' },
    { id: 'factbomb', emoji: '💀', title: '무의식 팩트폭행', subtitle: '3줄로 끝내는 당신의 민낯', gradient: 'linear-gradient(135deg, #1a1a1a, #333)', darkGradient: 'linear-gradient(180deg, #111, #1a1a1a, #2d2d2d)', accentColor: '#E0E0E0', thumbnailBg: '#1a1a1a' },
    { id: 'attraction', emoji: '🔥', title: '파멸적 끌림', subtitle: '당신이 가장 위험하게 끌리는 유형', gradient: 'linear-gradient(135deg, #2D1117, #58111A)', darkGradient: 'linear-gradient(180deg, #1A0A0A, #2D1117, #58111A)', accentColor: '#FF6B6B', thumbnailBg: '#2D1117' },
    { id: 'empire', emoji: '👑', title: '제국의 건설자', subtitle: '당신이 돈 버는 법 한 줄 요약', gradient: 'linear-gradient(135deg, #1A1708, #3D2E0A)', darkGradient: 'linear-gradient(180deg, #1A1400, #1A1708, #3D2E0A)', accentColor: '#F2C94C', thumbnailBg: '#1A1708' },
    { id: 'survival', emoji: '⚡', title: '생존 본능', subtitle: '위기 상황 당신의 본능적 반응', gradient: 'linear-gradient(135deg, #0A1A0D, #0D3117)', darkGradient: 'linear-gradient(180deg, #081A0B, #0A1A0D, #0D3117)', accentColor: '#69F0AE', thumbnailBg: '#0A1A0D' },
    { id: 'mask', emoji: '🎭', title: '가면 뒤의 나', subtitle: '사람들 앞에서 숨기는 진짜 얼굴', gradient: 'linear-gradient(135deg, #1a1025, #2d1845)', darkGradient: 'linear-gradient(180deg, #0D0815, #1a1025, #2d1845)', accentColor: '#CE93D8', thumbnailBg: '#1a1025' },
    { id: 'love-pattern', emoji: '💔', title: '연애 흑역사 패턴', subtitle: '당신이 반복하는 연애 실수', gradient: 'linear-gradient(135deg, #2D1128, #58113A)', darkGradient: 'linear-gradient(180deg, #1A0A15, #2D1128, #58113A)', accentColor: '#F48FB1', thumbnailBg: '#2D1128' },
    { id: 'weakness', emoji: '🗡️', title: '나의 약점 해부', subtitle: '아무도 말 안 해주는 치명적 약점', gradient: 'linear-gradient(135deg, #0D1A2D, #112858)', darkGradient: 'linear-gradient(180deg, #0A1020, #0D1A2D, #112858)', accentColor: '#90CAF9', thumbnailBg: '#0D1A2D' },

    // ── 19금 본능과 은밀한 사생활 ──
    { id: 'bed-persona', emoji: '🛏️', title: '침대 위 페르소나', subtitle: '침대 위에서 깨어나는 나의 진짜 페르소나', gradient: 'linear-gradient(135deg, #2D0A1E, #5C1142)', darkGradient: 'linear-gradient(180deg, #1A0612, #2D0A1E, #5C1142)', accentColor: '#FF80AB', thumbnailBg: '#2D0A1E' },
    { id: 'secret-obsession', emoji: '🔒', title: '위험한 집착', subtitle: '절대 밖으로 들키면 안 되는 위험한 집착 포인트', gradient: 'linear-gradient(135deg, #1A0A1A, #3D0A3D)', darkGradient: 'linear-gradient(180deg, #0D050D, #1A0A1A, #3D0A3D)', accentColor: '#EA80FC', thumbnailBg: '#1A0A1A' },
    { id: 'drunk-mode', emoji: '🍷', title: '술기운 봉인해제', subtitle: '술기운이 오를 때 봉인 해제되는 쓰레기 성향', gradient: 'linear-gradient(135deg, #2D1A0A, #5C2D0A)', darkGradient: 'linear-gradient(180deg, #1A0F06, #2D1A0A, #5C2D0A)', accentColor: '#FFAB40', thumbnailBg: '#2D1A0A' },
    { id: 'fatal-flirt', emoji: '💋', title: '치명적 플러팅', subtitle: '나를 완벽하게 무장해제 시키는 플러팅 스킬', gradient: 'linear-gradient(135deg, #2D0A17, #6B0F2E)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #6B0F2E)', accentColor: '#FF5252', thumbnailBg: '#2D0A17' },
    { id: 'fatal-target', emoji: '🎯', title: '마성의 타겟', subtitle: '한 번 얽히면 절대 빠져나올 수 없는 타겟 번호', gradient: 'linear-gradient(135deg, #0A0D2D, #0F1A6B)', darkGradient: 'linear-gradient(180deg, #06081A, #0A0D2D, #0F1A6B)', accentColor: '#448AFF', thumbnailBg: '#0A0D2D' },

    // ── 인간관계 팩트폭행 ──
    { id: 'behind-talk', emoji: '🗣️', title: '뒷담화 키워드', subtitle: '친구들이 단톡방에서 쓰는 나의 뒷담화 단어', gradient: 'linear-gradient(135deg, #1A1A0D, #3D3D0A)', darkGradient: 'linear-gradient(180deg, #0D0D06, #1A1A0D, #3D3D0A)', accentColor: '#FFF176', thumbnailBg: '#1A1A0D' },
    { id: 'sucker-target', emoji: '🎪', title: '호구 감별기', subtitle: '내가 평생 호구 잡히기 딱 좋은 최악의 인간상', gradient: 'linear-gradient(135deg, #0D1A1A, #0A3D3D)', darkGradient: 'linear-gradient(180deg, #060D0D, #0D1A1A, #0A3D3D)', accentColor: '#80DEEA', thumbnailBg: '#0D1A1A' },
    { id: 'dark-button', emoji: '😈', title: '흑화 버튼', subtitle: '겉으로는 웃지만 속으로 칼을 가는 나의 흑화 버튼', gradient: 'linear-gradient(135deg, #1A0D0D, #3D0A0A)', darkGradient: 'linear-gradient(180deg, #0D0606, #1A0D0D, #3D0A0A)', accentColor: '#EF5350', thumbnailBg: '#1A0D0D' },
    { id: 'revenge-scenario', emoji: '⚔️', title: '참교육 시나리오', subtitle: '나를 빡치게 하면 겪게 될 참교육 시나리오', gradient: 'linear-gradient(135deg, #0D0D1A, #0A0A3D)', darkGradient: 'linear-gradient(180deg, #06060D, #0D0D1A, #0A0A3D)', accentColor: '#7C4DFF', thumbnailBg: '#0D0D1A' },
    { id: 'energy-vampire', emoji: '🧛', title: '에너지 뱀파이어', subtitle: '내 인생에서 당장 쳐내야 할 에너지 뱀파이어 기질', gradient: 'linear-gradient(135deg, #1A0D1A, #3D0A2D)', darkGradient: 'linear-gradient(180deg, #0D060D, #1A0D1A, #3D0A2D)', accentColor: '#B388FF', thumbnailBg: '#1A0D1A' },

    // ── 돈과 타락한 자본주의 ──
    { id: 'rich-madness', emoji: '💰', title: '벼락부자 미친짓', subtitle: '벼락부자가 된다면 가장 먼저 저지를 미친 짓', gradient: 'linear-gradient(135deg, #1A1708, #4D3D0A)', darkGradient: 'linear-gradient(180deg, #0D0E04, #1A1708, #4D3D0A)', accentColor: '#FFD740', thumbnailBg: '#1A1708' },
    { id: 'spending-pattern', emoji: '🕳️', title: '지출 블랙홀', subtitle: '내 지갑을 거덜 내는 가장 어이없는 지출 패턴', gradient: 'linear-gradient(135deg, #0D1A17, #0A3D2D)', darkGradient: 'linear-gradient(180deg, #060D0B, #0D1A17, #0A3D2D)', accentColor: '#64FFDA', thumbnailBg: '#0D1A17' },
    { id: 'scam-talent', emoji: '🦊', title: '사기캐 기질', subtitle: '합법적으로 남의 돈을 긁어모으는 타고난 사기캐 기질', gradient: 'linear-gradient(135deg, #1A0D08, #3D1A0A)', darkGradient: 'linear-gradient(180deg, #0D0604, #1A0D08, #3D1A0A)', accentColor: '#FF9E80', thumbnailBg: '#1A0D08' },
    { id: 'benz-probability', emoji: '🚗', title: '벤츠 확률', subtitle: '이번 생에 벤츠 끌고 다닐 확률과 그 이유', gradient: 'linear-gradient(135deg, #0D0D1A, #1A1A3D)', darkGradient: 'linear-gradient(180deg, #06060D, #0D0D1A, #1A1A3D)', accentColor: '#B0BEC5', thumbnailBg: '#0D0D1A' },
    { id: 'broke-survival', emoji: '🪙', title: '통장 바닥 생존기', subtitle: '통장 잔고 바닥날 때 튀어나오는 생존 본능', gradient: 'linear-gradient(135deg, #1A170D, #3D2D0A)', darkGradient: 'linear-gradient(180deg, #0D0E06, #1A170D, #3D2D0A)', accentColor: '#FFCC80', thumbnailBg: '#1A170D' },

    // ── 오컬트와 세계관 과몰입 ──
    { id: 'guillotine-sin', emoji: '🪓', title: '단두대 죄목', subtitle: '전생에 단두대에서 처형당했던 진짜 죄목', gradient: 'linear-gradient(135deg, #1A0A0A, #3D1111)', darkGradient: 'linear-gradient(180deg, #0D0505, #1A0A0A, #3D1111)', accentColor: '#EF9A9A', thumbnailBg: '#1A0A0A' },
    { id: 'guardian-demon', emoji: '😈', title: '수호 악마', subtitle: '나를 은밀하게 돕고 있는 수호 악마의 계급과 이름', gradient: 'linear-gradient(135deg, #0D0A1A, #1A0D3D)', darkGradient: 'linear-gradient(180deg, #06051A, #0D0A1A, #1A0D3D)', accentColor: '#B39DDB', thumbnailBg: '#0D0A1A' },
    { id: 'hell-vip', emoji: '🔥', title: 'VIP 형벌 구역', subtitle: '지옥에 떨어지면 배정받을 VIP 형벌 구역', gradient: 'linear-gradient(135deg, #1A0508, #3D0A11)', darkGradient: 'linear-gradient(180deg, #0D0304, #1A0508, #3D0A11)', accentColor: '#FF8A65', thumbnailBg: '#1A0508' },

    // ── 트렌디 신규 15종 ──
    { id: 'kkondae', emoji: '🪫', title: '내 안의 꼰대력', subtitle: '나도 모르게 나오는 라떼 본능 측정', gradient: 'linear-gradient(135deg, #2D2D1A, #4D4D0A)', darkGradient: 'linear-gradient(180deg, #1A1A0D, #2D2D1A, #4D4D0A)', accentColor: '#BCAAA4', thumbnailBg: '#2D2D1A' },
    { id: 'empty-wallet', emoji: '💸', title: '텅장 방어력', subtitle: '내 돈은 대체 어디로 새고 있을까?', gradient: 'linear-gradient(135deg, #0D2D1A, #0A4D2D)', darkGradient: 'linear-gradient(180deg, #061A0D, #0D2D1A, #0A4D2D)', accentColor: '#4DB6AC', thumbnailBg: '#0D2D1A' },
    { id: 'alcoholic-persona', emoji: '🍻', title: '알콜릭 페르소나', subtitle: '술만 마시면 나오는 나의 진짜 텐션', gradient: 'linear-gradient(135deg, #2D1A08, #5C3010)', darkGradient: 'linear-gradient(180deg, #1A0F04, #2D1A08, #5C3010)', accentColor: '#FFB74D', thumbnailBg: '#2D1A08' },
    { id: 'flirting-tier', emoji: '💘', title: '플러팅 티어', subtitle: '나는 폭스인가, 유교걸/보이인가', gradient: 'linear-gradient(135deg, #2D0A20, #5C1142)', darkGradient: 'linear-gradient(180deg, #1A0612, #2D0A20, #5C1142)', accentColor: '#F06292', thumbnailBg: '#2D0A20' },
    { id: 'office-rank', emoji: '⚔️', title: '직장 내 생존 계급', subtitle: '노예, 장군, 왕, 광대 중 나의 포지션은?', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D5C)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D5C)', accentColor: '#9FA8DA', thumbnailBg: '#1A1A2D' },
    { id: 'zombie-survival', emoji: '🧟', title: '좀비 사태 생존력', subtitle: '세상이 망했을 때 나는 며칠이나 버틸까?', gradient: 'linear-gradient(135deg, #0D1A0D, #1A3D1A)', darkGradient: 'linear-gradient(180deg, #060D06, #0D1A0D, #1A3D1A)', accentColor: '#A5D6A7', thumbnailBg: '#0D1A0D' },
    { id: 'anger-gauge', emoji: '🤬', title: '분노 게이지 측정기', subtitle: '나의 버튼을 누르는 최악의 상황은?', gradient: 'linear-gradient(135deg, #3D0A0A, #6B1111)', darkGradient: 'linear-gradient(180deg, #1A0505, #3D0A0A, #6B1111)', accentColor: '#EF5350', thumbnailBg: '#3D0A0A' },
    { id: 'past-animal', emoji: '🐶', title: '전생 동물 찾기', subtitle: '조선시대에 나는 어떤 동물이었을까?', gradient: 'linear-gradient(135deg, #1A2D0D, #2D4D0A)', darkGradient: 'linear-gradient(180deg, #0D1A06, #1A2D0D, #2D4D0A)', accentColor: '#AED581', thumbnailBg: '#1A2D0D' },
    { id: 'battery-personality', emoji: '📱', title: '배터리 성격 테스트', subtitle: '항상 10% vs 항상 90%의 심리', gradient: 'linear-gradient(135deg, #0A1A2D, #0D2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0A1A2D, #0D2D5C)', accentColor: '#42A5F5', thumbnailBg: '#0A1A2D' },
    { id: 'hidden-villain', emoji: '🦹', title: '숨겨진 빌런 찾기', subtitle: '만약 내가 악당이 된다면 어떤 스타일?', gradient: 'linear-gradient(135deg, #1A0D2D, #2D0A5C)', darkGradient: 'linear-gradient(180deg, #0D061A, #1A0D2D, #2D0A5C)', accentColor: '#AB47BC', thumbnailBg: '#1A0D2D' },
    { id: 'ex-overreact', emoji: '💌', title: '환승연애 과몰입', subtitle: 'X를 마주쳤을 때 나의 반응은?', gradient: 'linear-gradient(135deg, #2D0A17, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #5C1130)', accentColor: '#EC407A', thumbnailBg: '#2D0A17' },
    { id: 'burnout-warning', emoji: '🛌', title: '번아웃 직전 경고등', subtitle: '내 멘탈은 지금 얼마나 지쳐있을까?', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D4D)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D4D)', accentColor: '#78909C', thumbnailBg: '#1A1A2D' },
    { id: 'red-flag', emoji: '🚩', title: '인간관계 레드플래그', subtitle: '내가 절대 못 참는 최악의 지인 유형', gradient: 'linear-gradient(135deg, #2D0D0A, #5C1A0A)', darkGradient: 'linear-gradient(180deg, #1A0604, #2D0D0A, #5C1A0A)', accentColor: '#FF7043', thumbnailBg: '#2D0D0A' },
    { id: 'past-job', emoji: '👑', title: '전생의 내 직업', subtitle: '노비, 영의정, 백정, 기생 중 무엇?', gradient: 'linear-gradient(135deg, #2D1A0A, #4D2D08)', darkGradient: 'linear-gradient(180deg, #1A0D05, #2D1A0A, #4D2D08)', accentColor: '#D4A574', thumbnailBg: '#2D1A0A' },
    { id: 'mbti-reversal', emoji: '🃏', title: 'MBTI 반전 테스트', subtitle: '겉보기와 다른 나의 진짜 혐성', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#64B5F6', thumbnailBg: '#0D1A2D' },

    // ── 트렌디 신규 20종 (Vol.2) ──
    { id: 'mara-factbomb', emoji: '🌶️', title: '마라맛 팩폭 성격', subtitle: '뼈 때리는 나의 진짜 성격', gradient: 'linear-gradient(135deg, #3D0A0A, #7A1111)', darkGradient: 'linear-gradient(180deg, #1A0505, #3D0A0A, #7A1111)', accentColor: '#FF5722', thumbnailBg: '#3D0A0A' },
    { id: 'gold-spoon', emoji: '🥄', title: '환생 후 금수저 등급', subtitle: '다음 생엔 재벌집 막내아들?', gradient: 'linear-gradient(135deg, #2D2408, #5C4A0A)', darkGradient: 'linear-gradient(180deg, #1A1504, #2D2408, #5C4A0A)', accentColor: '#FFD700', thumbnailBg: '#2D2408' },
    { id: 'cringe-generator', emoji: '🤦‍♀️', title: '흑역사 생성기', subtitle: '내가 이불킥 하는 가장 큰 이유는?', gradient: 'linear-gradient(135deg, #2D1A2D, #5C2D5C)', darkGradient: 'linear-gradient(180deg, #1A0D1A, #2D1A2D, #5C2D5C)', accentColor: '#CE93D8', thumbnailBg: '#2D1A2D' },
    { id: 'first-impression-color', emoji: '🎨', title: '첫인상 컬러 진단', subtitle: '인간 웜톤 vs 인간 쿨톤', gradient: 'linear-gradient(135deg, #1A2D2D, #0A5C5C)', darkGradient: 'linear-gradient(180deg, #0D1A1A, #1A2D2D, #0A5C5C)', accentColor: '#4DD0E1', thumbnailBg: '#1A2D2D' },
    { id: 'past-enemy', emoji: '⚔️', title: '전생의 철천지원수', subtitle: '나를 괴롭혔던 그놈의 정체', gradient: 'linear-gradient(135deg, #1A0A0D, #3D111A)', darkGradient: 'linear-gradient(180deg, #0D0506, #1A0A0D, #3D111A)', accentColor: '#E57373', thumbnailBg: '#1A0A0D' },
    { id: 'island-role', emoji: '🏝️', title: '무인도 조난 역할', subtitle: '리더, 식량담당, 짐덩이?', gradient: 'linear-gradient(135deg, #0A2D1A, #0D5C2D)', darkGradient: 'linear-gradient(180deg, #061A0D, #0A2D1A, #0D5C2D)', accentColor: '#81C784', thumbnailBg: '#0A2D1A' },
    { id: 'scam-victim', emoji: '💸', title: '호구 당할 확률', subtitle: '나의 팔랑귀 지수는 몇 %?', gradient: 'linear-gradient(135deg, #2D2D0D, #5C5C0A)', darkGradient: 'linear-gradient(180deg, #1A1A06, #2D2D0D, #5C5C0A)', accentColor: '#FFF176', thumbnailBg: '#2D2D0D' },
    { id: 'mental-age', emoji: '🧠', title: '멘탈 실제 나이', subtitle: '유리멘탈 vs 강철멘탈', gradient: 'linear-gradient(135deg, #0D1A2D, #1A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #1A2D5C)', accentColor: '#7986CB', thumbnailBg: '#0D1A2D' },
    { id: 'attention-seeker', emoji: '📢', title: '잠재적 관종력', subtitle: '내 안의 스포트라이트 욕망', gradient: 'linear-gradient(135deg, #2D0D2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0D2D, #5C0A5C)', accentColor: '#E040FB', thumbnailBg: '#2D0D2D' },
    { id: 'crush-success', emoji: '💘', title: '짝사랑 성공 확률', subtitle: '이 사랑, 이루어질 수 있을까?', gradient: 'linear-gradient(135deg, #2D0A1A, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A1A, #5C1130)', accentColor: '#F48FB1', thumbnailBg: '#2D0A1A' },
    { id: 'past-sin', emoji: '⛓️', title: '전생에 내가 지은 죄', subtitle: '대체 무슨 죄를 지었길래', gradient: 'linear-gradient(135deg, #1A1A1A, #3D3D3D)', darkGradient: 'linear-gradient(180deg, #0D0D0D, #1A1A1A, #3D3D3D)', accentColor: '#BDBDBD', thumbnailBg: '#1A1A1A' },
    { id: 'stress-cure', emoji: '🧘', title: '찰떡 스트레스 해소법', subtitle: '먹방 vs 수면 vs 오열', gradient: 'linear-gradient(135deg, #0D2D2D, #0A4D4D)', darkGradient: 'linear-gradient(180deg, #061A1A, #0D2D2D, #0A4D4D)', accentColor: '#80CBC4', thumbnailBg: '#0D2D2D' },
    { id: 'destiny-place', emoji: '📍', title: '운명의 상대 만날 장소', subtitle: '어디로 가야 그 사람을 만날까', gradient: 'linear-gradient(135deg, #2D1A0D, #5C300A)', darkGradient: 'linear-gradient(180deg, #1A0D06, #2D1A0D, #5C300A)', accentColor: '#FFAB91', thumbnailBg: '#2D1A0D' },
    { id: 'office-villain', emoji: '😈', title: '회사 내 빌런 지수', subtitle: '나도 혹시 맑은 눈의 광인?', gradient: 'linear-gradient(135deg, #0D0D2D, #1A1A5C)', darkGradient: 'linear-gradient(180deg, #06061A, #0D0D2D, #1A1A5C)', accentColor: '#5C6BC0', thumbnailBg: '#0D0D2D' },
    { id: 'next-life-country', emoji: '✈️', title: '다음 생에 태어날 나라', subtitle: '한국 탈출 가능?', gradient: 'linear-gradient(135deg, #0A2D2D, #0D4D5C)', darkGradient: 'linear-gradient(180deg, #061A1A, #0A2D2D, #0D4D5C)', accentColor: '#4FC3F7', thumbnailBg: '#0A2D2D' },
    { id: 'lotto-reaction', emoji: '💰', title: '로또 1등 당첨 시 행동', subtitle: '퇴사부터? 집부터?', gradient: 'linear-gradient(135deg, #2D2D0A, #5C5C11)', darkGradient: 'linear-gradient(180deg, #1A1A05, #2D2D0A, #5C5C11)', accentColor: '#FFEE58', thumbnailBg: '#2D2D0A' },
    { id: 'emoji-summary', emoji: '🤪', title: '병맛 이모지 진단', subtitle: '내 인생을 요약한다면', gradient: 'linear-gradient(135deg, #2D1A0A, #5C2D11)', darkGradient: 'linear-gradient(180deg, #1A0D05, #2D1A0A, #5C2D11)', accentColor: '#FFB300', thumbnailBg: '#2D1A0A' },
    { id: 'social-radar', emoji: '👀', title: '눈치코치 진단', subtitle: '나는 낄끼빠빠의 고수인가', gradient: 'linear-gradient(135deg, #1A2D1A, #2D5C2D)', darkGradient: 'linear-gradient(180deg, #0D1A0D, #1A2D1A, #2D5C2D)', accentColor: '#66BB6A', thumbnailBg: '#1A2D1A' },
    { id: 'love-cell', emoji: '🦠', title: '연애 세포 생존 여부', subtitle: '내 연애 세포는 혹시 혼수상태?', gradient: 'linear-gradient(135deg, #2D0A2D, #5C115C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0A2D, #5C115C)', accentColor: '#BA68C8', thumbnailBg: '#2D0A2D' },
    { id: 'fallen-angel', emoji: '👼', title: '타락 천사 진단', subtitle: '내 안의 숨겨진 타락 본능', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D5C)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D5C)', accentColor: '#B39DDB', thumbnailBg: '#1A1A2D' },

    // ── B급 감성 극강 팩폭 20종 ──
    { id: 'trash-magnet', emoji: '🗑️', title: '인간 쓰레기통 감별기', subtitle: '왜 내 주변엔 똥파리만 꼬일까?', gradient: 'linear-gradient(135deg, #2D2D2D, #1A1A1A)', darkGradient: 'linear-gradient(180deg, #111111, #2D2D2D, #1A1A1A)', accentColor: '#8D6E63', thumbnailBg: '#2D2D2D' },
    { id: 'greed-meter', emoji: '🤑', title: '속물지수 1000%', subtitle: '돈 앞에서 얼마나 비굴해질 수 있나?', gradient: 'linear-gradient(135deg, #2D2D08, #5C5C00)', darkGradient: 'linear-gradient(180deg, #1A1A04, #2D2D08, #5C5C00)', accentColor: '#C6FF00', thumbnailBg: '#2D2D08' },
    { id: 'gossip-speed', emoji: '🤐', title: '입 싼 속도 측정기', subtitle: '비밀을 몇 분 만에 퍼뜨릴까?', gradient: 'linear-gradient(135deg, #2D0D1A, #5C0A2D)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0D1A, #5C0A2D)', accentColor: '#FF4081', thumbnailBg: '#2D0D1A' },
    { id: 'keyboard-warrior', emoji: '🤡', title: '방구석 여포 진단서', subtitle: '온라인과 현실의 찌질한 갭 차이', gradient: 'linear-gradient(135deg, #1A2D0D, #0A5C1A)', darkGradient: 'linear-gradient(180deg, #0D1A06, #1A2D0D, #0A5C1A)', accentColor: '#76FF03', thumbnailBg: '#1A2D0D' },
    { id: 'life-waste', emoji: '🧻', title: '인생 가성비 똥망 진단', subtitle: '나는 내 인생을 얼마나 낭비하나?', gradient: 'linear-gradient(135deg, #2D2D1A, #5C5C2D)', darkGradient: 'linear-gradient(180deg, #1A1A0D, #2D2D1A, #5C5C2D)', accentColor: '#D7CCC8', thumbnailBg: '#2D2D1A' },
    { id: 'snake-or-fool', emoji: '🐍', title: '앞통수 vs 뒤통수', subtitle: '뱀새끼인가, 순진한 호구인가?', gradient: 'linear-gradient(135deg, #0D2D0D, #0A5C0A)', darkGradient: 'linear-gradient(180deg, #061A06, #0D2D0D, #0A5C0A)', accentColor: '#00E676', thumbnailBg: '#0D2D0D' },
    { id: 'shortform-addict', emoji: '💊', title: '숏폼 중독 말기 판정', subtitle: '릴스 압수당하면 며칠이나 살까?', gradient: 'linear-gradient(135deg, #2D0A2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0A2D, #5C0A5C)', accentColor: '#D500F9', thumbnailBg: '#2D0A2D' },
    { id: 'ex-wedding', emoji: '💣', title: '전 연인 결혼식 시뮬레이터', subtitle: '초대장 받았을 때 나의 대처법', gradient: 'linear-gradient(135deg, #2D1A1A, #5C2D2D)', darkGradient: 'linear-gradient(180deg, #1A0D0D, #2D1A1A, #5C2D2D)', accentColor: '#FF1744', thumbnailBg: '#2D1A1A' },
    { id: 'fox-wolf', emoji: '🦊', title: '여우짓/늑대짓 판독기', subtitle: '내 안의 역겨운 플러팅 본능', gradient: 'linear-gradient(135deg, #2D1708, #5C2D0A)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1708, #5C2D0A)', accentColor: '#FF6D00', thumbnailBg: '#2D1708' },
    { id: 'braindead', emoji: '🦍', title: '뇌 빼고 사는 유인원 지수', subtitle: '생각이란 걸 하고 사는가?', gradient: 'linear-gradient(135deg, #1A1A0D, #2D2D1A)', darkGradient: 'linear-gradient(180deg, #0D0D06, #1A1A0D, #2D2D1A)', accentColor: '#A1887F', thumbnailBg: '#1A1A0D' },
    { id: 'self-esteem-drill', emoji: '📉', title: '자존감 지하 암반수', subtitle: '내 멘탈은 어느 바닥을 뚫고 있나?', gradient: 'linear-gradient(135deg, #0D0D2D, #0A0A5C)', darkGradient: 'linear-gradient(180deg, #06061A, #0D0D2D, #0A0A5C)', accentColor: '#536DFE', thumbnailBg: '#0D0D2D' },
    { id: 'bs-artist', emoji: '🤥', title: '입벌구 허세력', subtitle: '습관적으로 치는 뻥의 스케일', gradient: 'linear-gradient(135deg, #2D1A2D, #5C2D5C)', darkGradient: 'linear-gradient(180deg, #1A0D1A, #2D1A2D, #5C2D5C)', accentColor: '#E040FB', thumbnailBg: '#2D1A2D' },
    { id: 'rage-spending', emoji: '💳', title: '시발비용 파산 직전', subtitle: '스트레스를 돈으로 푸는 무지성 소비', gradient: 'linear-gradient(135deg, #2D2D0D, #4D4D0A)', darkGradient: 'linear-gradient(180deg, #1A1A06, #2D2D0D, #4D4D0A)', accentColor: '#EEFF41', thumbnailBg: '#2D2D0D' },
    { id: 'bright-psycho', emoji: '👽', title: '맑은 눈의 광인', subtitle: '맑은 눈 vs 탁한 눈, 진짜 미친 똘기', gradient: 'linear-gradient(135deg, #0D2D2D, #0A5C5C)', darkGradient: 'linear-gradient(180deg, #061A1A, #0D2D2D, #0A5C5C)', accentColor: '#18FFFF', thumbnailBg: '#0D2D2D' },
    { id: 'drunk-disgrace', emoji: '🤮', title: '최악의 술주정 관상', subtitle: '술만 먹으면 멍멍이가 되는 포인트', gradient: 'linear-gradient(135deg, #2D170D, #5C2D0A)', darkGradient: 'linear-gradient(180deg, #1A0D06, #2D170D, #5C2D0A)', accentColor: '#FF9100', thumbnailBg: '#2D170D' },
    { id: 'stubborn-ranking', emoji: '🏆', title: '쓸데없는 똥고집 랭킹', subtitle: '나혼자 우기는 분야 TOP3', gradient: 'linear-gradient(135deg, #2D2D0A, #5C5C1A)', darkGradient: 'linear-gradient(180deg, #1A1A05, #2D2D0A, #5C5C1A)', accentColor: '#FFD600', thumbnailBg: '#2D2D0A' },
    { id: 'blue-tick-obsess', emoji: '🔕', title: '읽씹 vs 안읽씹 찌질함', subtitle: '연락 안 올 때 나의 추악한 집착', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#448AFF', thumbnailBg: '#0D1A2D' },
    { id: 'resign-threshold', emoji: '🏢', title: '사표 던질 임계점', subtitle: '내 분노는 언제 폭발할까?', gradient: 'linear-gradient(135deg, #1A1A1A, #3D3D3D)', darkGradient: 'linear-gradient(180deg, #0D0D0D, #1A1A1A, #3D3D3D)', accentColor: '#B0BEC5', thumbnailBg: '#1A1A1A' },
    { id: 'mirror-factbomb', emoji: '🪞', title: '거울치료 팩폭기', subtitle: '남들이 절대 말 안 해주는 내 단점', gradient: 'linear-gradient(135deg, #2D2D2D, #4D4D4D)', darkGradient: 'linear-gradient(180deg, #1A1A1A, #2D2D2D, #4D4D4D)', accentColor: '#E0E0E0', thumbnailBg: '#2D2D2D' },
    { id: 'teamwork-parasite', emoji: '🧟', title: '팀플 기생충 계급', subtitle: '꿀벌인가, 피 빨아먹는 거머리인가?', gradient: 'linear-gradient(135deg, #0D2D1A, #0A5C2D)', darkGradient: 'linear-gradient(180deg, #061A0D, #0D2D1A, #0A5C2D)', accentColor: '#69F0AE', thumbnailBg: '#0D2D1A' },

    // ── 어른의 연애 & 도파민 20종 ──
    { id: 'inner-devil', emoji: '💋', title: '내 안의 음란마귀 지수', subtitle: '퓨어 영혼 vs 타락 악마', gradient: 'linear-gradient(135deg, #3D0A1A, #6B0A2D)', darkGradient: 'linear-gradient(180deg, #1A050D, #3D0A1A, #6B0A2D)', accentColor: '#FF1744', thumbnailBg: '#3D0A1A' },
    { id: 'day-night-switch', emoji: '😈', title: '낮져밤이 vs 낮이밤져', subtitle: '나의 연애 주도권 스타일', gradient: 'linear-gradient(135deg, #1A0D2D, #2D0A5C)', darkGradient: 'linear-gradient(180deg, #0D061A, #1A0D2D, #2D0A5C)', accentColor: '#7C4DFF', thumbnailBg: '#1A0D2D' },
    { id: 'skinship-tension', emoji: '⚡', title: '스킨십 텐션 판독기', subtitle: '내가 가장 약해지는 치명적 포인트', gradient: 'linear-gradient(135deg, #2D0D0D, #5C1A1A)', darkGradient: 'linear-gradient(180deg, #1A0606, #2D0D0D, #5C1A1A)', accentColor: '#FF5252', thumbnailBg: '#2D0D0D' },
    { id: 'drunk-flirt', emoji: '🥂', title: '술자리 플러팅 유죄 인간', subtitle: '술만 들어가면 나오는 여우/늑대 본능', gradient: 'linear-gradient(135deg, #2D1A08, #5C3010)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1A08, #5C3010)', accentColor: '#FFD740', thumbnailBg: '#2D1A08' },
    { id: 'fatal-attraction', emoji: '🕷️', title: '파멸적 끌림 테스트', subtitle: '내가 환장하는 나쁜 이성 유형', gradient: 'linear-gradient(135deg, #0D0D1A, #1A1A3D)', darkGradient: 'linear-gradient(180deg, #06060D, #0D0D1A, #1A1A3D)', accentColor: '#B388FF', thumbnailBg: '#0D0D1A' },
    { id: 'possessive-player', emoji: '⛓️', title: '구속 플레이어 지수', subtitle: '연인의 모든 걸 통제하고 싶은 본능', gradient: 'linear-gradient(135deg, #1A1A1A, #3D3D3D)', darkGradient: 'linear-gradient(180deg, #0D0D0D, #1A1A1A, #3D3D3D)', accentColor: '#90A4AE', thumbnailBg: '#1A1A1A' },
    { id: 'office-romance', emoji: '🤫', title: '사내연애 생존율', subtitle: '들키면 끝장! 비밀 연애 스킬', gradient: 'linear-gradient(135deg, #0D1A2D, #1A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #1A2D5C)', accentColor: '#448AFF', thumbnailBg: '#0D1A2D' },
    { id: 'love-expiry', emoji: '💔', title: '연애 유통기한', subtitle: '나는 얼마나 빨리 질려하는가?', gradient: 'linear-gradient(135deg, #2D0A17, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #5C1130)', accentColor: '#FF4081', thumbnailBg: '#2D0A17' },
    { id: 'fishpond-rank', emoji: '🕸️', title: '어장관리 피라미드', subtitle: '낚는 자인가, 떡밥 무는 물고기인가?', gradient: 'linear-gradient(135deg, #0D2D2D, #0A5C5C)', darkGradient: 'linear-gradient(180deg, #061A1A, #0D2D2D, #0A5C5C)', accentColor: '#26C6DA', thumbnailBg: '#0D2D2D' },
    { id: 'brain-runaway', emoji: '🔞', title: '뇌내망상 폭주 기관차', subtitle: '혼자일 때 하는 가장 위험한 상상', gradient: 'linear-gradient(135deg, #2D0D2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0D2D, #5C0A5C)', accentColor: '#EA80FC', thumbnailBg: '#2D0D2D' },
    { id: 'midnight-hobby', emoji: '🍷', title: '으른의 사생활', subtitle: '밤 11시, 나를 위로하는 은밀한 취미', gradient: 'linear-gradient(135deg, #1A0D1A, #3D1A3D)', darkGradient: 'linear-gradient(180deg, #0D060D, #1A0D1A, #3D1A3D)', accentColor: '#CE93D8', thumbnailBg: '#1A0D1A' },
    { id: 'midnight-text-defense', emoji: '🚨', title: '"자니?" 철벽 방어력', subtitle: '새벽 카톡에 대처하는 나의 자세', gradient: 'linear-gradient(135deg, #2D1A0D, #5C300A)', darkGradient: 'linear-gradient(180deg, #1A0D06, #2D1A0D, #5C300A)', accentColor: '#FF6E40', thumbnailBg: '#2D1A0D' },
    { id: 'hidden-cringe', emoji: '🎭', title: '침대 밑 흑역사', subtitle: '아무도 모르는 수치스러운 과거', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D5C)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D5C)', accentColor: '#9FA8DA', thumbnailBg: '#1A1A2D' },
    { id: 'vampire-charm', emoji: '🧛', title: '뱀파이어 유혹 지수', subtitle: '타인을 홀리는 치명적 매력 포인트', gradient: 'linear-gradient(135deg, #1A0A0A, #3D1111)', darkGradient: 'linear-gradient(180deg, #0D0505, #1A0A0A, #3D1111)', accentColor: '#EF5350', thumbnailBg: '#1A0A0A' },
    { id: 'transfer-love', emoji: '🚩', title: '환승연애 프리패스', subtitle: '환승 당할까, 내가 먼저 갈아탈까?', gradient: 'linear-gradient(135deg, #2D0D0A, #5C1A0A)', darkGradient: 'linear-gradient(180deg, #1A0604, #2D0D0A, #5C1A0A)', accentColor: '#FF7043', thumbnailBg: '#2D0D0A' },
    { id: 'rage-bottom', emoji: '🚬', title: '쌈닭 본능 한계 초과', subtitle: '꼭지 돌았을 때 나오는 밑바닥', gradient: 'linear-gradient(135deg, #2D2D1A, #5C5C2D)', darkGradient: 'linear-gradient(180deg, #1A1A0D, #2D2D1A, #5C5C2D)', accentColor: '#D4E157', thumbnailBg: '#2D2D1A' },
    { id: 'dark-romance', emoji: '🖤', title: '다크 로맨스 흑막 주인공', subtitle: '위험하고 서늘한 내 안의 매력', gradient: 'linear-gradient(135deg, #0D0D0D, #2D2D2D)', darkGradient: 'linear-gradient(180deg, #060606, #0D0D0D, #2D2D2D)', accentColor: '#B0BEC5', thumbnailBg: '#0D0D0D' },
    { id: 'sns-stalker', emoji: '🎣', title: 'SNS 염탐꾼 지수', subtitle: 'X의 인스타 하루 몇 번 들어갈까?', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#40C4FF', thumbnailBg: '#0D1A2D' },
    { id: 'first-spark', emoji: '💋', title: '첫 만남 스파크 진단기', subtitle: '사랑에 빠지기까지 걸리는 시간', gradient: 'linear-gradient(135deg, #2D0A20, #5C1142)', darkGradient: 'linear-gradient(180deg, #1A0612, #2D0A20, #5C1142)', accentColor: '#F50057', thumbnailBg: '#2D0A20' },
    { id: 'weird-perfectionist', emoji: '🤫', title: '변태적 완벽주의', subtitle: '남들은 이해 못 하는 이상한 집착', gradient: 'linear-gradient(135deg, #1A2D1A, #2D5C2D)', darkGradient: 'linear-gradient(180deg, #0D1A0D, #1A2D1A, #2D5C2D)', accentColor: '#69F0AE', thumbnailBg: '#1A2D1A' },

    // ── 도파민 폭발 극강 자극 20종 ──
    { id: 'ex-sns-stalking', emoji: '📱', title: '전여친/전남친 SNS 염탐 중독성', subtitle: '나의 찌질함은 어느 정도?', gradient: 'linear-gradient(135deg, #1A0D2D, #3D1A5C)', darkGradient: 'linear-gradient(180deg, #0D061A, #1A0D2D, #3D1A5C)', accentColor: '#B388FF', thumbnailBg: '#1A0D2D' },
    { id: 'flirt-defense', emoji: '🦊', title: '여우짓 방어력 테스트', subtitle: '나는 철벽인가, 쉬운 호구인가?', gradient: 'linear-gradient(135deg, #2D1A08, #5C3010)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1A08, #5C3010)', accentColor: '#FFD740', thumbnailBg: '#2D1A08' },
    { id: 'money-therapy', emoji: '💸', title: '금융치료 필요도 진단', subtitle: '우울한 게 아니라 돈이 없는 거다', gradient: 'linear-gradient(135deg, #0D2D1A, #0A5C2D)', darkGradient: 'linear-gradient(180deg, #061A0D, #0D2D1A, #0A5C2D)', accentColor: '#69F0AE', thumbnailBg: '#0D2D1A' },
    { id: 'pro-buzzkill', emoji: '🤬', title: '프로불편러 지수', subtitle: '혹시 진상 손님? 프로악플러?', gradient: 'linear-gradient(135deg, #2D0D0A, #5C1A0A)', darkGradient: 'linear-gradient(180deg, #1A0604, #2D0D0A, #5C1A0A)', accentColor: '#FF7043', thumbnailBg: '#2D0D0A' },
    { id: 'bed-hermit', emoji: '🛌', title: '방구석 생존 등급', subtitle: '침대 밖은 위험해!', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D5C)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D5C)', accentColor: '#9FA8DA', thumbnailBg: '#1A1A2D' },
    { id: 'breakup-karma', emoji: '💔', title: '환승이별 가해자 vs 피해자', subtitle: '차이는 쪽? 갈아타는 쪽?', gradient: 'linear-gradient(135deg, #2D0A17, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #5C1130)', accentColor: '#FF4081', thumbnailBg: '#2D0A17' },
    { id: 'cool-syndrome', emoji: '🤡', title: '쿨병 말기 진단', subtitle: '겉으론 쿨, 속으론 오열 중', gradient: 'linear-gradient(135deg, #0D1A2D, #1A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #1A2D5C)', accentColor: '#448AFF', thumbnailBg: '#0D1A2D' },
    { id: 'drunk-skinship', emoji: '🍻', title: '술자리 스킨십 허용 범위', subtitle: '술기운을 빌린 위험한 본능', gradient: 'linear-gradient(135deg, #2D1A08, #5C3010)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1A08, #5C3010)', accentColor: '#FFB74D', thumbnailBg: '#2D1A08' },
    { id: 'search-history', emoji: '🤫', title: '검색기록 유형 판독기', subtitle: '폰이 털린다면?', gradient: 'linear-gradient(135deg, #2D0D2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0D2D, #5C0A5C)', accentColor: '#EA80FC', thumbnailBg: '#2D0D2D' },
    { id: 'selective-rage', emoji: '💣', title: '강약약강 분노 판독기', subtitle: '분노조절장애 vs 선택적 분노조절', gradient: 'linear-gradient(135deg, #2D0D0D, #5C1A1A)', darkGradient: 'linear-gradient(180deg, #1A0606, #2D0D0D, #5C1A1A)', accentColor: '#FF5252', thumbnailBg: '#2D0D0D' },
    { id: 'narcissist-mirror', emoji: '🪞', title: '나르시시스트 거울 테스트', subtitle: '나 자신과 사랑에 빠진 병적 자아', gradient: 'linear-gradient(135deg, #1A0A0A, #3D1111)', darkGradient: 'linear-gradient(180deg, #0D0505, #1A0A0A, #3D1111)', accentColor: '#EF5350', thumbnailBg: '#1A0A0A' },
    { id: 'ice-cold-t', emoji: '🩸', title: 'T 성향 극한 진단', subtitle: '소시오패스와 T의 경계선', gradient: 'linear-gradient(135deg, #0D0D1A, #1A1A3D)', darkGradient: 'linear-gradient(180deg, #06060D, #0D0D1A, #1A1A3D)', accentColor: '#B388FF', thumbnailBg: '#0D0D1A' },
    { id: 'trash-magnet-love', emoji: '🐶', title: '호구 연애사 판독기', subtitle: '왜 나만 항상 쓰레기를 만날까?', gradient: 'linear-gradient(135deg, #2D1A0D, #5C300A)', darkGradient: 'linear-gradient(180deg, #1A0D06, #2D1A0D, #5C300A)', accentColor: '#FF6E40', thumbnailBg: '#2D1A0D' },
    { id: 'credit-card-madness', emoji: '💳', title: '빚넘기기 지수', subtitle: '신용카드 폭주 기관차', gradient: 'linear-gradient(135deg, #0D2D2D, #0A5C5C)', darkGradient: 'linear-gradient(180deg, #061A1A, #0D2D2D, #0A5C5C)', accentColor: '#26C6DA', thumbnailBg: '#0D2D2D' },
    { id: 'fake-smile', emoji: '🎭', title: '가짜 웃음 판독기', subtitle: '자본주의 미소의 소름 돋는 진실', gradient: 'linear-gradient(135deg, #1A1A1A, #3D3D3D)', darkGradient: 'linear-gradient(180deg, #0D0D0D, #1A1A1A, #3D3D3D)', accentColor: '#B0BEC5', thumbnailBg: '#1A1A1A' },
    { id: 'mara-sexual-tension', emoji: '🌶️', title: '마라맛 섹슈얼 텐션', subtitle: '숨겨진 치명적 매력 진단', gradient: 'linear-gradient(135deg, #3D0A1A, #6B0A2D)', darkGradient: 'linear-gradient(180deg, #1A050D, #3D0A1A, #6B0A2D)', accentColor: '#FF1744', thumbnailBg: '#3D0A1A' },
    { id: 'weirdo-magnet', emoji: '🚷', title: '진상 컬렉션', subtitle: '왜 내 주변엔 이상한 사람만?', gradient: 'linear-gradient(135deg, #2D2D1A, #5C5C2D)', darkGradient: 'linear-gradient(180deg, #1A1A0D, #2D2D1A, #5C5C2D)', accentColor: '#D4E157', thumbnailBg: '#2D2D1A' },
    { id: 'group-chat-type', emoji: '💬', title: '단톡방 눈팅 vs 지배자', subtitle: '읽씹러인가, 투머치토커인가?', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#40C4FF', thumbnailBg: '#0D1A2D' },
    { id: 'brain-no-filter', emoji: '🧠', title: '뇌 필터링 고장 지수', subtitle: '생각 없이 막말하는 습관', gradient: 'linear-gradient(135deg, #2D0D2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0D2D, #5C0A5C)', accentColor: '#CE93D8', thumbnailBg: '#2D0D2D' },
    { id: 'angel-mask-trash', emoji: '👼', title: '천사 가면 쓰레기 판독기', subtitle: '착한 척하지만 속은 시커먼 나', gradient: 'linear-gradient(135deg, #1A2D1A, #2D5C2D)', darkGradient: 'linear-gradient(180deg, #0D1A0D, #1A2D1A, #2D5C2D)', accentColor: '#69F0AE', thumbnailBg: '#1A2D1A' },

    // ── Vol.5: 마라맛 극강 40종 ── (자동 병합)
    ...SNACK_TESTS_VOL5,
];

export interface SnackContent {
    title: string;
    body: string | string[];
    insight?: string;  // 추가 해석 — 더 깊은 분석
}

import { GeneratedSnackLibrary } from './generated-snack-library';

// ~9 x 9 tests
export const SnackContentLibrary: Record<string, Record<number, SnackContent>> = GeneratedSnackLibrary;
