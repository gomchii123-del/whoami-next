const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '..', 'src', 'lib', 'snack-tests.ts');
let snackTestsTs = fs.readFileSync(tsFilePath, 'utf8');

// Extract all test IDs using regex from SNACK_TESTS
const testIds = [];
const regex = /id:\s*'([\w-]+)'/g;
let match;
while ((match = regex.exec(snackTestsTs)) !== null) {
    if (!testIds.includes(match[1])) {
        testIds.push(match[1]);
    }
}

console.log(`Found ${testIds.length} unique snack tests`);

// Deterministic random
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

const adjectives = [
    "통제불능의", "은밀한", "게으른", "고집불통의", "망상폭발", "현실도피형", 
    "파멸적", "소름돋는", "우주최강", "눈물이 앞을 가리는", "숨막히는", "감당안되는",
    "답도 없는", "의지박약", "내로남불", "프로불편러", "위선적인", "잔소리대마왕",
    "이기적인", "호구 잡힌", "매운맛", "마라맛", "관종력 만렙", "분노조절장애"
];

const nouns = [
    "방구석 여포", "팩폭 자판기", "유리멘탈", "오지라퍼", "프로 징징이", "관종", 
    "선택장애", "고답이", "불도저", "아싸", "인싸", "꼰대", "허세충", "뒷북러",
    "광기", "트롤러", "징징이", "기생충", "사기캐", "돌+아이", "미친자", "빌런"
];

const bodySentences1 = [
    "겉으로는 쿨한 척 다 하지만 속으로는 옹졸함의 끝판왕입니다.",
    "자기가 세상에서 제일 불쌍한 비운의 주인공이라는 착각에 빠져 삽니다.",
    "입만 열면 허세가 줄줄 흐르는데, 현실은 방바닥 껌딱지에 불과하죠.",
    "결정장애 말기라서 짜장면 짬뽕 고르는데도 3박 4일이 걸립니다.",
    "나의 논리가 세상의 법이라고 우기는 전형적인 똥고집입니다.",
    "누가 나에게 뭐라 하면 속으로 3년 동안 뒤끝을 품는 스타일입니다.",
    "어디 가서 나서기를 좋아하지만 실속은 1도 없는 허당입니다.",
    "머릿속으로는 이미 우주 정복을 완료했지만 현실 방청소도 안 합니다.",
    "남들 앞에서 센 척하지만 카톡 읽씹 당하면 하루 종일 전전긍긍합니다.",
    "본인은 객관적이라 생각하지만 사실 가장 주관적이고 감정적인 인간입니다."
];

const bodySentences2 = [
    "당신의 그 치명적인 회피 본능 때문에 주변 사람들이 다 떠나가고 있습니다.",
    "남들 눈치 보느라 정작 네 인생은 진흙탕 속을 뒹굴고 있네요.",
    "제발 현실 좀 통찰하십시오. 우주 중심은 당신이 아닙니다.",
    "이불 킥 할 짓만 골라서 하면서 본인만 모르고 있는 게 코미디입니다.",
    "돈 아까운 줄은 알면서 본인 시간 낭비하는 건 기가 막히게 잘하네요.",
    "알량한 자존심 하나 지키려다가 소중한 인연 다 놓치는 중입니다.",
    "지금처럼 나 혼자만 잘났다고 우기다가는 평생 독거노인 확정입니다.",
    "SNS에 올릴 허세 샷 찍을 시간에 진짜 네 인생이나 신경 쓰십쇼.",
    "나쁜 사람 되긴 싫어서 이도저도 못하고 질질 끄는 게 제일 악질입니다.",
    "맨날 말로만 다이어트, 금주, 갓생타령 하면서 내일이면 똑같이 살 인간."
];

const insights = [
    "팩트폭행: 텅 빈 깡통 소리가 요란해서 여기까지 다 들립니다. 거울 치료 시급!",
    "팩트폭행: 정신 좀 차리세요. 당신의 그 알량한 변명이 제일 역겹습니다.",
    "팩트폭행: 늦었다고 생각할 때가 진짜 늦은 겁니다. 제발 실행 좀 하세요.",
    "팩트폭행: 남 탓 그만하고 스스로의 찌질함을 인정하는 것부터 시작합시다.",
    "팩트폭행: 착한 척 그만하세요. 속이 시커먼 거 주변 사람들은 다 압니다.",
    "팩트폭행: 멘탈 좀 단련하세요. 그 멘탈로는 험한 세상 어찌 살려고 그러십니까?",
    "팩트폭행: 어설프게 아는 척 좀 하지 마세요. 제일 멍청해 보입니다.",
    "팩트폭행: 징그럽게 도망치는 습관 좀 버리세요. 이제 마주할 때도 됐잖아요.",
    "팩트폭행: 당신이 호구 잡히는 건 100% 본인이 자초한 일입니다.",
    "팩트폭행: 본인만 억울한 줄 아는데, 진짜 피해자는 당신 주변 사람들입니다."
];

const lpNames = [
    "모험가", "분석가", "리더", "수호자", "예술가", "조언자", "관찰자", "지배자", "완성자"
];

let generatedCode = `import { SnackContent } from './snack-tests';

// 자동 생성된 936개의 하드코딩된 유니크 결과지
export const GeneratedSnackLibrary: Record<string, Record<number, SnackContent>> = {
`;

for (let id of testIds) {
    generatedCode += `    '${id}': {\n`;
    for (let lp = 1; lp <= 9; lp++) {
        let seedStr = id + "_" + lp;
        let rng = mulberry32(stringToSeed(seedStr));
        
        let r1 = Math.floor(rng() * adjectives.length);
        let r2 = Math.floor(rng() * nouns.length);
        let r3 = Math.floor(rng() * bodySentences1.length);
        let r4 = Math.floor(rng() * bodySentences2.length);
        let r5 = Math.floor(rng() * insights.length);
        let title = adjectives[r1] + ' ' + nouns[r2];
        let b1 = bodySentences1[r3];
        let b2 = bodySentences2[r4];
        let insight = insights[r5];

        generatedCode += `        ${lp}: { title: "${title}", body: ["${b1}", "${b2}"], insight: "${insight}" },\n`;
    }
    generatedCode += `    },\n`;
}

generatedCode += `};\n`;

const outputPath = path.join(__dirname, '..', 'src', 'lib', 'generated-snack-library.ts');
fs.writeFileSync(outputPath, generatedCode, 'utf8');

console.log("Written 936 entries to src/lib/generated-snack-library.ts");
