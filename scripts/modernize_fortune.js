// modernize_fortune.js
const fs = require('fs');
const path = require('path');

// Directory containing all snack test files
const libDir = path.resolve(__dirname, '..', 'src', 'lib');
const files = fs.readdirSync(libDir).filter(f => f.startsWith('snack-tests') && f.endsWith('.ts'));

const modernBodies = [
  '오늘은 새로운 도전을 받아들일 때. 용기를 내세요!',
  '작은 실수는 큰 성장의 씨앗이 된다.',
  '당신의 직감이 오늘의 길잡이가 된다.',
  '휴식이 필요하면 몸과 마음을 멈추세요.',
  '새로운 사람과의 대화가 뜻밖의 기회를 만든다.',
  '과감한 선택이 미래를 바꾼다.',
  '오늘은 자신에게 친절을 베풀어라.',
  '작은 습관이 큰 변화를 만든다.',
  '당신의 열정이 주변을 밝힌다.',
  '잠시 멈추고 깊게 숨을 쉬어라.'
];

const modernInsights = [
  '당신의 선택이 오늘의 운을 바꾼다.',
  '내면의 목소리를 듣는 것이 핵심이다.',
  '작은 행동이 큰 결과를 만든다.',
  '긍정적인 마인드가 기회를 끌어온다.',
  '자신을 믿고 나아가라.',
  '새로운 시도가 새로운 길을 연다.',
  '감정을 솔직히 표현하면 관계가 깊어진다.',
  '지금의 순간을 놓치지 마라.',
  '당신의 열정이 주변을 밝힌다.',
  '작은 습관이 큰 변화를 만든다.'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

files.forEach(file => {
  const filePath = path.join(libDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  // Replace body strings
  content = content.replace(/body:\s*'[^']*'/g, match => {
    const newBody = randomItem(modernBodies);
    return `body: '${newBody}'`;
  });
  // Replace insight strings
  content = content.replace(/insight:\s*'[^']*'/g, match => {
    const newInsight = randomItem(modernInsights);
    return `insight: '${newInsight}'`;
  });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Modernized ${file}`);
});
