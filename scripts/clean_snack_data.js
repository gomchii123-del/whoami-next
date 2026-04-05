// scripts/clean_snack_data.js
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'src', 'lib');
const filePattern = /^snack-tests(?:-extended\d+)?\.ts$/;

const prohibitedRegex = /\b(LP\s*\d*|운명수|본질수|건설자|내면이\s*이\s*결과를\s*변형시킨다|핵심\s*분석)\b/gi;

function generatePlaceholder(title) {
  return `당신은 ${title} 유형입니다. ${title}은(는) 세상에 충격을 주는 존재이며, 주변은 언제나 혼란에 빠집니다. 결국 당신은 자신만의 독특한 길을 걷게 됩니다.`;
}

function cleanseContent(content) {
  // Remove prohibited terms globally
  let newContent = content.replace(prohibitedRegex, '');

  // Replace any string literal that still contains prohibited terms (or became empty) with placeholder
  const titleMatch = newContent.match(/title\s*[:=]\s*['"]([^'"]+)['"]/i);
  const title = titleMatch ? titleMatch[1].trim() : '테스트';
  const placeholder = generatePlaceholder(title);

  // Replace all single-quoted or double-quoted literals that are empty or contain leftover prohibited words
  newContent = newContent.replace(/(['"]).*?\1/g, (m) => {
    if (prohibitedRegex.test(m) || m.replace(/['"]/g, '').trim() === '') {
      return `'${placeholder}'`;
    }
    return m;
  });
  return newContent;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const cleaned = cleanseContent(content);
  fs.writeFileSync(filePath, cleaned, 'utf-8');
  console.log(`Processed ${path.basename(filePath)}`);
}

fs.readdirSync(baseDir).forEach(file => {
  if (filePattern.test(file)) {
    const fullPath = path.join(baseDir, file);
    processFile(fullPath);
  }
});

console.log('Data cleansing completed.');
