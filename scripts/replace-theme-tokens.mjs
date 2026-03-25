import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = join(import.meta.dirname, '..', 'src', 'app', 'components');

const files = [
  'MetricDetailModal.tsx',
  'ScorecardCustomization.tsx',
  'keyboard-shortcuts-modal.tsx',
  'analysis-response.tsx',
  'ExecutiveScorecard.tsx',
  'CommentModal.tsx',
  'ChartWidget.tsx',
  'MetricDefinitionModal.tsx',
  'WidgetOptionsMenu.tsx',
  'SourceDataTableModal.tsx',
  'dashboard-card.tsx',
  'AIOverviewSettingsModal.tsx',
  'AIOverviewSection.tsx',
  'MetricBuilderModal.tsx',
  'SourceTableModal.tsx',
  'AskAIPromptModal.tsx',
  'GoldenDashboardCard.tsx',
  'ai-assistant-sidebar.tsx',
];

const spaceMap = {
  '2px': '${Theme.usage.space.xxxSmall}',
  '4px': '${Theme.usage.space.xxSmall}',
  '8px': '${Theme.usage.space.xSmall}',
  '12px': '${Theme.usage.space.small}',
  '16px': '${Theme.usage.space.medium}',
  '24px': '${Theme.usage.space.large}',
  '32px': '${Theme.usage.space.xLarge}',
  '40px': '${Theme.usage.space.xxLarge}',
  '48px': '${Theme.usage.space.xxxLarge}',
};

const fontSizeMap = {
  '12px': '${Theme.usage.fontSize.xxSmall}',
  '14px': '${Theme.usage.fontSize.xSmall}',
  '16px': '${Theme.usage.fontSize.small}',
  '18px': '${Theme.usage.fontSize.medium}',
  '20px': '${Theme.usage.fontSize.xLarge}',
  '24px': '${Theme.usage.fontSize.xxLarge}',
  '32px': '${Theme.usage.fontSize.xxxLarge}',
};

const borderRadiusMap = {
  '4px': '${Theme.usage.borderRadius.small}',
  '8px': '${Theme.usage.borderRadius.medium}',
  '12px': '${Theme.usage.borderRadius.large}',
  '16px': '${Theme.usage.borderRadius.xLarge}',
  '24px': '${Theme.usage.borderRadius.xxLarge}',
  '9999px': '${Theme.usage.borderRadius.full}',
};

const spacingProps = [
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'gap', 'row-gap', 'column-gap',
  'top', 'left', 'right', 'bottom',
  'inset',
];

const skipProps = [
  'width', 'height', 'max-width', 'min-width', 'max-height', 'min-height',
  'box-shadow', 'text-shadow', 'background', 'background-image',
  'filter', 'backdrop-filter',
];

function isInsideStyledTemplate(content, pos) {
  const before = content.substring(0, pos);
  const styledPattern = /styled(?:\.\w+|\([^)]*\))`[^`]*$/s;
  const cssPattern = /css`[^`]*$/s;
  return styledPattern.test(before) || cssPattern.test(before);
}

function extractStyledBlocks(content) {
  const blocks = [];
  const regex = /(styled(?:\.\w+|\([^)]*\))(`)|css(`)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const backtickIdx = match.index + match[0].length - 1;
    let depth = 1;
    let i = backtickIdx + 1;
    let inInterp = 0;
    while (i < content.length && depth > 0) {
      if (content[i] === '$' && content[i + 1] === '{' && inInterp === 0) {
        inInterp++;
        i += 2;
        continue;
      }
      if (inInterp > 0) {
        if (content[i] === '{') inInterp++;
        else if (content[i] === '}') {
          inInterp--;
        }
        i++;
        continue;
      }
      if (content[i] === '`') {
        depth--;
        if (depth === 0) break;
      }
      i++;
    }
    blocks.push({ start: backtickIdx + 1, end: i });
  }
  return blocks;
}

function replacePxInDeclaration(propName, valueStr) {
  const lowerProp = propName.toLowerCase().trim();

  if (skipProps.some(p => lowerProp === p)) return valueStr;
  if (lowerProp === 'border' || lowerProp.startsWith('border-width') || 
      lowerProp === 'border-top' || lowerProp === 'border-bottom' || 
      lowerProp === 'border-left' || lowerProp === 'border-right' ||
      lowerProp === 'outline') return valueStr;

  if (lowerProp === 'font-size') {
    return valueStr.replace(/(\d+)px/g, (match) => {
      return fontSizeMap[match] || match;
    });
  }

  if (lowerProp === 'border-radius') {
    return valueStr.replace(/(\d+)px/g, (match) => {
      return borderRadiusMap[match] || match;
    });
  }

  if (spacingProps.some(p => lowerProp === p)) {
    return valueStr.replace(/(^|[^-])(\d+)px/g, (fullMatch, prefix, num) => {
      const pxVal = `${num}px`;
      if (pxVal.startsWith('-')) return fullMatch;
      return prefix + (spaceMap[pxVal] || pxVal);
    });
  }

  return valueStr;
}

function processBlock(blockContent) {
  const lines = blockContent.split('\n');
  const result = [];

  for (const line of lines) {
    const declMatch = line.match(/^(\s*)([\w-]+)\s*:\s*(.+?)\s*(;?\s*)$/);
    if (declMatch) {
      const [, indent, prop, value, suffix] = declMatch;
      
      if (value.includes('rgba(') || value.includes('linear-gradient') || 
          value.includes('radial-gradient') || value.includes('calc(') ||
          value.includes('shadow') || value.includes('blur(')) {
        result.push(line);
        continue;
      }

      if (value.startsWith('-') && /^-\d+px/.test(value)) {
        result.push(line);
        continue;
      }

      const newValue = replacePxInDeclaration(prop, value);
      if (newValue !== value) {
        result.push(`${indent}${prop}: ${newValue}${suffix}`);
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

let totalChanges = 0;
const summary = [];

for (const file of files) {
  const filePath = join(BASE, file);
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.log(`Skipping ${file}: ${e.message}`);
    continue;
  }

  const original = content;
  const blocks = extractStyledBlocks(content);

  let offset = 0;
  for (const block of blocks) {
    const start = block.start + offset;
    const end = block.end + offset;
    const blockContent = content.substring(start, end);
    const newBlockContent = processBlock(blockContent);
    if (newBlockContent !== blockContent) {
      content = content.substring(0, start) + newBlockContent + content.substring(end);
      offset += newBlockContent.length - blockContent.length;
    }
  }

  if (content !== original) {
    const changes = countDifferences(original, content);
    totalChanges += changes;
    summary.push(`${file}: ${changes} replacements`);
    writeFileSync(filePath, content, 'utf-8');
  } else {
    summary.push(`${file}: no changes needed`);
  }
}

function countDifferences(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  let count = 0;
  const maxLen = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < maxLen; i++) {
    if (aLines[i] !== bLines[i]) count++;
  }
  return count;
}

console.log('\n=== Theme Token Replacement Summary ===\n');
summary.forEach(s => console.log(s));
console.log(`\nTotal lines changed: ${totalChanges}`);
