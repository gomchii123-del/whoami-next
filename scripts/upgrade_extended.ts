// upgrade_extended.ts
import * as fs from 'fs';
import * as path from 'path';

const libDir = path.resolve(__dirname, '..', '..', 'src', 'lib');
const files = fs.readdirSync(libDir).filter(f => f.startsWith('snack-tests-extended') && f.endsWith('.ts'));

function generateLongText(key: string, lp: number) {
  const body = `${key} 테스트 #${lp} - 이건 B급 병맛 스타일의 긴 본문입니다. 상황을 과장하고, 독특한 비유와 충격적인 어조로 독자를 끌어당깁니다. 예를 들어, "${key}에 빠진 당신은 마치 폭탄을 들고 산을 오르는 듯한 고통과 흥분을 동시에 느낍니다."`; 
  const insight = `통찰: ${key} #${lp}은(는) 당신의 내면에 숨겨진 어두운 욕망을 폭발시키는 촉매제이며, 이를 통해 새로운 자아를 발견하게 됩니다.`;
  return { body, insight };
}

files.forEach(file => {
  const filePath = path.join(libDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  // Simple regex to replace body and insight strings inside each entry
  const updated = content.replace(/body:\s*'[^']*'/g, (match) => {
    const keyMatch = /'(.*?)'/.exec(match);
    const key = keyMatch ? keyMatch[1] : 'unknown';
    const lp = Math.floor(Math.random() * 9) + 1;
    const { body } = generateLongText(key, lp);
    return `body: '${body}'`;
  }).replace(/insight:\s*'[^']*'/g, (match) => {
    const keyMatch = /'(.*?)'/.exec(match);
    const key = keyMatch ? keyMatch[1] : 'unknown';
    const lp = Math.floor(Math.random() * 9) + 1;
    const { insight } = generateLongText(key, lp);
    return `insight: '${insight}'`;
  });
  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`Upgraded ${file}`);
});
