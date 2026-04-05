/**
 * 스낵 테스트 Vol.5 — 마라맛 극강 40종
 *
 * 기존 120종과 중복 크로스체크 완료.
 * 겹치는 주제는 완전히 다른 B급 각도로 각색됨.
 *
 * 중복 각색 기록:
 *   #1  사기꾼 기질 → 기존 scam-talent, bs-artist와 겹침 → "중고거래 진상력" 으로 피벗
 *   #2  환승이별 → 기존 breakup-karma, transfer-love 겹침 → "썸 유통기한 판독기"로 피벗
 *   #3  뒷담화 전파력 → 기존 behind-talk, gossip-speed 겹침 → "TMI 폭격기 지수"로 피벗
 *   #5  전애인 축의금 → 기존 ex-wedding 겹침 → "전애인 연락 오면 테스트"로 피벗
 *   #6  SNS 허세충 → 기존 sns-stalker 겹침 → "인스타 허세 연출력"으로 피벗
 *   #7  감정 쓰레기통 → 기존 trash-magnet 겹침 → "감정 슬레이브 판독기"로 피벗
 *   #8  팩폭 살인마 → 기존 factbomb, mara-factbomb 겹침 → "민폐력 레이더"로 피벗
 *   #9  도파민 중독 → 기존 shortform-addict 겹침 → "야식 중독 말기 진단"으로 피벗
 *   #10 사이버 스토커 → 기존 sns-stalker 겹침 → "타인의 폰 훔쳐보기 충동"으로 피벗
 *   #11 관종 본능 → 기존 attention-seeker 겹침 → "주목받고 싶은 병 말기"로 피벗 → "댓글 분노 내성"으로 최종 피벗
 *   #12 꼰대 진화 → 기존 kkondae 겹침 → "MZ세대 vs 라떼세대 전투력"으로 피벗
 *   #13 자본주의 괴물 → 기존 greed-meter 겹침 → "내가 CEO면 얼마나 사악할까"로 피벗
 *   #14 쏘시오패스 → 기존 ice-cold-t 겹침 → "공감능력 제로 판독기"로 피벗
 *   #16 합법적 똘기 → 기존 drunk-mode 등 겹침 → "맨정신 미친짓 내역"으로 피벗
 *   #17 어장관리 수족관 → 기존 fishpond-rank 겹침 → "고백 타이밍 계산기"로 피벗
 *   #20 시발비용 파산 → 기존 rage-spending 완전 중복 → "택시비 분노게이지"로 피벗
 *   #22 나만 쓰레기야 → 기존 trash-magnet, angel-mask-trash → "도덕적 회색지대 판독기"로 피벗
 *   #24 지옥행 하이패스 → 기존 hell-vip 겹침 → "천국 입장 거부 사유서"로 피벗
 *   #25 무리수 플러팅 → 기존 fatal-flirt, flirting-tier 겹침 → "DM 슬라이드 성공률"로 피벗
 *   #26 나르시시즘 → 기존 narcissist-mirror 겹침 → "셀카 중독 자아도취 판정"으로 피벗
 *   #27 감정 뱀파이어 → 기존 energy-vampire 겹침 → "인간 블랙홀 흡수력"으로 피벗
 *   #30 무의식 꼰대 → 기존 kkondae 겹침 → "나도 모르게 쓰는 아재개그 빈도"로 피벗
 *   #34 연애 권력자 → 기존 possessive-player 겹침 → "연애 중 갑을관계 포지션"으로 피벗
 *   #37 카톡 읽씹 → 기존 blue-tick-obsess 겹침 → "답장 속도로 보는 관심도"로 피벗
 *   #38 흑역사 박제 → 기존 cringe-generator, hidden-cringe 겹침 → "디지털 발자국 공포"로 피벗
 *   #40 겉바속바 → 기존 cool-syndrome 겹침 → "인간 복어 팽창 지수"로 피벗
 */

import type { SnackTest } from './snack-tests';

export const SNACK_TESTS_VOL5: SnackTest[] = [
    // ── 1~10 ──
    { id: 'secondhand-jerk', emoji: '📦', title: '중고거래 진상력', subtitle: '에눌 가능한가요? 네고충의 극한', gradient: 'linear-gradient(135deg, #2D2D0D, #5C5C1A)', darkGradient: 'linear-gradient(180deg, #1A1A06, #2D2D0D, #5C5C1A)', accentColor: '#FFD600', thumbnailBg: '#2D2D0D' },
    { id: 'talking-stage-expiry', emoji: '⏳', title: '썸 유통기한 판독기', subtitle: '이 썸은 얼마나 오래 갈까?', gradient: 'linear-gradient(135deg, #2D0A20, #5C1142)', darkGradient: 'linear-gradient(180deg, #1A0612, #2D0A20, #5C1142)', accentColor: '#F06292', thumbnailBg: '#2D0A20' },
    { id: 'tmi-bomber', emoji: '💬', title: 'TMI 폭격기 지수', subtitle: '아무도 안 물어봤는데 다 말하는 습관', gradient: 'linear-gradient(135deg, #1A2D0D, #2D5C1A)', darkGradient: 'linear-gradient(180deg, #0D1A06, #1A2D0D, #2D5C1A)', accentColor: '#AED581', thumbnailBg: '#1A2D0D' },
    { id: 'ghost-breakup', emoji: '👻', title: '잠수 이별러 판독기', subtitle: '읽씹 후 증발하는 나의 비겁한 끝맺음 스타일', gradient: 'linear-gradient(135deg, #0D0D2D, #1A1A5C)', darkGradient: 'linear-gradient(180deg, #06061A, #0D0D2D, #1A1A5C)', accentColor: '#7986CB', thumbnailBg: '#0D0D2D' },
    { id: 'ex-callback', emoji: '📞', title: '전애인 연락 오면 테스트', subtitle: '무시? 설렘? 스크린샷?', gradient: 'linear-gradient(135deg, #2D1A1A, #5C2D2D)', darkGradient: 'linear-gradient(180deg, #1A0D0D, #2D1A1A, #5C2D2D)', accentColor: '#EF9A9A', thumbnailBg: '#2D1A1A' },
    { id: 'insta-flex', emoji: '📸', title: '인스타 허세 연출력', subtitle: '내 피드는 허구 몇 %인가?', gradient: 'linear-gradient(135deg, #2D0D2D, #5C1A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0D2D, #5C1A5C)', accentColor: '#E040FB', thumbnailBg: '#2D0D2D' },
    { id: 'emotion-slave', emoji: '⛓️', title: '감정 슬레이브 판독기', subtitle: '타인의 기분에 끌려다니는 감정 노예 지수', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D5C)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D5C)', accentColor: '#9FA8DA', thumbnailBg: '#1A1A2D' },
    { id: 'nuisance-radar', emoji: '📡', title: '민폐력 레이더', subtitle: '나도 모르게 끼치는 민폐의 반경과 강도', gradient: 'linear-gradient(135deg, #2D0D0A, #5C1A0A)', darkGradient: 'linear-gradient(180deg, #1A0604, #2D0D0A, #5C1A0A)', accentColor: '#FF7043', thumbnailBg: '#2D0D0A' },
    { id: 'midnight-food-addict', emoji: '🍜', title: '야식 중독 말기 진단', subtitle: '새벽 2시, 배달앱을 여는 나의 본능', gradient: 'linear-gradient(135deg, #2D1A08, #5C3010)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1A08, #5C3010)', accentColor: '#FFAB40', thumbnailBg: '#2D1A08' },
    { id: 'phone-peek-urge', emoji: '👀', title: '타인의 폰 훔쳐보기 충동', subtitle: '내 안의 관음증적 호기심 지수', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#40C4FF', thumbnailBg: '#0D1A2D' },

    // ── 11~20 ──
    { id: 'comment-rage', emoji: '🔥', title: '댓글 분노 내성', subtitle: '악플 하나에 하루가 망가지는 나의 멘탈', gradient: 'linear-gradient(135deg, #3D0A0A, #6B1111)', darkGradient: 'linear-gradient(180deg, #1A0505, #3D0A0A, #6B1111)', accentColor: '#FF5252', thumbnailBg: '#3D0A0A' },
    { id: 'mz-vs-latte', emoji: '☕', title: 'MZ vs 라떼 전투력', subtitle: '나의 세대 갈등 유발 지수', gradient: 'linear-gradient(135deg, #2D2D1A, #4D4D0A)', darkGradient: 'linear-gradient(180deg, #1A1A0D, #2D2D1A, #4D4D0A)', accentColor: '#BCAAA4', thumbnailBg: '#2D2D1A' },
    { id: 'evil-ceo', emoji: '🏢', title: '내가 CEO면 얼마나 사악할까', subtitle: '자본주의 최종보스 성향 측정', gradient: 'linear-gradient(135deg, #1A1708, #3D2E0A)', darkGradient: 'linear-gradient(180deg, #0D0E04, #1A1708, #3D2E0A)', accentColor: '#FFD740', thumbnailBg: '#1A1708' },
    { id: 'empathy-zero', emoji: '🧊', title: '공감능력 제로 판독기', subtitle: '남의 눈물 앞에서 무표정한 나의 진실', gradient: 'linear-gradient(135deg, #0D1A2D, #1A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #1A2D5C)', accentColor: '#B0BEC5', thumbnailBg: '#0D1A2D' },
    { id: 'reality-show-role', emoji: '📺', title: '환승연애 출연 시 내 롤', subtitle: '연애 리얼리티에서 나의 캐릭터는?', gradient: 'linear-gradient(135deg, #2D0A17, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #5C1130)', accentColor: '#EC407A', thumbnailBg: '#2D0A17' },
    { id: 'sober-psycho', emoji: '🤪', title: '맨정신 미친짓 내역', subtitle: '술 없이도 벌이는 돌이킬 수 없는 일들', gradient: 'linear-gradient(135deg, #0D2D2D, #0A4D4D)', darkGradient: 'linear-gradient(180deg, #061A1A, #0D2D2D, #0A4D4D)', accentColor: '#18FFFF', thumbnailBg: '#0D2D2D' },
    { id: 'confession-timer', emoji: '⏱️', title: '고백 타이밍 계산기', subtitle: '지금이야, 아니면 영원히 기회를 놓치거나', gradient: 'linear-gradient(135deg, #2D0A1A, #5C1130)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A1A, #5C1130)', accentColor: '#F48FB1', thumbnailBg: '#2D0A1A' },
    { id: 'gaslighter-within', emoji: '🕯️', title: '내 안의 가스라이터', subtitle: '나도 모르게 상대를 조종하는 끔찍한 습관', gradient: 'linear-gradient(135deg, #1A0D1A, #3D1A3D)', darkGradient: 'linear-gradient(180deg, #0D060D, #1A0D1A, #3D1A3D)', accentColor: '#CE93D8', thumbnailBg: '#1A0D1A' },
    { id: 'crush-curse', emoji: '👿', title: '짝사랑 저주력 테스트', subtitle: '내가 좋아하면 100% 안 되는 법칙', gradient: 'linear-gradient(135deg, #2D0D0D, #5C1A1A)', darkGradient: 'linear-gradient(180deg, #1A0606, #2D0D0D, #5C1A1A)', accentColor: '#FF5252', thumbnailBg: '#2D0D0D' },
    { id: 'taxi-fare-rage', emoji: '🚕', title: '택시비 분노게이지', subtitle: '돈 쓸 때마다 치미는 혈압 측정기', gradient: 'linear-gradient(135deg, #2D2D0A, #5C5C11)', darkGradient: 'linear-gradient(180deg, #1A1A05, #2D2D0A, #5C5C11)', accentColor: '#FFEE58', thumbnailBg: '#2D2D0A' },

    // ── 21~30 ──
    { id: 'roommate-hell', emoji: '🏠', title: '룸메이트 지옥도', subtitle: '같이 사는 순간 터지는 나의 히든 지뢰들', gradient: 'linear-gradient(135deg, #1A2D1A, #2D5C2D)', darkGradient: 'linear-gradient(180deg, #0D1A0D, #1A2D1A, #2D5C2D)', accentColor: '#66BB6A', thumbnailBg: '#1A2D1A' },
    { id: 'moral-gray-zone', emoji: '⚖️', title: '도덕적 회색지대 판독기', subtitle: '나는 과연 좋은 사람일까? 정말로?', gradient: 'linear-gradient(135deg, #1A1A1A, #3D3D3D)', darkGradient: 'linear-gradient(180deg, #0D0D0D, #1A1A1A, #3D3D3D)', accentColor: '#BDBDBD', thumbnailBg: '#1A1A1A' },
    { id: 'phone-unlock-urge', emoji: '🔓', title: '연인 폰 잠금해제 본능', subtitle: '믿음 vs 의심, 나의 진짜 속마음', gradient: 'linear-gradient(135deg, #0D0D2D, #1A1A5C)', darkGradient: 'linear-gradient(180deg, #06061A, #0D0D2D, #1A1A5C)', accentColor: '#536DFE', thumbnailBg: '#0D0D2D' },
    { id: 'heaven-rejection', emoji: '🚫', title: '천국 입장 거부 사유서', subtitle: '게이트에서 되돌려 보내질 진짜 이유', gradient: 'linear-gradient(135deg, #1A0A0A, #3D1111)', darkGradient: 'linear-gradient(180deg, #0D0505, #1A0A0A, #3D1111)', accentColor: '#EF9A9A', thumbnailBg: '#1A0A0A' },
    { id: 'dm-slide-success', emoji: '📩', title: 'DM 슬라이드 성공률', subtitle: '나의 첫 DM이 성공할 확률은 몇 %?', gradient: 'linear-gradient(135deg, #2D0A2D, #5C0A5C)', darkGradient: 'linear-gradient(180deg, #1A061A, #2D0A2D, #5C0A5C)', accentColor: '#EA80FC', thumbnailBg: '#2D0A2D' },
    { id: 'selfie-narcissism', emoji: '🤳', title: '셀카 중독 자아도취 판정', subtitle: '전면 카메라 앞에서 나오는 미소의 정체', gradient: 'linear-gradient(135deg, #2D1A0D, #5C300A)', darkGradient: 'linear-gradient(180deg, #1A0D06, #2D1A0D, #5C300A)', accentColor: '#FFAB91', thumbnailBg: '#2D1A0D' },
    { id: 'human-blackhole', emoji: '🕳️', title: '인간 블랙홀 흡수력', subtitle: '주변의 에너지를 전부 빨아들이는 존재감', gradient: 'linear-gradient(135deg, #0D0D1A, #1A1A3D)', darkGradient: 'linear-gradient(180deg, #06060D, #0D0D1A, #1A1A3D)', accentColor: '#B388FF', thumbnailBg: '#0D0D1A' },
    { id: 'avoidant-escape', emoji: '🏃', title: '회피형 인간의 도주력', subtitle: '불편하면 도망치는 나의 회피 본능 측정', gradient: 'linear-gradient(135deg, #0D2D1A, #0A5C2D)', darkGradient: 'linear-gradient(180deg, #061A0D, #0D2D1A, #0A5C2D)', accentColor: '#69F0AE', thumbnailBg: '#0D2D1A' },
    { id: 'face-gossip', emoji: '🤫', title: '앞담화 체감 온도', subtitle: '면전에서 은근히 찔러오는 팩트의 고통', gradient: 'linear-gradient(135deg, #2D1A08, #4D2D08)', darkGradient: 'linear-gradient(180deg, #1A0D04, #2D1A08, #4D2D08)', accentColor: '#D4A574', thumbnailBg: '#2D1A08' },
    { id: 'dad-joke-freq', emoji: '😂', title: '아재개그 오발탄 빈도', subtitle: '본인만 웃기는 한심한 유머 빈도 측정', gradient: 'linear-gradient(135deg, #2D2D0D, #4D4D1A)', darkGradient: 'linear-gradient(180deg, #1A1A06, #2D2D0D, #4D4D1A)', accentColor: '#C6FF00', thumbnailBg: '#2D2D0D' },

    // ── 31~40 ──
    { id: 'traitor-nation', emoji: '📜', title: '전생에 팔아먹은 나라', subtitle: '매국노였다면, 어떤 나라를 팔았을까?', gradient: 'linear-gradient(135deg, #1A0D08, #3D1A0A)', darkGradient: 'linear-gradient(180deg, #0D0604, #1A0D08, #3D1A0A)', accentColor: '#FF9E80', thumbnailBg: '#1A0D08' },
    { id: 'affection-void', emoji: '🕳️', title: '애정결핍 블랙홀', subtitle: '사랑에 굶주린 나의 결핍 깊이 측정', gradient: 'linear-gradient(135deg, #2D0A17, #6B0F2E)', darkGradient: 'linear-gradient(180deg, #1A060D, #2D0A17, #6B0F2E)', accentColor: '#FF5252', thumbnailBg: '#2D0A17' },
    { id: 'schadenfreude', emoji: '😈', title: '타인의 불행은 나의 행복', subtitle: '남의 실패에 몰래 웃는 찐 쾌감 지수', gradient: 'linear-gradient(135deg, #1A0D0D, #3D0A0A)', darkGradient: 'linear-gradient(180deg, #0D0606, #1A0D0D, #3D0A0A)', accentColor: '#EF5350', thumbnailBg: '#1A0D0D' },
    { id: 'love-power-rank', emoji: '👑', title: '연애 중 갑을관계 포지션', subtitle: '통화 끊는 쪽? 먼저 사과하는 쪽?', gradient: 'linear-gradient(135deg, #2D2408, #5C4A0A)', darkGradient: 'linear-gradient(180deg, #1A1504, #2D2408, #5C4A0A)', accentColor: '#FFD700', thumbnailBg: '#2D2408' },
    { id: 'shadow-boxing', emoji: '🥊', title: '뒷북 섀도복싱 지수', subtitle: '끝난 말다툼을 혼자 되새기며 분노하는 시간', gradient: 'linear-gradient(135deg, #2D0D0A, #5C1A0A)', darkGradient: 'linear-gradient(180deg, #1A0604, #2D0D0A, #5C1A0A)', accentColor: '#FF7043', thumbnailBg: '#2D0D0A' },
    { id: 'pro-whiner', emoji: '😭', title: '프로 징징이 지수', subtitle: '입만 열면 불평불만, 주변을 지치게 하는 레벨', gradient: 'linear-gradient(135deg, #1A1A2D, #2D2D4D)', darkGradient: 'linear-gradient(180deg, #0D0D1A, #1A1A2D, #2D2D4D)', accentColor: '#78909C', thumbnailBg: '#1A1A2D' },
    { id: 'reply-speed-interest', emoji: '📱', title: '답장 속도로 보는 관심도', subtitle: '0.1초 답장 vs 3일 잠수의 진짜 의미', gradient: 'linear-gradient(135deg, #0D1A2D, #0A2D5C)', darkGradient: 'linear-gradient(180deg, #060D1A, #0D1A2D, #0A2D5C)', accentColor: '#40C4FF', thumbnailBg: '#0D1A2D' },
    { id: 'digital-footprint', emoji: '👣', title: '디지털 발자국 공포', subtitle: '10년 전 내 글이 인터넷 어딘가에 산다', gradient: 'linear-gradient(135deg, #1A2D2D, #0A5C5C)', darkGradient: 'linear-gradient(180deg, #0D1A1A, #1A2D2D, #0A5C5C)', accentColor: '#4DD0E1', thumbnailBg: '#1A2D2D' },
    { id: 'office-politics', emoji: '🦇', title: '사내 정치질 전투력', subtitle: '보고 라인, 뒷공작, 라인 타기의 달인', gradient: 'linear-gradient(135deg, #0D0D2D, #1A1A5C)', darkGradient: 'linear-gradient(180deg, #06061A, #0D0D2D, #1A1A5C)', accentColor: '#5C6BC0', thumbnailBg: '#0D0D2D' },
    { id: 'pufferfish-rage', emoji: '🐡', title: '인간 복어 팽창 지수', subtitle: '겉으로도 성질 더럽고 속으로도 성질 더러운 테스트', gradient: 'linear-gradient(135deg, #2D2D0A, #4D4D11)', darkGradient: 'linear-gradient(180deg, #1A1A05, #2D2D0A, #4D4D11)', accentColor: '#D4E157', thumbnailBg: '#2D2D0A' },
];
