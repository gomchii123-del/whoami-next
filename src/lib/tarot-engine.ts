export interface TarotCard {
    id: string;
    name: string;
    hanjaName?: string;
    type: 'major' | 'minor';
    suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
    rank?: string;
    meaning: string;
    imagePath: string;
}

export const TAROT_DECK: TarotCard[] = [
    // Major Arcana
    { id: 'm00', name: 'The Fool (광대)', type: 'major', meaning: '새로운 시작, 모험, 순수함, 자유', imagePath: '/images/tarot/m00.webp' },
    { id: 'm01', name: 'The Magician (마법사)', type: 'major', meaning: '창조력, 의지력, 기술, 잠재력', imagePath: '/images/tarot/m01.webp' },
    { id: 'm02', name: 'The High Priestess (고위 여사제)', type: 'major', meaning: '직관, 신비, 내면의 목소리, 무의식', imagePath: '/images/tarot/m02.webp' },
    { id: 'm03', name: 'The Empress (여황제)', type: 'major', meaning: '풍요, 모성, 창의성, 자연', imagePath: '/images/tarot/m03.webp' },
    { id: 'm04', name: 'The Emperor (황제)', type: 'major', meaning: '권위, 구조, 질서, 실용성', imagePath: '/images/tarot/m04.webp' },
    { id: 'm05', name: 'The Hierophant (교황)', type: 'major', meaning: '전통, 교육, 영적 지도, 사회적 규범', imagePath: '/images/tarot/m05.webp' },
    { id: 'm06', name: 'The Lovers (연인)', type: 'major', meaning: '사랑, 조화, 선택, 가치관의 일치', imagePath: '/images/tarot/m06.webp' },
    { id: 'm07', name: 'The Chariot (전차)', type: 'major', meaning: '승리, 의지, 통제, 전진', imagePath: '/images/tarot/m07.webp' },
    { id: 'm08', name: 'Strength (힘)', type: 'major', meaning: '용기, 인내, 내면의 힘, 부드러운 통제', imagePath: '/images/tarot/m08.webp' },
    { id: 'm09', name: 'The Hermit (은둔자)', type: 'major', meaning: '성찰, 고독, 내면의 탐구, 지혜', imagePath: '/images/tarot/m09.webp' },
    { id: 'm10', name: 'Wheel of Fortune (운명의 수레바퀴)', type: 'major', meaning: '운명, 변화, 전환점, 필연', imagePath: '/images/tarot/m10.webp' },
    { id: 'm11', name: 'Justice (정의)', type: 'major', meaning: '공정함, 진실, 원인과 결과, 균형', imagePath: '/images/tarot/m11.webp' },
    { id: 'm12', name: 'The Hanged Man (매달린 사람)', type: 'major', meaning: '새로운 관점, 희생, 기다림, 정지', imagePath: '/images/tarot/m12.webp' },
    { id: 'm13', name: 'Death (죽음)', type: 'major', meaning: '종결, 변화, 새로운 시작, 변형', imagePath: '/images/tarot/m13.webp' },
    { id: 'm14', name: 'Temperance (절제)', type: 'major', meaning: '절제, 조화, 인내, 균형 유지', imagePath: '/images/tarot/m14.webp' },
    { id: 'm15', name: 'The Devil (악마)', type: 'major', meaning: '속박, 중독, 유혹, 물질적 집착', imagePath: '/images/tarot/m15.webp' },
    { id: 'm16', name: 'The Tower (탑)', type: 'major', meaning: '갑작스러운 변화, 파괴, 진실의 폭로', imagePath: '/images/tarot/m16.webp' },
    { id: 'm17', name: 'The Star (별)', type: 'major', meaning: '희망, 영감, 치유, 평화', imagePath: '/images/tarot/m17.webp' },
    { id: 'm18', name: 'The Moon (달)', type: 'major', meaning: '불안, 환상, 직관, 무의식적 공포', imagePath: '/images/tarot/m18.webp' },
    { id: 'm19', name: 'The Sun (태양)', type: 'major', meaning: '성공, 기쁨, 활력, 명확성', imagePath: '/images/tarot/m19.webp' },
    { id: 'm20', name: 'Judgement (심판)', type: 'major', meaning: '부활, 결단, 자기 평가, 소명', imagePath: '/images/tarot/m20.webp' },
    { id: 'm21', name: 'The World (세계)', type: 'major', meaning: '완성, 성취, 조화, 사이클의 종료', imagePath: '/images/tarot/m21.webp' },

    // Minor Arcana (Wands)
    { id: 'w01', name: 'Ace of Wands', type: 'minor', suit: 'wands', rank: 'Ace', meaning: '영감, 새로운 시작, 잠재적 가능성', imagePath: '/images/tarot/w01.webp' },
    { id: 'w02', name: 'Two of Wands', type: 'minor', suit: 'wands', rank: '2', meaning: '계획, 결정, 미래에 대한 전망', imagePath: '/images/tarot/w02.webp' },
    { id: 'w03', name: 'Three of Wands', type: 'minor', suit: 'wands', rank: '3', meaning: '확장, 협력, 기회의 탐색', imagePath: '/images/tarot/w03.webp' },
    { id: 'w04', name: 'Four of Wands', type: 'minor', suit: 'wands', rank: '4', meaning: '축하, 안정, 가정의 화목', imagePath: '/images/tarot/w04.webp' },
    { id: 'w05', name: 'Five of Wands', type: 'minor', suit: 'wands', rank: '5', meaning: '경쟁, 갈등, 사소한 대립', imagePath: '/images/tarot/w05.webp' },
    { id: 'w06', name: 'Six of Wands', type: 'minor', suit: 'wands', rank: '6', meaning: '승리, 성공, 대중적 인정', imagePath: '/images/tarot/w06.webp' },
    { id: 'w07', name: 'Seven of Wands', type: 'minor', suit: 'wands', rank: '7', meaning: '방어, 지킴, 용기 있는 대응', imagePath: '/images/tarot/w07.webp' },
    { id: 'w08', name: 'Eight of Wands', type: 'minor', suit: 'wands', rank: '8', meaning: '신속함, 통신, 급격한 진전', imagePath: '/images/tarot/w08.webp' },
    { id: 'w09', name: 'Nine of Wands', type: 'minor', suit: 'wands', rank: '9', meaning: '인내, 끈기, 거의 다 왔음', imagePath: '/images/tarot/w09.webp' },
    { id: 'w10', name: 'Ten of Wands', type: 'minor', suit: 'wands', rank: '10', meaning: '과한 책임감, 부담, 고단함', imagePath: '/images/tarot/w10.webp' },
    { id: 'w11', name: 'Page of Wands', type: 'minor', suit: 'wands', rank: 'Page', meaning: '소식, 호기심, 열정적인 아이디어', imagePath: '/images/tarot/w11.webp' },
    { id: 'w12', name: 'Knight of Wands', type: 'minor', suit: 'wands', rank: 'Knight', meaning: '열정적 전진, 모험심, 성급함', imagePath: '/images/tarot/w12.webp' },
    { id: 'w13', name: 'Queen of Wands', type: 'minor', suit: 'wands', rank: 'Queen', meaning: '사회적 카리스마, 활력, 자신감', imagePath: '/images/tarot/w13.webp' },
    { id: 'w14', name: 'King of Wands', type: 'minor', suit: 'wands', rank: 'King', meaning: '리더십, 비전, 권위, 강한 추진력', imagePath: '/images/tarot/w14.webp' },

    // Minor Arcana (Cups)
    { id: 'c01', name: 'Ace of Cups', type: 'minor', suit: 'cups', rank: 'Ace', meaning: '새로운 감정의 시작, 사랑, 기쁨', imagePath: '/images/tarot/c01.webp' },
    { id: 'c02', name: 'Two of Cups', type: 'minor', suit: 'cups', rank: '2', meaning: '조화로운 관계, 결합, 우정', imagePath: '/images/tarot/c02.webp' },
    { id: 'c03', name: 'Three of Cups', type: 'minor', suit: 'cups', rank: '3', meaning: '축하, 친목, 즐거움의 공유', imagePath: '/images/tarot/c03.webp' },
    { id: 'c04', name: 'Four of Cups', type: 'minor', suit: 'cups', rank: '4', meaning: '권태, 불만족, 기회를 놓침', imagePath: '/images/tarot/c04.webp' },
    { id: 'c05', name: 'Five of Cups', type: 'minor', suit: 'cups', rank: '5', meaning: '상실, 슬픔, 후회, 남은 것에 집중', imagePath: '/images/tarot/c05.webp' },
    { id: 'c06', name: 'Six of Cups', type: 'minor', suit: 'cups', rank: '6', meaning: '향수, 과거의 인연, 순수함', imagePath: '/images/tarot/c06.webp' },
    { id: 'c07', name: 'Seven of Cups', type: 'minor', suit: 'cups', rank: '7', meaning: '환상, 수많은 선택지, 혼란', imagePath: '/images/tarot/c07.webp' },
    { id: 'c08', name: 'Eight of Cups', type: 'minor', suit: 'cups', rank: '8', meaning: '떠남, 새로운 길 모색, 감정적 포기', imagePath: '/images/tarot/c08.webp' },
    { id: 'c09', name: 'Nine of Cups', type: 'minor', suit: 'cups', rank: '9', meaning: '만족, 소원 성취, 감정적 풍요', imagePath: '/images/tarot/c09.webp' },
    { id: 'c10', name: 'Ten of Cups', type: 'minor', suit: 'cups', rank: '10', meaning: '행복한 가정, 완전한 사랑, 평화', imagePath: '/images/tarot/c10.webp' },
    { id: 'c11', name: 'Page of Cups', type: 'minor', suit: 'cups', rank: 'Page', meaning: '감성적인 소식, 제안, 직관적 영감', imagePath: '/images/tarot/c11.webp' },
    { id: 'c12', name: 'Knight of Cups', type: 'minor', suit: 'cups', rank: 'Knight', meaning: '로맨틱한 제안, 감동적인 소식, 전진', imagePath: '/images/tarot/c12.webp' },
    { id: 'c13', name: 'Queen of Cups', type: 'minor', suit: 'cups', rank: 'Queen', meaning: '자애로움, 직관, 감성적 리더십', imagePath: '/images/tarot/c13.webp' },
    { id: 'c14', name: 'King of Cups', type: 'minor', suit: 'cups', rank: 'King', meaning: '감정 조율, 포용력, 평온한 카리스마', imagePath: '/images/tarot/c14.webp' },

    // Minor Arcana (Swords)
    { id: 's01', name: 'Ace of Swords', type: 'minor', suit: 'swords', rank: 'Ace', meaning: '지적 승리, 명확성, 새로운 시작', imagePath: '/images/tarot/s01.webp' },
    { id: 's02', name: 'Two of Swords', type: 'minor', suit: 'swords', rank: '2', meaning: '결정의 어려움, 팽팽한 균형, 회피', imagePath: '/images/tarot/s02.webp' },
    { id: 's03', name: 'Three of Swords', type: 'minor', suit: 'swords', rank: '3', meaning: '이별, 슬픔, 마음의 상처, 고뇌', imagePath: '/images/tarot/s03.webp' },
    { id: 's04', name: 'Four of Swords', type: 'minor', suit: 'swords', rank: '4', meaning: '휴식, 명상, 후퇴, 재충전', imagePath: '/images/tarot/s04.webp' },
    { id: 's05', name: 'Five of Swords', type: 'minor', suit: 'swords', rank: '5', meaning: '이기적인 승리, 갈등, 자존심 대립', imagePath: '/images/tarot/s05.webp' },
    { id: 's06', name: 'Six of Swords', type: 'minor', suit: 'swords', rank: '6', meaning: '어려움에서 벗어남, 회복, 이동', imagePath: '/images/tarot/s06.webp' },
    { id: 's07', name: 'Seven of Swords', type: 'minor', suit: 'swords', rank: '7', meaning: '기만, 지략, 몰래 추진하는 일', imagePath: '/images/tarot/s07.webp' },
    { id: 's08', name: 'Eight of Swords', type: 'minor', suit: 'swords', rank: '8', meaning: '속박당함, 무력감, 자기 제한', imagePath: '/images/tarot/s08.webp' },
    { id: 's09', name: 'Nine of Swords', type: 'minor', suit: 'swords', rank: '9', meaning: '불안, 악몽, 과도한 걱정, 고통', imagePath: '/images/tarot/s09.webp' },
    { id: 's10', name: 'Ten of Swords', type: 'minor', suit: 'swords', rank: '10', meaning: '파국, 바닥을 침, 새로운 시작의 전조', imagePath: '/images/tarot/s10.webp' },
    { id: 's11', name: 'Page of Swords', type: 'minor', suit: 'swords', rank: 'Page', meaning: '예리한 통찰력, 새로운 아이디어, 감시', imagePath: '/images/tarot/s11.webp' },
    { id: 's12', name: 'Knight of Swords', type: 'minor', suit: 'swords', rank: 'Knight', meaning: '신속한 행동, 용감함, 저돌적 추진', imagePath: '/images/tarot/s12.webp' },
    { id: 's13', name: 'Queen of Swords', type: 'minor', suit: 'swords', rank: 'Queen', meaning: '냉철한 판단력, 지혜, 독립적 성격', imagePath: '/images/tarot/s13.webp' },
    { id: 's14', name: 'King of Swords', type: 'minor', suit: 'swords', rank: 'King', meaning: '이성적 리더십, 권위, 공정한 결정', imagePath: '/images/tarot/s14.webp' },

    // Minor Arcana (Pentacles)
    { id: 'p01', name: 'Ace of Pentacles', type: 'minor', suit: 'pentacles', rank: 'Ace', meaning: '물질적 시작, 번영의 씨앗, 안정', imagePath: '/images/tarot/p01.webp' },
    { id: 'p02', name: 'Two of Pentacles', type: 'minor', suit: 'pentacles', rank: '2', meaning: '유연성, 균형 맞추기, 변화 관리', imagePath: '/images/tarot/p02.webp' },
    { id: 'p03', name: 'Three of Pentacles', type: 'minor', suit: 'pentacles', rank: '3', meaning: '팀워크, 협력, 기술의 연마', imagePath: '/images/tarot/p03.webp' },
    { id: 'p04', name: 'Four of Pentacles', type: 'minor', suit: 'pentacles', rank: '4', meaning: '소유욕, 인색함, 보수성, 안정 집착', imagePath: '/images/tarot/p04.webp' },
    { id: 'p05', name: 'Five of Pentacles', type: 'minor', suit: 'pentacles', rank: '5', meaning: '결핍, 경제적 어려움, 소외감', imagePath: '/images/tarot/p05.webp' },
    { id: 'p06', name: 'Six of Pentacles', type: 'minor', suit: 'pentacles', rank: '6', meaning: '관용, 베풂, 공정한 나눔', imagePath: '/images/tarot/p06.webp' },
    { id: 'p07', name: 'Seven of Pentacles', type: 'minor', suit: 'pentacles', rank: '7', meaning: '수확을 기다림, 인내, 노력의 결실', imagePath: '/images/tarot/p07.webp' },
    { id: 'p08', name: 'Eight of Pentacles', type: 'minor', suit: 'pentacles', rank: '8', meaning: '장인 정신, 성실함, 숙련도 향상', imagePath: '/images/tarot/p08.webp' },
    { id: 'p09', name: 'Nine of Pentacles', type: 'minor', suit: 'pentacles', rank: '9', meaning: '풍요로움, 독립적 성취, 우아한 성공', imagePath: '/images/tarot/p09.webp' },
    { id: 'p10', name: 'Ten of Pentacles', type: 'minor', suit: 'pentacles', rank: '10', meaning: '가문 번창, 유산, 지속되는 풍요', imagePath: '/images/tarot/p10.webp' },
    { id: 'p11', name: 'Page of Pentacles', type: 'minor', suit: 'pentacles', rank: 'Page', meaning: '기회 탐색, 성실한 소식, 시작의 가능성', imagePath: '/images/tarot/p11.webp' },
    { id: 'p12', name: 'Knight of Pentacles', type: 'minor', suit: 'pentacles', rank: 'Knight', meaning: '책임감, 신중함, 성실한 진행', imagePath: '/images/tarot/p12.webp' },
    { id: 'p13', name: 'Queen of Pentacles', type: 'minor', suit: 'pentacles', rank: 'Queen', meaning: '현실적 풍요, 돌보는 마음, 안정감', imagePath: '/images/tarot/p13.webp' },
    { id: 'p14', name: 'King of Pentacles', type: 'minor', suit: 'pentacles', rank: 'King', meaning: '재물 관리 능력, 번영, 흔들리지 않는 지위', imagePath: '/images/tarot/p14.webp' },
];

export function shuffleAndDraw(count: number): TarotCard[] {
    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
