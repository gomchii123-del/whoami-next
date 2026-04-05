const fs = require('fs');
const path = require('path');

const TESTS = [
    { id: 'talking-stage-expiry', title: '썸 유통기한 판독기', k1: '환승이별', k2: '어장관리', k3: '잠수' }
];

const PROFILES = [
    { t: "노빠꾸 {title} ({k1} 장인)", b1: "앞뒤 안 가리고 {k3} 짓을 저지르는 브레이크 없는 자동차. {title} 종목에서 당당히 1위를 차지할 재목입니다.", b2: "{k2} 기술이 주특기이며 남들이 당신을 어떻게 보든 타격감이 전혀 없습니다. 본인만 즐거운 이기주의의 극치.", i: "팩트폭행: 그렇게 혼자 폭주하다가는 주변에 남아나는 사람이 없을 겁니다." },
    { t: "찌질한 {k2} 과몰입러", b1: "남들은 신경도 안 쓰는데 혼자서 {k1}에 과몰입하며 {title}의 수렁에 빠집니다.", b2: "현실에서는 소심하게 굴면서 어둠 속에서 {k3}할 상상을 하며 밤을 지새우는 전형적인 그림자 캐릭터입니다.", i: "팩트폭행: 혼자 소설 쓰지 말고 제발 현실을 좀 마주하세요." },
    { t: "머릿속이 꽃밭인 {k3}꾼", b1: "심각한 상황에서도 분위기 파악을 못하고 {k1}을 중시하는 해맑음의 대명사.", b2: "인생을 가볍게 즐기고 언제나 여차하면 {k2}를 시전하며 회피할 궁리부터 세워둡니다.", i: "팩트폭행: 인생이 마냥 즐겁죠? 조만간 그 가벼움 때문에 거대한 청구서가 올 겁니다." },
    { t: "답답한 {k2} 꼰대", b1: "말도 안 되게 보수적이라 자신이 만든 {k1} 룰에서 1mm만 벗어나도 극대노하는 {title}의 화신.", b2: "상대방의 입장은 개나 줘버리고 나의 {k3} 기준만을 들이미는 인간 브레이크입니다.", i: "팩트폭행: 뒷담화 순위 1위에 등극한 걸 축하합니다. 본인의 오만함을 버리세요." },
    { t: "변덕쟁이 {k1} 도주자", b1: "상황에 직면하기도 전에 가장 먼저 {k3} 스킬을 충전하여 도망칠 준비를 마치는 회피형 인간.", b2: "책임이란 단어만 들으면 피가 식으며 언제든지 익숙한 패턴의 {k2}에 몰입해 시선을 돌립니다.", i: "팩트폭행: 도망치는 곳에 낙원은 없습니다. 한 번쯤은 진지하게 부딪혀 보세요." },
    { t: "부담백배 {k3} 오지라퍼", b1: "굳이 하지 말라는 행동까지 긁어 부스럼을 만들며 {k1}에 앞장서는 {title} 중독자.", b2: "본인은 남을 원조한다고 포장하지만 깊은 속내에는 지독한 {k2} 인정욕구가 도사리고 있습니다.", i: "팩트폭행: 남 신경 쓰지 말고 본인 앞가림이나 먼저 똑바로 하세요." },
    { t: "피도 눈물도 없는 {k1} 기계", b1: "태생적으로 공감 능력은 어딘가에 버려두고 {k2} 방식만 고수하며 차갑게 재는 심장의 소유자.", b2: "타인의 고통 따윈 안중에도 없고 오로지 목적 달성에 치중하는 {k3} 마인드가 무섭습니다.", i: "팩트폭행: 팩트를 앞세워 타인을 패는 데서 쾌감을 얻나요? 그냥 이기적인 겁니다." },
    { t: "극강의 {k2} 보스", b1: "모든 상황의 통제권이 자신에게 있어야 직성이 풀리는 극한의 꼰대력. {k1}의 화신.", b2: "나의 결정이 법이고 상식. 언제나 {k3} 모드로 남들을 쥐어짜는 걸 인생의 낙으로 삼습니다.", i: "팩트폭행: 당신은 왕이 아닙니다. 주변 사람들이 다 등돌리기 전에 갑질 좀 멈추세요." },
    { t: "망상 폭발 {k3} 유토피아", b1: "가혹한 현실에서 눈을 돌려 본인만의 우아한 {title} 동화 속을 거니는 망상러.", b2: "위기는 {k1} 핑계를 대며 무시해버리고 결국 속으로는 {k2}에 목멘 결핍 덩어리입니다.", i: "팩트폭행: 상상 속에서는 이미 세상을 지배했네요. 이제 그만 잠에서 깰 시간입니다." }
];

let generatedBlock = '';

for (const test of TESTS) {
    generatedBlock += `    '${test.id}': {\n`;
    for (let lp = 1; lp <= 9; lp++) {
        const template = PROFILES[lp - 1];
        
        const title = template.t.replace(/{title}/g, test.title).replace(/{k1}/g, test.k1).replace(/{k2}/g, test.k2).replace(/{k3}/g, test.k3);
        const body1 = template.b1.replace(/{title}/g, test.title).replace(/{k1}/g, test.k1).replace(/{k2}/g, test.k2).replace(/{k3}/g, test.k3);
        const body2 = template.b2.replace(/{title}/g, test.title).replace(/{k1}/g, test.k1).replace(/{k2}/g, test.k2).replace(/{k3}/g, test.k3);
        const insight = template.i.replace(/{title}/g, test.title).replace(/{k1}/g, test.k1).replace(/{k2}/g, test.k2).replace(/{k3}/g, test.k3);
        
        generatedBlock += `        ${lp}: { title: "${title}", body: ["${body1}", "${body2}"], insight: "${insight}" },\n`;
    }
    generatedBlock += `    },\n`;
}

const libPath = path.join(__dirname, 'src', 'lib', 'generated-snack-library.ts');
let content = fs.readFileSync(libPath, 'utf8');

const matchStartToken = "    'talking-stage-expiry': {\n";
const matchEndToken = "    'night-persona': {\n";

const startIndex = content.indexOf(matchStartToken);
const endIndex = content.indexOf(matchEndToken);

if (startIndex !== -1 && endIndex !== -1) {
    const beforeStr = content.slice(0, startIndex);
    const afterStr = content.slice(endIndex);
    
    const finalContent = beforeStr + generatedBlock + afterStr;
    fs.writeFileSync(libPath, finalContent, 'utf8');
    console.log("Successfully fixed the missing test!");
} else {
    console.log("Could not find the target tokens for replacement! Start: ", startIndex, "End:", endIndex);
}
