import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Script } from 'node:vm';

const files = ['index.html', 'reports/index.html', 'exceptions/index.html', 'branding.js',
  'health-pdf.js', 'exceptions/pdf.js', 'exceptions/audit.js', 'exceptions/audit.css', 'reports/premium.css', 'addin-config.json', 'icon.svg'];
const read = path => readFileSync(path, 'utf8');
const current = JSON.parse(read('addin-config.json'));
assert.equal(current.version, '0.6.5');
assert.equal(current.name, 'fleetHealthScore');
assert.ok(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(current.supportEmail || ''), 'supportEmail obrigatório no add-in');
assert.ok(current.items.length >= 2, 'MyGeotab exige ao menos uma página ou botão');
for (const item of current.items) {
  assert.ok(item.url.startsWith('https://'), 'Página deve usar HTTPS');
  assert.ok(!item.url.includes('SEU_HOST_PUBLICO'), 'Substitua o endereço de exemplo');
}
assert.ok(current.items.some(item => item.url.includes('/exceptions/')));
assert.ok(!current.items.some(item => item.url.includes('/reports/')), 'Menu Relatório PDF não deve estar no add-in');
for (const item of current.items) {
  assert.ok(item.svgIcon && item.svgIcon.startsWith('https://'), 'Cada menu deve ter svgIcon HTTPS');
}
assert.equal(current.isSigned, false);
assert.ok(existsSync('icon.svg'), 'Ícone do menu ausente');
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
const partSize = Number((logoSrc.match(/const PART_SIZE = (\d+);/) || [])[1]);
assert.ok(partSize > 0 && partSize <= 5000,
  'PART_SIZE deve manter margem sob o limite de 10.000 caracteres do AddInData');
assert.ok(logoSrc.includes('catch(setError)'), 'Fallback de gravação da configuração ausente');
const index = read('index.html');
const exceptionsPage = read('exceptions/index.html');
assert.ok(exceptionsPage.includes('id="dateFrom"') && exceptionsPage.includes('id="dateTo"'),
  'Filtro personalizado de data/hora ausente em Fleet Exception 360');
for (const [name, page] of [['index.html', index], ['exceptions/index.html', exceptionsPage]]) {
  assert.ok(!/Maas|Rotagyn|Tibério|@gmail/i.test(page), 'Possível identificação de cliente: ' + name);
  assert.ok(page.includes('Bruno Henrique Felisbino Gonçalves'), 'Crédito de autoria ausente: ' + name);
  assert.ok(page.includes('class="project-credit"'), 'Rodapé de autoria ausente: ' + name);
  assert.ok(page.includes('/LICENSE'), 'Link da licença MIT ausente: ' + name);
}
const license = read('LICENSE');
assert.ok(license.startsWith('MIT License'));
assert.ok(license.includes('Copyright (c) 2026 Bruno Henrique Felisbino Gonçalves'));
assert.ok(read('README.md').includes('CONTRIBUTING.md'));
assert.ok(existsSync('CONTRIBUTING.md'), 'Orientações de contribuição ausentes');
console.log('Validado: JSON Geotab, assets, páginas, UTF-8, scripts e configuração PDF/QR.');
