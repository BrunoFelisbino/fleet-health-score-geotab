import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Script } from 'node:vm';

const files = ['index.html', 'reports/index.html', 'exceptions/index.html', 'branding.js',
  'health-pdf.js', 'exceptions/pdf.js', 'exceptions/audit.js', 'exceptions/audit.css', 'reports/premium.css', 'addin-config.json'];
const read = path => readFileSync(path, 'utf8');
const current = JSON.parse(read('addin-config.json'));
assert.equal(current.version, '0.6.2');
assert.equal(current.name, 'fleetHealthScore');
assert.ok(current.items.length >= 2, 'MyGeotab exige ao menos uma página ou botão');
for (const item of current.items) {
  assert.ok(item.url.startsWith('https://'), 'Página deve usar HTTPS');
  assert.ok(!item.url.includes('SEU_HOST_PUBLICO'), 'Substitua o endereço de exemplo');
}
assert.ok(current.items.some(item => item.url.includes('/exceptions/')));
assert.ok(existsSync('reports/index.html'), 'Menu legado Relatório PDF deve continuar acessível');
for (const file of files) {
  const code = read(file);
  assert.ok(!/[├┬╣]|ÔÇ|�/.test(code), 'Codificação UTF-8 inválida: ' + file);
  if (/\.(js)$/.test(file)) new Script(code, { filename: file });
  if (file.endsWith('.html')) {
    const script = code.match(/<script>\s*([\s\S]*?)<\/script>/);
    assert.ok(script, 'Script principal ausente: ' + file);
    new Script(script[1], { filename: file });
    for (const [, link] of code.matchAll(/(?:src|href)="(\.{1,2}\/[^"]+)"/g)) {
      const location = resolve(dirname(file), link.split('?')[0]);
      assert.ok(existsSync(location), 'Arquivo referenciado não existe: ' + file + ' -> ' + link);
    }
  }
}
const logoSrc = read('branding.js');
assert.ok(logoSrc.includes('function encodePdfPng('));
assert.ok(logoSrc.includes('Configurar PDF'));
assert.ok(logoSrc.includes('const IMAGE_PART_KEY'));
const index = read('index.html');
assert.ok(!/Maas|Rotagyn|Tibério|Felisbino|@gmail/i.test(index));
assert.ok(!/Maas|Rotagyn|Tibério|Felisbino|@gmail/i.test(read('exceptions/index.html')));
console.log('Validado: JSON Geotab, assets, páginas, UTF-8, scripts e configuração PDF/QR.');
