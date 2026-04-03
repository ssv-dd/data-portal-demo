/**
 * Post-build script: injects a client-side password gate into dist/index.html.
 * Usage: node scripts/add-password-gate.js [password]
 * Default password: dataportal2026
 */
import { readFileSync, writeFileSync } from 'fs';

const password = process.argv[2] || 'dataportal2026';
const htmlPath = new URL('../dist/index.html', import.meta.url).pathname;
const html = readFileSync(htmlPath, 'utf-8');

const gate = `
<script>
(function(){
  var k='_dp_auth';
  if(sessionStorage.getItem(k)==='1') return;
  var p=prompt('Enter password to view this prototype:');
  if(p===${JSON.stringify(password)}){sessionStorage.setItem(k,'1')}
  else{document.title='Access Denied';document.body.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#64748b;font-size:18px">Access denied. Refresh to try again.</div>';throw new Error('auth')}
})();
</script>`;

const patched = html.replace('</head>', gate + '\n  </head>');
writeFileSync(htmlPath, patched);
console.log('Password gate added to dist/index.html');
