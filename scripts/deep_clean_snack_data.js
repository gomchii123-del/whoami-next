const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '../src/lib');
const files = fs.readdirSync(libDir).filter(f => f.startsWith('snack-tests') && f.endsWith('.ts'));

function generateMBTIText(title) {
  const spicyIntro = [
    `당신은 뼛속까지 '${title}' 그 자체입니다.`,
    `누가 봐도 전형적인 '${title}' 유형이네요.`,
    `숨기려 해도 숨길 수 없는 관종력, 바로 '${title}'입니다.`,
    `어느 모임에 가나 하나 꼭 있는 피곤한 스타일, '${title}'!`,
    `축하합니다! 당신은 독보적인 '${title}' 성향을 가지고 태어났네요.`,
    `태어날 때부터 '${title}'의 운명을 타고난 맑은 눈의 광인!`,
    `당신의 이마에는 '${title}'라고 대문짝만하게 적혀 있습니다.`
  ];
  
  const spicyBody = [
    `현실은 시궁창인데 멘탈만은 우주를 뚫고 올라갑니다. 주변 사람들이 다 안다지만 본인만 모르는 치명적 매력(?)의 소유자. 누가 말려도 자기 방식대로 밀고 나가는 무적의 불도저입니다.`,
    `남들 시선 의식하느라 통장은 텅텅 비어가고 있는데, 피드만 보면 재벌 3세가 따로 없습니다. 껍데기만 남은 자존심 하나로 버티는 당신, 사실 속은 누구보다 여리고 찌질합니다.`,
    `겉으로는 세상 쿨하고 힙한 척 다 하지만 속으로는 엄청난 소심쟁이에 뒤끝 작렬입니다. 남들은 이미 다 눈치챘는데 본인 혼자 완벽 범죄라고 굳게 믿고 있네요. 이불킥 예약입니다.`,
    `자기 객관화는 진작에 국 끓여 먹었습니다. 무논리로 들이밀며 주변 사람들의 기를 다 빨아먹는데 정작 본인은 자기가 리더십 쩐다고 굳게 착각 중! 당당함이 지나쳐 뻔뻔한 수준.`,
    `입만 열면 허세와 과장이 줄줄 흐르는데, 실행력은 마이너스를 달립니다. 방구석 여포의 표본이랄까요? 망상 속에서는 이미 우주 정복을 완료했지만 현실은 침대 위 껌딱지입니다.`,
    `자기가 세상에서 제일 불쌍하고 제일 상처받은 비운의 여주/남주인공입니다. 모든 비극을 혼자 다 짊어진 척하지만 사실 모든 원흉은 당신의 그 지독한 회피형 본능 때문입니다.`,
    `선택 장애 말기 환자입니다. 짬짜면 하나 고르는데도 3박 4일이 걸리며, 결국 남이 골라준 거 먹고 투덜거리는 최강의 밉상. 책임을 지기 싫어하는 본능이 뼛속까지 박혀있네요.`
  ];
  
  const spicyInsight = [
    `팩트폭행: 이대로 가다간 당신 곁에 아무도 남지 않을 겁니다. 제발 멘탈 챙기고 뼈 아픈 현실 직시하세요.`,
    `팩트폭행: 당신의 똘기는 칭찬이 아닙니다. 지금이라도 늦지 않았으니 객관적인 거울 치료가 시급합니다.`,
    `팩트폭행: 남한테 민폐 끼치며 사는 걸 즐기는 게 아니라면, 이쯤에서 자기성찰 좀 하는 게 신상에 좋습니다.`,
    `팩트폭행: 겉모습 포장할 시간에 내면이나 좀 가꾸세요. 텅 빈 깡통 소리가 요란해서 여기까지 다 들립니다.`,
    `팩트폭행: 기분 나빠도 이게 팩트입니다. 당신의 징글징글한 회피 본능, 이제 그만 도망치고 마주하세요!`,
    `팩트폭행: 세상이 당신 중심으로 돌아가지 않습니다. 망상에서 빠져나와 갓생 좀 살아보세요 제발.`
  ];
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) { hash += title.charCodeAt(i); }
  
  const intro = spicyIntro[hash % spicyIntro.length].replace(/"/g, '\\"');
  const bodyText = spicyBody[(hash + 1) % spicyBody.length].replace(/"/g, '\\"');
  const insight = spicyInsight[(hash + 2) % spicyInsight.length].replace(/"/g, '\\"');
  
  return {
    bodyStr: `["${intro}", "${bodyText}"]`,
    insightStr: `"${insight}"`
  };
}

let totalReplaced = 0;

for (const file of files) {
    const p = path.join(libDir, file);
    let content = fs.readFileSync(p, 'utf8');

    const lines = content.split('\n');
    let needsSave = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Match standard format:  9: { title: '...', body: ..., insight: ... },
        const match = line.match(/^(\s*\d+:\s*\{\s*title:\s*(['"`])(.*?)\2\s*,)[\s\S]*?(insight:\s*(['"`])(.*?)(?<!\\)\5\s*\})?,?$/);
        
        if (match) {
            const prefix = match[1];
            const title = match[3];
            
            const generated = generateMBTIText(title);
            
            lines[i] = `${prefix} body: ${generated.bodyStr}, insight: ${generated.insightStr} },`;
            totalReplaced++;
            needsSave = true;
        }
    }
    
    if (needsSave) {
        fs.writeFileSync(p, lines.join('\n'), 'utf8');
    }
}

console.log(`Successfully rewrote ${totalReplaced} snack test results with double-quotes for MBTI text!`);
