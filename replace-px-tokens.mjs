import fs from 'fs';

const spacingMap = {
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
  '2px': '${Theme.usage.borderRadius.xSmall}',
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
  'gap', 'top', 'left', 'right', 'bottom', 'inset',
  'row-gap', 'column-gap',
];

const skipProps = [
  'width', 'height', 'max-width', 'min-width', 'max-height', 'min-height',
  'box-shadow', 'backdrop-filter', 'blur', 'translate', 'border-width',
  'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
  'letter-spacing', 'line-height', 'stroke-width', 'opacity',
];

function extractStyledBlocks(content) {
  const blocks = [];
  const styledRegex = /styled(?:\.\w+|\([^)]+\))`/g;
  const cssRegex = /css`/g;
  
  function findTemplateEnd(str, startIdx) {
    let depth = 0;
    for (let i = startIdx; i < str.length; i++) {
      if (str[i] === '`' && depth === 0) return i;
      if (str[i] === '$' && str[i + 1] === '{') {
        depth++;
        i++;
      } else if (str[i] === '}' && depth > 0) {
        depth--;
      }
    }
    return -1;
  }
  
  let match;
  
  styledRegex.lastIndex = 0;
  while ((match = styledRegex.exec(content)) !== null) {
    const backtickIdx = match.index + match[0].length - 1;
    const endIdx = findTemplateEnd(content, backtickIdx + 1);
    if (endIdx !== -1) {
      blocks.push({ start: backtickIdx + 1, end: endIdx });
    }
  }
  
  cssRegex.lastIndex = 0;
  while ((match = cssRegex.exec(content)) !== null) {
    const backtickIdx = match.index + match[0].length - 1;
    const endIdx = findTemplateEnd(content, backtickIdx + 1);
    if (endIdx !== -1) {
      blocks.push({ start: backtickIdx + 1, end: endIdx });
    }
  }
  
  return blocks;
}

function replacePxInBlock(block) {
  let result = block;
  let changes = [];
  
  const lines = result.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return line;
    
    const propMatch = trimmed.match(/^([a-z-]+)\s*:/i);
    if (!propMatch) return line;
    
    const prop = propMatch[1].toLowerCase();
    
    if (skipProps.some(sp => prop === sp || prop.startsWith(sp + '-'))) return line;
    
    if (prop === 'font-size') {
      let newLine = line;
      for (const [px, token] of Object.entries(fontSizeMap)) {
        const regex = new RegExp(`(?<![-\\d])${px.replace('px', '')}px(?!\\d)`, 'g');
        if (regex.test(newLine)) {
          newLine = newLine.replace(regex, token);
          changes.push(`font-size: ${px} → ${token}`);
        }
      }
      return newLine;
    }
    
    if (prop === 'border-radius') {
      let newLine = line;
      for (const [px, token] of Object.entries(borderRadiusMap)) {
        const regex = new RegExp(`(?<![-\\d])${px.replace('px', '')}px(?!\\d)`, 'g');
        if (regex.test(newLine)) {
          newLine = newLine.replace(regex, token);
          changes.push(`border-radius: ${px} → ${token}`);
        }
      }
      return newLine;
    }
    
    if (spacingProps.includes(prop)) {
      let newLine = line;
      for (const [px, token] of Object.entries(spacingMap)) {
        const regex = new RegExp(`(?<![-\\d])${px.replace('px', '')}px(?!\\d)`, 'g');
        if (regex.test(newLine)) {
          newLine = newLine.replace(regex, token);
          changes.push(`${prop}: ${px} → ${token}`);
        }
      }
      return newLine;
    }
    
    return line;
  });
  
  return { result: processedLines.join('\n'), changes };
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const blocks = extractStyledBlocks(content);
  
  blocks.sort((a, b) => b.start - a.start);
  
  let allChanges = [];
  
  for (const block of blocks) {
    const blockContent = content.substring(block.start, block.end);
    const { result, changes } = replacePxInBlock(blockContent);
    if (changes.length > 0) {
      content = content.substring(0, block.start) + result + content.substring(block.end);
      allChanges.push(...changes);
    }
  }
  
  fs.writeFileSync(filePath, content);
  return allChanges;
}

const basePath = '/Users/karan.sonawane/Projects/Data-Portal-AI-Native/src/app/components/';

const files = [
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

for (const file of files) {
  const filePath = basePath + file;
  const changes = processFile(filePath);
  console.log(`\n=== ${file} (${changes.length} replacements) ===`);
  const uniqueChanges = [...new Set(changes)];
  for (const c of uniqueChanges) {
    console.log(`  ${c}`);
  }
}
