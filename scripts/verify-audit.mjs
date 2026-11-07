import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read=path=>readFileSync(path,'utf8');
const captured=[];
const win={
  FleetBranding:{logoHtml:()=>'',siteUrl:()=>''},
  print:()=>captured.push(stage.innerHTML)
};
runInNewContext(read('exceptions/audit.js'),{window:win,Date,Intl});
const stage={
  innerHTML:'',style:{setProperty(){}},
  querySelectorAll(selector){
    if(selector==='.pdf-page')return Array.from({length:(this.innerHTML.match(/class="pdf-page\b/g)||[]).length});
    return [];
  },
  querySelector(){return null}
};
const elements={
  pdfStage:stage,
  pdfBtn:{disabled:false,textContent:'Baixar PDF'},
  alertBox:{style:{},className:'',textContent:''},
  statusBox:{textContent:''}
};
const doc={getElementById:id=>elements[id]||null,fonts:{ready:Promise.resolve()}};
runInNewContext(read('exceptions/pdf.js'),{
  window:win,document:doc,Date,Intl,URL,setTimeout:cb=>cb()
});
const vehicle='teste-1';
const ev=(id,ruleId,ruleName,count,start,end)=>({
  id,veiculoId:vehicle,deviceId:vehicle,
  veiculo:'Ativo de teste',placa:'TESTE',
  regraId:ruleId,regraNome:ruleName,exceptionCount:count,
  activeFrom:start,activeTo:end,state:'ExceptionEventStateAcknowledgedId',
  durationMs:new Date(end).getTime()-new Date(start).getTime()
});
const input=[
  ev('evt-a','rule-a','Harsh Braking',3,'2026-11-07T12:00:00Z','2026-11-07T12:03:00Z'),
  ev('evt-b','rule-b','Regra especial',null,'2026-11-07T13:00:00Z','2026-11-07T13:01:00Z')
];
const ctx={filtered:input,vehicles:[{veiculoId:vehicle}],problemFilter:'',rulesLabel:id=>id};
const a=win.Exception360Audit;
assert.equal(a.ruleTranslation('Harsh Braking'),'Frenagem brusca');
assert.equal(a.ruleTranslation('Regra especial'),'Regra especial');
assert.equal(a.count(input[1]).exact,false);
assert.equal(a.rows(input)[0].id,'evt-b');
assert.ok(a.exportCsv(input).includes('Contagem exata'));

await win.Exception360Pdf.download({...ctx,mode:'summary'});
await win.Exception360Pdf.download({...ctx,mode:'audit'});
assert.equal(captured.length,2);
const countPages=html=>(html.match(/class="pdf-page\b/g)||[]).length;
assert.equal(countPages(captured[0]),4,'Resumo preserva as quatro páginas originais.');
assert.ok(countPages(captured[1])>countPages(captured[0]),'Auditoria acrescenta páginas.');
assert.ok(!captured[0].includes('Auditoria — Eventos'),'Resumo não deve conter auditoria.');
for(const value of ['Frenagem brusca','Harsh Braking','Regra especial','evt-a','evt-b',
                    'rule-a','rule-b','Reconhecido','sem exceptionCount']){
  assert.ok(captured[1].includes(value),'Dado auditável ausente: '+value);
}
const ui=read('exceptions/index.html');
assert.ok(ui.includes('Resumo — formato atual') && ui.includes('Auditoria detalhada'));
assert.ok(ui.includes('data-audit-id='));
assert.ok(ui.includes('PDF detalhado deste veículo'));
console.log('Auditoria e PDF: dois formatos, tradução segura, originais e IDs preservados.');
