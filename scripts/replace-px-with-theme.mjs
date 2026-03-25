#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = '/Users/karan.sonawane/Projects/Data-Portal-AI-Native/src/app/components';

const FILES = [
  'AIWidgetCreator.tsx',
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

const SPACE_MAP = {
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

const FONT_SIZE_MAP = {
  '12px': '${Theme.usage.fontSize.xxSmall}',
  '14px': '${Theme.usage.fontSize.xSmall}',
  '16px': '${Theme.usage.fontSize.small}',
  '18px': '${Theme.usage.fontSize.medium}',
  '20px': '${Theme.usage.fontSize.xLarge}',
  '24px': '${Theme.usage.fontSize.xxLarge}',
  '32px': '${Theme.usage.fontSize.xxxLarge}',
};

const BORDER_RADIUS_MAP = {
  '2px': '${Theme.usage.borderRadius.xSmall}',
  '4px': '${Theme.usage.borderRadius.small}',
  '8px': '${Theme.usage.borderRadius.medium}',
  '12px': '${Theme.usage.borderRadius.large}',
  '16px': '${Theme.usage.borderRadius.xLarge}',
  '24px': '${Theme.usage.borderRadius.xxLarge}',
  '9999px': '${Theme.usage.borderRadius.full}',
};

const SPACE_PROPERTIES = [
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'gap', 'top', 'left', 'right', 'bottom', 'inset',
  'row-gap', 'column-gap',
];

const SKIP_PROPERTIES = [
  'width', 'height', 'max-width', 'min-width', 'max-height', 'min-height',
  'box-shadow', 'backdrop-filter', 'filter', 'blur', 'translate',
  'border-width', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
  'outline', 'stroke-width', 'letter-spacing', 'line-height',
];

function extractStyledBlocks(content) {
  const blocks = [];
  const styledRegex = /styled(?:\.\w+|\(\w+\))(?:<[^>]*>)?\s*`/g;
  const cssRegex = /css\s*`/g;
  
  function findBlocks(regex) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const startIdx = match.index + match[0].length;
      let depth = 1;
      let i = startIdx;
      while (i < content.length && depth > 0) {
        if (content[i] === '`' && content[i - 1] !== '\\') {
          depth--;
        } else if (content[i] === '$' && content[i + 1] === '{') {
          let braceDepth = 1;
          i += 2;
          while (i < content.length && braceDepth > 0) {
            if (content[i] === '{') braceDepth++;
            else if (content[i] === '}') braceDepth--;
            if (content[i] === '`') {
              let innerStart = i + 1;
              let innerEnd = content.indexOf('`', innerStart);
              if (innerEnd !== -1) i = innerEnd;
            }
            i++;
          }
          continue;
        }
        i++;
      }
      if (depth === 0) {
        blocks.push({ start: match.index, end: i, templateStart: startIdx, templateEnd: i - 1 });
      }
    }
  }
  
  findBlocks(styledRegex);
  findBlocks(cssRegex);
  
  return blocks.sort((a, b) => a.start - b.start);
}

function replacePxInCSSLine(line, isInsideExpression) {
  if (isInsideExpression) return line;

  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return line;

  if (trimmed.startsWith('&') || trimmed.startsWith('@') || trimmed === '{' || trimmed === '}') return line;

  const colonIdx = trimmed.indexOf(':');
  if (colonIdx === -1) return line;

  const property = trimmed.substring(0, colonIdx).trim().toLowerCase();
  let valueStr = trimmed.substring(colonIdx + 1).trim();

  if (valueStr.endsWith(';')) valueStr = valueStr.slice(0, -1).trim();

  if (SKIP_PROPERTIES.some(sp => property === sp || property.startsWith(sp + '-'))) return line;
  if (property === 'border' || /^border-(top|bottom|left|right)$/.test(property)) return line;

  if (property === 'font-size') {
    let newLine = line;
    for (const [px, token] of Object.entries(FONT_SIZE_MAP)) {
      const regex = new RegExp(`(?<![\\w$\\-])${px.replace('.', '\\.')}(?!\\s*[,)])`, 'g');
      newLine = newLine.replace(regex, (match, offset) => {
        const before = newLine.substring(0, offset);
        if (before.includes('${') && !before.includes('}')) return match;
        if (/rgba|linear-gradient|blur|translate/.test(before.slice(-30))) return match;
        return token;
      });
    }
    return newLine;
  }

  if (property === 'border-radius') {
    let newLine = line;
    for (const [px, token] of Object.entries(BORDER_RADIUS_MAP)) {
      const escapedPx = px.replace('.', '\\.');
      const regex = new RegExp(`(?<![\\w$\\-])${escapedPx}(?![\\w])`, 'g');
      newLine = newLine.replace(regex, (match, offset) => {
        const before = newLine.substring(0, offset);
        if (before.includes('${') && !before.includes('}')) return match;
        return token;
      });
    }
    return newLine;
  }

  if (SPACE_PROPERTIES.includes(property)) {
    let newLine = line;
    const sortedPx = Object.keys(SPACE_MAP).sort((a, b) => parseInt(b) - parseInt(a));
    for (const px of sortedPx) {
      const token = SPACE_MAP[px];
      const escapedPx = px.replace('.', '\\.');
      const regex = new RegExp(`(?<![\\w$\\-])${escapedPx}(?![\\w])`, 'g');
      newLine = newLine.replace(regex, (match, offset) => {
        const before = newLine.substring(0, offset);
        if (before.includes('${') && !before.includes('}')) return match;
        if (/rgba|linear-gradient|blur|translate/.test(before.slice(-30))) return match;
        const lineBeforeMatch = newLine.substring(Math.max(0, offset - 5), offset);
        if (lineBeforeMatch.match(/-$/)) return match;
        return token;
      });
    }
    return newLine;
  }

  return line;
}

function processStyledBlock(blockContent) {
  const lines = blockContent.split('\n');
  const newLines = [];
  let insideExpression = 0;

  for (const line of lines) {
    if (insideExpression > 0) {
      let newInsideExpression = insideExpression;
      for (const ch of line) {
        if (ch === '{') newInsideExpression++;
        else if (ch === '}') newInsideExpression--;
      }
      newLines.push(line);
      insideExpression = newInsideExpression;
      continue;
    }

    let expDepth = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '$' && line[i + 1] === '{') {
        expDepth++;
        i++;
      } else if (line[i] === '{' && expDepth > 0) {
        expDepth++;
      } else if (line[i] === '}' && expDepth > 0) {
        expDepth--;
      }
    }

    if (expDepth > 0) {
      insideExpression = expDepth;
      newLines.push(line);
      continue;
    }

    const hasInterpolation = /\$\{[^}]*\}/.test(line);

    const trimmed = line.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0) {
      const propCandidate = trimmed.substring(0, colonIdx).trim().toLowerCase();
      if (propCandidate.match(/^[a-z\-]+$/)) {
        newLines.push(replacePxInCSSLine(line, false));
        continue;
      }
    }

    newLines.push(line);
  }

  return newLines.join('\n');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let changeCount = 0;

  const blocks = extractStyledBlocks(content);

  let offset = 0;
  for (const block of blocks) {
    const tStart = block.templateStart + offset;
    const tEnd = block.templateEnd + offset;
    const blockContent = content.substring(tStart, tEnd);
    const newBlockContent = processStyledBlock(blockContent);

    if (newBlockContent !== blockContent) {
      content = content.substring(0, tStart) + newBlockContent + content.substring(tEnd);
      offset += newBlockContent.length - blockContent.length;

      const oldLines = blockContent.split('\n');
      const newLines = newBlockContent.split('\n');
      for (let i = 0; i < oldLines.length; i++) {
        if (oldLines[i] !== newLines[i]) changeCount++;
      }
    }
  }

  if (content !== originalContent) {
    if (content.includes("from '@doordash/prism-react'")) {
      const importRegex = /import\s*\{([^}]*)\}\s*from\s*'@doordash\/prism-react'/;
      const match = content.match(importRegex);
      if (match && !match[1].includes('Theme')) {
        const existingImports = match[1].trim();
        content = content.replace(
          importRegex,
          `import { ${existingImports}, Theme } from '@doordash/prism-react'`
        );
      }
    } else {
      const importLines = content.match(/^import .+$/gm);
      if (importLines) {
        const lastImportIdx = content.lastIndexOf(importLines[importLines.length - 1]);
        const lastImportEnd = lastImportIdx + importLines[importLines.length - 1].length;
        content =
          content.substring(0, lastImportEnd) +
          "\nimport { Theme } from '@doordash/prism-react';" +
          content.substring(lastImportEnd);
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return { changeCount, modified: content !== originalContent };
}

const summary = {};
for (const file of FILES) {
  const filePath = path.join(COMPONENTS_DIR, file);
  try {
    const result = processFile(filePath);
    summary[file] = result;
    console.log(`${file}: ${result.changeCount} CSS properties updated, modified: ${result.modified}`);
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
    summary[file] = { error: err.message };
  }
}

console.log('\n--- Summary ---');
for (const [file, result] of Object.entries(summary)) {
  if (result.error) {
    console.log(`  ${file}: ERROR - ${result.error}`);
  } else {
    console.log(`  ${file}: ${result.changeCount} changes, modified: ${result.modified}`);
  }
}
