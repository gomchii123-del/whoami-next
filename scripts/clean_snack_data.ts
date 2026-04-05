// scripts/clean_snack_data.ts
import * as fs from 'fs';
import * as path from 'path';

const baseDir = path.resolve(__dirname, '..', 'src', 'lib');
const filePattern = /^snack-tests(?:-extended\d+)?\.ts$/;

const prohibitedRegex = /\b(LP\s*\d*|운명수|본질수|건설자|내면이\s*이\s*결과를\s*변형시킨다|핵심\s*분석)\b/gi;

function generatePlaceholder(title: string): string {
  return `당신은 ${title} 유형입니다. ${title}은(는) 세상에 충격을 주는 존재이며, 주변은 언제나 혼란에 빠집니다. 결국 당신은 자신만의 독특한 길을 걷게 됩니다.`;
}

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Remove prohibited terms globally
  content = content.replace(prohibitedRegex, '');

  // Replace description fields with placeholder based on title
  // Find all objects with a title field
  const titleRegex = /title\s*[:=]\s*['"]([^'\"]+)['"]/g;
  const matches = [...content.matchAll(titleRegex)];
  matches.forEach(match => {
    const title = match[1].trim();
    const placeholder = generatePlaceholder(title);
    // Replace following description field if exists
    const descRegex = new RegExp(`(description\s*[:=]\s*)['"][^'\"]*['"]`, 'g');
    content = content.replace(descRegex, `$1'${placeholder}'`);
  });

  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Processed ${path.basename(filePath)}`);
}

fs.readdirSync(baseDir).forEach(file => {
  if (filePattern.test(file)) {
    const fullPath = path.join(baseDir, file);
    processFile(fullPath);
  }
});

console.log('Data cleansing completed.');
