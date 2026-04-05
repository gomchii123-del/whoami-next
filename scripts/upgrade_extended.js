// upgrade_extended.js
const fs = require('fs');
const path = require('path');

const libDir = path.resolve(__dirname, '..', 'src', 'lib');
const files = fs.readdirSync(libDir).filter(f => f.startsWith('snack-tests-extended') && f.endsWith('.ts'));

function generateLongText(key, lp) {
  const body = `${key} 테스트 #${lp} - B급 병맛 스타일의 과장된 본문. 마치 폭탄을 들고 산을 오르는 듯한 고통과 흥분을 동시에 느낍니다. "${key}에 빠진 당신은 세상을 뒤흔드는 존재가 됩니다."`;
  const insight = `통찰: ${key} #${lp}은(는) 당신의 숨겨진 어두운 욕망을 폭발시키는 촉매제이며, 이를 통해 새로운 자아를 발견하게 됩니다.`;
  return { body, insight };
}

files.forEach(file => {
  const filePath = path.join(libDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  // Replace each body and insight within the object literals
  content = content.replace(/body:\s*'[^']*'/g, match => {
    const keyMatch = /'([^']+)'/.exec(match);
    const key = keyMatch ? keyMatch[1] : 'unknown';
    const lp = Math.floor(Math.random() * 9) + 1;
    const { body } = generateLongText(key, lp);
    return `body: '${body}'`;
  }).replace(/insight:\s*'[^']*'/g, match => {
    const keyMatch = /'([^']+)'/.exec(match);
    const key = keyMatch ? keyMatch[1] : 'unknown';
    const lp = Math.floor(Math.random() * 9) + 1;
    const { insight } = generateLongText(key, lp);
    return `insight: '${insight}'`;
  });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Upgraded ${file}`);
});
