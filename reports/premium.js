(function(){
'use strict';

// Logotipo embutido em Base64 para evitar latência de rede e problemas de CORS
const LOGO='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MjAgMTcwIj48cmVjdCB3aWR0aD0iNjIwIiBoZWlnaHQ9IjE3MCIgcng9IjE4IiBmaWxsPSJ3aGl0ZSIvPjxnIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iOTAwIj48dGV4dCB4PSIxOCIgeT0iOTgiIGZvbnQtc2l6ZT0iOTIiIGZpbGw9IiMzMjM4NDQiIGxldHRlci1zcGFjaW5nPSItOCI+Uk9UPC90ZXh0PjxwYXRoIGQ9Ik0yNDYgMjggTDMwNCAxMDMgTDI2NyAxMDMgTDI1NyA4OSBMMjM0IDg5IEwyMjQgMTAzIEwxOTAgMTAzIFoiIGZpbGw9IiMzMjM4NDQiLz48cGF0aCBkPSJNMjQ2IDUwIEwyMzYgNzMgSDI1NSBaIiBmaWxsPSIjZmZmZmZmIi8+PHRleHQgeD0iMzA1IiB5PSI5OCIgZm9udC1zaXplPSI5MiIgZmlsbD0iIzExNzhiZSIgbGV0dGVyLXNwYWNpbmc9Ii04Ij5HWU48L3RleHQ+PHRleHQgeD0iMzUwIiB5PSIxMjYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM1YjZiN2QiIGZvbnQtd2VpZ2h0PSI3MDAiPlBvd2VyZWQgYnk8L3RleHQ+PHRleHQgeD0iNDIwIiB5PSIxMjYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMxZTRmOGYiIGZvbnQtd2VpZ2h0PSI4MDAiPkNoZWNrVE9UQUw8L3RleHQ+PC9nPjwvc3ZnPg==';
const DAY=86400000;
let apiRef=null,stateRef={},vehicles=[],filtered=[],dbName='Rotagyn';
const $=id=>document.getElementById(id);
const pct=(a,b)=>b?Math.round((a/b)*100):0;
const clean=s=>String(s||'Rotagyn').replace(/[\\/:*?"<>|]+/g,'-').trim()||'Rotagyn';
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const apiGet=(api,type,search)=>new Promise((ok,err)=>api.call('Get',{typeName:type,search:search||{}},ok,err));
function scColor(s){return s>=80?'#10b981':s>=60?'#f59e0b':s>=40?'#f97316':'#ef4444'}
function scVar(s){return s>=80?'var(--green)':s>=60?'var(--yellow)':s>=40?'var(--orange)':'var(--red)'}
function scLabel(s){return s>=80?'Saudável':s>=60?'Atenção':s>=40?'Crítico':'Risco alto'}
function scClass(s){return s>=80?'okb':s>=60?'warnb':s>=40?'orangeb':'riskb'}
function pdfBadge(s){return s>=80?'pdf-ok':s>=60?'pdf-warn':s>=40?'pdf-critical':'pdf-risk'}
function has(t,arr){t=String(t||'').toLowerCase();return arr.some(x=>t.includes(x.toLowerCase()))}
function dname(r){return String(r&&r.diagnostic&&(r.diagnostic.id||r.diagnostic.name)||'')}
function eventDate(r){return r.dateTime||r.activeFrom||r.fromDate||r.startTime||r.addDate||null}
function fmtDate(d){try{return new Date(d).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return String(d||'')}}
function uniqDates(list){const seen={};return list.filter(Boolean).sort((a,b)=>new Date(b)-new Date(a)).filter(d=>{let k;try{k=new Date(d).toISOString()}catch(e){k=String(d)}if(seen[k])return false;seen[k]=true;return true})}
function unplug(r){const n=dname(r).toLowerCase();return n.includes('diagnosticdevicehasbeenunpluggedid')||n.includes('devicehasbeenunplugged')||n.includes('unplugged')||n.includes('desconectado')||n.includes('removido')||n.includes('remoção')||n.includes('remocao')}
function problem(v){let m=v.unplugged>0?'Possível remoção não autorizada':v.dias>=7?'Sem dados '+v.dias+' dias':v.vlow>0?'Tensão baixa':v.vhigh>0?'Tensão alta':v.reboots>2?'Reboot excessivo':v.gps>0?'Falha GPS':v.faults>0?'Falha device':'Sem alerta crítico';
 if(v.minV!==null&&(v.vlow>0||v.vhigh>0))m+=` (${v.minV.toFixed(1)}V - ${v.maxV.toFixed(1)}V)`;return m}
function executive(avg){if(avg>=80)return'A frota apresenta um cenário saudável, com baixa incidência de falhas críticas e boa estabilidade operacional.';if(avg>=60)return'A frota está em atenção. Existem indícios claros de degradação operacional que exigem ação preventiva.';return'A frota está em estado crítico. É necessário atuar imediatamente nos veículos com maior risco operacional.'}

// Configuração de pesos para facilitar ajustes futuros
const SCORE_WEIGHTS = {
  COMMUNICATION: { max: 30, steps: [ { d: 1, p: 30 }, { d: 2, p: 22 }, { d: 4, p: 12 }, { d: 7, p: 5 } ] },
  REBOOTS: { max: 20, penalty: [ { c: 0, p: 20 }, { c: 2, p: 15 }, { c: 5, p: 10 }, { c: 10, p: 5 } ] },
  REBOOTS_24V: { max: 20, penalty: [ { c: 0, p: 20 }, { c: 1, p: 10 }, { c: 2, p: 0 } ] },
  GPS: { max: 15, penalty: [ { c: 0, p: 15 }, { c: 3, p: 11 }, { c: 10, p: 7 } ] },
  VOLTAGE: { max: 20, penalty: [ { c: 0, p: 20 }, { c: 5, p: 15 }, { c: 20, p: 9 } ] },
  VOLTAGE_24V: { max: 20, penalty: [ { c: 0, p: 20 }, { c: 2, p: 8 }, { c: 5, p: 0 } ] },
  FAULTS: { max: 15, penalty: [ { c: 0, p: 15 }, { c: 2, p: 10 }, { c: 6, p: 5 } ] }
};

function analyze(records,v){
 const a={reboots:0,gps:0,vlow:0,vhigh:0,faults:0,unplugged:0,minV:null,maxV:null,voltageTotal:0,removalDates:[]};
 records.forEach(r=>{const n=dname(r),val=Number(r.data);if(unplug(r)){a.unplugged++;const d=eventDate(r);if(d)a.removalDates.push(d)}if(has(n,['reboot','restart']))a.reboots++;if(has(n,['gps invalid','gps failure','no gps','gps']))a.gps++;if(has(n,['device fault','internal device','malfunction']))a.faults++;if(has(n,['external voltage','device voltage','battery voltage','voltage'])&&!isNaN(val)){a.voltageTotal++;a.minV=a.minV==null?val:Math.min(a.minV,val);a.maxV=a.maxV==null?val:Math.max(a.maxV,val);if(val<20){if(val<9)a.vlow++;if(val>14)a.vhigh++}else{if(val<18)a.vlow++;if(val>28)a.vhigh++}}});
 a.is24v = a.maxV > 18;
 let p=0,ds=v.lastDate?Math.floor((Date.now()-new Date(v.lastDate).getTime())/DAY):999;
 
 // Aplicação dinâmica de scores baseada na configuração
 const comm = SCORE_WEIGHTS.COMMUNICATION.steps.find(s => ds < s.d);
 p += comm ? comm.p : 0;

 const rebRule = a.is24v ? SCORE_WEIGHTS.REBOOTS_24V : SCORE_WEIGHTS.REBOOTS;
 const reb = rebRule.penalty.find(s => a.reboots <= s.c);
 p += reb ? reb.p : 0;

 const gpsPenalty = SCORE_WEIGHTS.GPS.penalty.find(s => a.gps <= s.c);
 p += gpsPenalty ? gpsPenalty.p : 0;

 const vb=a.vlow+a.vhigh;
 const vRule = a.is24v ? SCORE_WEIGHTS.VOLTAGE_24V : SCORE_WEIGHTS.VOLTAGE;
 const vPenalty = vRule.penalty.find(s => vb <= s.c);
 p += vPenalty ? vPenalty.p : 0;

 p+=a.faults===0?15:a.faults<=2?10:a.faults<=6?5:0;
 if(a.unplugged>0)p=Math.min(p,25); if(ds>=7)p=Math.min(p,45);
 a.score=Math.max(0,Math.round(p));a.dias=ds;a.removalDates=uniqDates(a.removalDates);a.removalDatesText=a.removalDates.length?a.removalDates.slice(0,3).map(fmtDate).join(' | '):'-';a.lastRemovalDate=a.removalDates.length?fmtDate(a.removalDates[0]):'-';return a;
}
function summary(list){const total=list.length||1,avg=Math.round(list.reduce((s,v)=>s+v.score,0)/total);return{total:list.length,avg,healthy:list.filter(v=>v.score>=80).length,attention:list.filter(v=>v.score>=60&&v.score<80).length,critical:list.filter(v=>v.score<60&&v.score>=40).length,risk:list.filter(v=>v.score<40).length,nodata:list.filter(v=>v.dias>=7).length,unplugged:list.filter(v=>v.unplugged>0).length,voltage:list.filter(v=>v.vlow+v.vhigh>0).length,gps:list.filter(v=>v.gps>0).length,reboot:list.filter(v=>v.reboots>2).length}}
function topProblems(list){const s=summary(list);return[{label:'Sem dados 7d+',value:s.nodata,color:'#ef4444'},{label:'Tensão fora',value:s.voltage,color:'#f97316'},{label:'Falha GPS',value:s.gps,color:'#f59e0b'},{label:'Reboot excessivo',value:s.reboot,color:'#0ea5e9'},{label:'Desconexão',value:s.unplugged,color:'#dc2626'}]}
function getDb(api,state){return(state&&(state.database||state.databaseName))||(api&&api.credentials&&api.credentials.database)||localStorage.getItem('fleetReportName')||'Rotagyn'}
function status(t){const e=$('statusBox');if(e)e.textContent=t}
function alertMsg(t,cls){const e=$('alertBox');if(!e)return;e.className='alert '+(cls||'');e.innerHTML=t||''}
function shell(){
 $('app').innerHTML=`<div class="head"><div class="brand"><img class="logo" src="${LOGO}"><div><div class="title">Fleet Health Reports</div><div class="sub">RELATÓRIO PDF PREMIUM • GEOTAB ADD-IN</div></div></div><div class="pill" id="statusBox">Conectando...</div></div><div class="bar"><button class="primary" id="loadBtn">Gerar análise</button><button class="soft" id="pdfBtn">Baixar PDF premium</button><button id="csvBtn">Exportar CSV</button><button id="demoBtn">Dados simulados</button><input id="reportName" placeholder="Nome do banco/base" value="${esc(dbName)}"><select id="scoreFilter"><option value="">Todos os veículos</option><option value="critical">Críticos + risco alto</option><option value="nodata">Sem dados 7d+</option><option value="voltage">Tensão fora</option><option value="removal">Possível remoção</option><option value="v24">Veículos 24V (Caminhões)</option></select></div><div class="info"><span>Base ativa: <b>30 dias</b></span><span>Score: <b>7 dias</b></span><span>Banco/Base: <b id="dbBox">${esc(dbName)}</b></span><span>Veículos no relatório: <b id="countBox">0</b></span></div><div id="alertBox" class="alert">Use dentro do MyGeotab para carregar dados reais. O PDF usa o nome do banco/base ou Rotagyn como fallback.</div><div id="kpis" class="grid"></div><div class="cols"><div class="panel"><div class="pt">Top problemas</div><div id="problems"></div></div><div class="panel"><div class="pt">Leitura executiva</div><div id="exec" class="exec"></div></div></div><div class="panel"><div class="pt">Ranking técnico da frota</div><div id="table" class="tablewrap"></div></div>`;
 $('loadBtn').onclick=()=>load(apiRef);$('pdfBtn').onclick=downloadPdf;$('csvBtn').onclick=exportCSV;$('demoBtn').onclick=demo;$('scoreFilter').onchange=apply;$('reportName').oninput=()=>{dbName=$('reportName').value||'Rotagyn';localStorage.setItem('fleetReportName',dbName);render()};
}
async function load(api){
 if(!api){alertMsg('Abra esta tela dentro do MyGeotab para carregar dados reais. Use Dados simulados para validar o PDF.','err');return}
 apiRef=api;dbName=getDb(api,stateRef);$('reportName').value=dbName;localStorage.setItem('fleetReportName',dbName);status('Carregando...');alertMsg('Consultando Device, DeviceStatusInfo, StatusData e FaultData...');
 const from30=new Date(Date.now()-30*DAY),from7=new Date(Date.now()-7*DAY);
 try{const devs=await apiGet(api,'Device',{isArchived:false}),dm={};devs.forEach(d=>{if(!d.name||d.isActive===false)return;if(d.toDate&&new Date(d.toDate)<new Date())return;dm[d.id]={nome:d.name,placa:d.licensePlate||d.name,grupos:(d.groups||[]).map(g=>g.id)}});const dsi=await apiGet(api,'DeviceStatusInfo',{}),active={};dsi.forEach(s=>{const id=s.device&&s.device.id;if(!id||!dm[id]||!s.dateTime||new Date(s.dateTime)<from30||s.latitude==null||s.longitude==null)return;if(!active[id]||new Date(s.dateTime)>new Date(active[id].dateTime))active[id]=s});let st=[],faults=[];try{st=await apiGet(api,'StatusData',{fromDate:from7.toISOString(),toDate:new Date().toISOString()})}catch(e){}try{faults=await apiGet(api,'FaultData',{fromDate:from30.toISOString(),toDate:new Date().toISOString()})}catch(e){}const by={};st.concat(faults).forEach(r=>{const id=r.device&&r.device.id;if(id)(by[id]||(by[id]=[])).push(r)});vehicles=Object.keys(active).map(id=>{const s=active[id],i=dm[id],base={id,nome:i.nome,placa:i.placa,grupos:i.grupos,lastDate:s.dateTime,online:!!s.isDeviceCommunicating};return Object.assign(base,analyze(by[id]||[],base))}).sort((a,b)=>a.score-b.score);filtered=[...vehicles];status(vehicles.length+' veículos');alertMsg('Análise concluída. PDF premium pronto para baixar.','ok');render()}catch(e){console.error(e);status('Erro');alertMsg('Erro ao carregar dados: '+(e.message||e),'err')}
}
function apply(){const f=$('scoreFilter').value;filtered=vehicles.filter(v=>f==='critical'?v.score<60:f==='nodata'?v.dias>=7:f==='voltage'?(v.vlow+v.vhigh)>0:f==='removal'?v.unplugged>0:f==='v24'?v.is24v:true);render()}
function render(){if(!$('kpis'))return;dbName=$('reportName')&&$('reportName').value?$('reportName').value:'Rotagyn';const s=summary(filtered);$('dbBox').textContent=dbName;$('countBox').textContent=s.total.toLocaleString('pt-BR');$('kpis').innerHTML=[['Fleet Health Index',s.avg,'de 100','var(--blue)'],['Veículos analisados',s.total,'base filtrada','var(--txt)'],['Críticos',s.critical+s.risk,pct(s.critical+s.risk,s.total)+'% da frota','var(--red)'],['Possível remoção',s.unplugged,'com data do evento','var(--red)'],['Sem dados 7d+',s.nodata,'prioridade operacional','var(--orange)']].map(c=>`<div class="kpi"><span>${c[0]}</span><b style="color:${c[3]}">${c[1]}</b><small>${c[2]}</small></div>`).join('');const probs=topProblems(filtered),max=Math.max(1,...probs.map(p=>p.value));$('problems').innerHTML=probs.map(p=>`<div class="barrow"><b>${p.label}</b><div class="track"><div class="fill" style="width:${Math.round(p.value/max*100)}%;background:${p.color}"></div></div><span>${p.value}</span></div>`).join('');$('exec').innerHTML=`<div><b>Banco/Base:</b> ${esc(dbName)}</div><div><b>Leitura:</b> ${executive(s.avg)}</div><div><b>Prioridade:</b> atuar primeiro em score abaixo de 60, possíveis remoções, sem dados 7d+ e tensão fora.</div><div><b>Possíveis remoções:</b> ${s.unplugged} veículo(s) com data do evento no ranking e no CSV.</div>`;$('table').innerHTML='<table><thead><tr><th>#</th><th>Score</th><th>Placa</th><th>Veículo</th><th>Último dado</th><th>Problema principal</th><th>Datas possível remoção</th><th>Status</th></tr></thead><tbody>'+filtered.slice(0,80).map((v,i)=>`<tr><td>${i+1}</td><td><b style="color:${scVar(v.score)}">${v.score}</b></td><td><b style="font-family:var(--mono);color:var(--txt)">${esc(v.placa||'-')}</b></td><td class="vehicleCell" title="${esc(v.nome)}">${esc(v.nome)}</td><td>${v.dias>=7?'7d+':v.dias+'d'}</td><td>${esc(problem(v))}</td><td>${esc(v.removalDatesText||'-')}</td><td><span class="badge ${scClass(v.score)}">${scLabel(v.score)}</span></td></tr>`).join('')+'</tbody></table>'}
function demo(){dbName=$('reportName').value||'Rotagyn';vehicles=[['UDV2F12','UDV2F12 | CITROEN BASALT',25,0,0,0,0,0,0,1,'15/06/2026 08:31'],['SRG8B64','BYD SEAL | SRG8B64 | TESTE GO9 4G',25,0,0,0,0,0,0,1,'14/06/2026 17:12'],['SDJ0J48','SDJ0J48 | Fiat Cronos',25,11,0,0,0,0,0,1,'12/06/2026 09:02'],['Painel rotagyn','Painel rotagyn',25,7,0,0,0,0,0,1,'10/06/2026 15:44'],['Teste GO Focus','Teste GO Focus',45,11,0,0,0,0,0,0,'-'],['SDL1B41','SDL1B41 | VW Virtus | TESTE GO9 4G',45,28,0,0,0,0,0,0,'-'],['FOM4A84','FOM4A84 | Jeep Commander',75,0,0,0,1,0,0,0,'-'],['GAX3B67','AUDI - NSA',75,0,0,0,1,0,0,0,'-'],['DBB0001','DBB0001 TESTE',82,2,0,0,0,0,0,0,'-'],['TFR859','TFR859 | ROTAVERDE | TESTE GO9 4G',90,0,3,0,0,0,0,0,'-'],['TFP9I32','TFP9I32 | ROTAVERDE | TESTE GO9 4G',95,0,0,0,0,0,0,0,'-']].map((r,i)=>({id:'d'+i,placa:r[0],nome:r[1],score:r[2],dias:r[3],reboots:r[4],gps:r[5],vlow:r[6],vhigh:r[7],faults:r[8],unplugged:r[9],removalDatesText:r[10],lastRemovalDate:r[10]}));filtered=[...vehicles];status('Demo');alertMsg('Dados simulados carregados para prévia do PDF premium.','ok');render()}

function buildPdf(){
  const s=summary(filtered),
        probs=topProblems(filtered),
        max=Math.max(1,...probs.map(p=>p.value)),
        top=[...filtered].sort((a,b)=>a.score-b.score);

  // Cor dinâmica do Health Index baseada no score
  const scoreColor = scColor(s.avg);
  // Gradiente do anel baseado no score
  const ringGrad = s.avg>=80
    ? 'conic-gradient(#10b981 0% '+(s.avg*3.6)+'deg, rgba(255,255,255,0.12) '+(s.avg*3.6)+'deg 360deg)'
    : s.avg>=60
      ? 'conic-gradient(#f59e0b 0% '+(s.avg*3.6)+'deg, rgba(255,255,255,0.12) '+(s.avg*3.6)+'deg 360deg)'
      : s.avg>=40
        ? 'conic-gradient(#f97316 0% '+(s.avg*3.6)+'deg, rgba(255,255,255,0.12) '+(s.avg*3.6)+'deg 360deg)'
        : 'conic-gradient(#ef4444 0% '+(s.avg*3.6)+'deg, rgba(255,255,255,0.12) '+(s.avg*3.6)+'deg 360deg)';

  // ── PÁGINA 1: CAPA DARK (estilo imagem referência) ──
  const p1 = `
<div class="pdf-page pdf-cover-page">
  <div class="pcp-dots"></div>
  <div class="pcp-header">
    <img class="pcp-logo" src="${LOGO}">
  </div>
  <div class="pcp-hero">
    <div class="pcp-title-block">
      <div class="pcp-bar"></div>
      <div>
        <h1 class="pcp-title">Fleet<br>Health Score</h1>
        <p class="pcp-tagline">Relatório premium de saúde técnica da frota</p>
      </div>
    </div>
    <div class="pcp-truck-silhouette">
      <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;opacity:.18">
        <rect x="10" y="60" width="200" height="90" rx="8" stroke="#4db8ff" stroke-width="2"/>
        <rect x="210" y="90" width="80" height="60" rx="6" stroke="#4db8ff" stroke-width="2"/>
        <rect x="220" y="98" width="60" height="32" rx="3" stroke="#4db8ff" stroke-width="1.5"/>
        <circle cx="50" cy="155" r="18" stroke="#4db8ff" stroke-width="2"/>
        <circle cx="50" cy="155" r="8" stroke="#4db8ff" stroke-width="1.5"/>
        <circle cx="170" cy="155" r="18" stroke="#4db8ff" stroke-width="2"/>
        <circle cx="170" cy="155" r="8" stroke="#4db8ff" stroke-width="1.5"/>
        <circle cx="260" cy="155" r="16" stroke="#4db8ff" stroke-width="2"/>
        <circle cx="260" cy="155" r="7" stroke="#4db8ff" stroke-width="1.5"/>
        <rect x="130" y="60" width="2" height="90" stroke="#4db8ff" stroke-width="1.5"/>
        <line x1="10" y1="110" x2="210" y2="110" stroke="#4db8ff" stroke-width="1"/>
        <rect x="130" y="70" width="80" height="40" rx="4" stroke="#4db8ff" stroke-width="1.5"/>
      </svg>
    </div>
  </div>
  <div class="pcp-chips">
    <div class="pcp-chip"><span class="pcp-chip-icon">🗄</span><div><div class="pcp-chip-label">Banco/Base</div><div class="pcp-chip-val">${esc(dbName)}</div></div></div>
    <div class="pcp-chip"><span class="pcp-chip-icon">📅</span><div><div class="pcp-chip-label">Base ativa</div><div class="pcp-chip-val">30 dias</div></div></div>
    <div class="pcp-chip"><span class="pcp-chip-icon">⏱</span><div><div class="pcp-chip-label">Score</div><div class="pcp-chip-val">últimos 7 dias</div></div></div>
    <div class="pcp-chip"><span class="pcp-chip-icon">📋</span><div><div class="pcp-chip-label">Gerado em</div><div class="pcp-chip-val">${new Date().toLocaleString('pt-BR')}</div></div></div>
  </div>
  <div class="pcp-exec-card">
    <div class="pcp-exec-text">
      <div class="pcp-exec-header"><span class="pcp-shield">🛡</span> Resumo Executivo</div>
      <div class="pcp-exec-rule"></div>
      <p>Este relatório apresenta uma visão consolidada da saúde técnica da frota com base nas análises mais recentes dos veículos monitorados.</p>
      <p>As possíveis remoções são identificadas por eventos de desconexão/unplugged e exibem a data do evento no ranking e no CSV.</p>
      <div class="pcp-kpi-row">
        <div class="pcp-kpi-item"><span class="pcp-kpi-icon">🚛</span><b>${s.total}</b><small>Veículos<br>monitorados</small></div>
        <div class="pcp-kpi-item warn"><span class="pcp-kpi-icon">⚠</span><b>${s.critical+s.risk}</b><small>Veículos com<br>alertas</small></div>
        <div class="pcp-kpi-item red"><span class="pcp-kpi-icon">🔧</span><b>${s.nodata}</b><small>Sem dados<br>7d+</small></div>
        <div class="pcp-kpi-item green"><span class="pcp-kpi-icon">✓</span><b>${pct(s.healthy,s.total)}%</b><small>Disponib.<br>operacional</small></div>
      </div>
    </div>
    <div class="pcp-index-wrap">
      <div class="pcp-ring-outer" style="background:${ringGrad}">
        <div class="pcp-ring-inner">
          <b style="color:${scoreColor}">${s.avg}</b>
          <span>Health Index</span>
          <div class="pcp-pulse">〜</div>
        </div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • ${esc(dbName)}</span><span class="page-number"></span></div>
</div>`;

  // ── PÁGINA 2: RESUMO EXECUTIVO ──
  const p2 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Resumo executivo</h1><div class="pdf-subtitle">KPIs e leitura estratégica da frota</div></div>
    <img class="pdf-logo" src="${LOGO}">
  </div>
  <div class="pdf-grid-4">
    <div class="pdf-kpi"><small>Fleet Health Index</small><b style="color:${scoreColor}">${s.avg}</b><span>de 100</span></div>
    <div class="pdf-kpi"><small>Veículos analisados</small><b>${s.total}</b><span>base filtrada</span></div>
    <div class="pdf-kpi"><small>Críticos + risco</small><b style="color:#ef4444">${s.critical+s.risk}</b><span>${pct(s.critical+s.risk,s.total)}% da frota</span></div>
    <div class="pdf-kpi"><small>Possível remoção</small><b style="color:#f97316">${s.unplugged}</b><span>com data do evento</span></div>
  </div>
  <div class="pdf-section">
    <div class="pdf-two-col">
      <div class="pdf-card">
        <div class="pdf-section-title">Top problemas</div>
        <div class="pdf-bars">${probs.map(p=>`<div class="row"><div>${p.label}</div><div class="track"><div class="fill" style="width:${Math.round(p.value/max*100)}%;background:${p.color}"></div></div><div>${p.value}</div></div>`).join('')}</div>
      </div>
      <div class="pdf-card">
        <div class="pdf-section-title">Leitura executiva</div>
        <div class="pdf-summary-box"><b>Banco/Base:</b> ${esc(dbName)}</div>
        <div class="pdf-summary-box"><b>Condição atual:</b> ${executive(s.avg)}</div>
        <div class="pdf-summary-box"><b>Prioridade:</b> atuar primeiro em score abaixo de 60, sem dados 7d+, tensão fora e eventos de desconexão.</div>
        <div class="pdf-summary-box"><b>Faixa saudável:</b> 80–100 • <b>Atenção:</b> 60–79 • <b>Crítico:</b> 40–59 • <b>Risco alto:</b> &lt; 40</div>
      </div>
    </div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • Rotagyn</span><span class="page-number"></span></div>
</div>`;

  // ── PÁGINA 3: RANKING — RETRATO (sem landscape) ──
  const p3 = `
<div class="pdf-page pdf-ranking-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Ranking técnico da frota</h1><div class="pdf-subtitle">Veículos mais críticos e suas causas principais</div></div>
    <img class="pdf-logo" src="${LOGO}">
  </div>
  <table class="pdf-table">
    <thead><tr>
      <th class="c-num">#</th>
      <th class="c-score">Score</th>
      <th class="c-plate">Placa</th>
      <th>Veículo</th>
      <th class="c-last">Último</th>
      <th>Problema principal</th>
      <th>Datas remoção</th>
      <th class="c-status">Status</th>
    </tr></thead>
    <tbody>${top.map((v,i)=>`<tr class="${v.score < 40 ? 'pdf-row-risk' : ''}">
      <td>${i+1}</td>
      <td style="font-weight:900;color:${scColor(v.score)}">${v.score}</td>
      <td style="font-weight:800;font-family:monospace;font-size:10px">${esc(v.placa||'-')}</td>
      <td style="font-size:10px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.nome||'-')}</td>
      <td style="font-size:10px">${v.dias>=7?'7d+':v.dias+'d'}</td>
      <td style="font-size:10px">${esc(problem(v))}</td>
      <td style="font-size:9px;color:#64748b">${esc(v.removalDatesText||'-')}</td>
      <td class="c-status"><span class="pdf-badge ${pdfBadge(v.score)}">${scLabel(v.score)}</span></td>
    </tr>`).join('')}</tbody>
  </table>
  <div class="pdf-footer" style="left:42px;right:42px">
    <div class="pdf-legend">
      <span class="pdf-legend-item"><i class="risk"></i> Score crítico (&lt; 40)</span>
      <span>Fleet Health Score • Ranking Técnico</span>
    </div>
    <span class="page-number"></span>
  </div>
</div>`;

  // ── PÁGINA 4: PLANO DE AÇÃO ──
  const p4 = `
<div class="pdf-page">
  <div class="pdf-topbar"></div>
  <div class="pdf-brand">
    <div><h1 class="pdf-title">Plano de ação recomendado</h1><div class="pdf-subtitle">Prioridades de atuação operacional</div></div>
    <img class="pdf-logo" src="${LOGO}">
  </div>
  <div class="pdf-action"><h4>Prioridade 1 — possíveis remoções/desconexões</h4><p>Validar imediatamente energia, chicote, violação física, alimentação e histórico do dispositivo na data indicada.</p></div>
  <div class="pdf-action"><h4>Prioridade 2 — veículos sem dados há mais de 7 dias</h4><p>Validar dados móveis, GPS, comunicação e integridade do equipamento.</p></div>
  <div class="pdf-action"><h4>Prioridade 3 — tensão baixa ou alta recorrente</h4><p>Revisar bateria, alternador, aterramento e qualidade da instalação elétrica.</p></div>
  <div class="pdf-action"><h4>Prioridade 4 — reboots e falhas GPS reincidentes</h4><p>Abrir análise técnica focando em firmware, posição e estabilidade da alimentação.</p></div>
  <div class="pdf-section">
    <div class="pdf-section-title">Encaminhamento sugerido</div>
    <div class="pdf-summary-box">Exportar o CSV dos críticos e encaminhar para suporte/campo com SLA de tratativa.</div>
    <div class="pdf-summary-box">Separar revisão por grupo/cliente quando houver volume alto de veículos críticos.</div>
    <div class="pdf-summary-box">Na próxima evolução, incluir comparativo semanal/mensal e histórico do índice por banco/base.</div>
  </div>
  <div class="pdf-footer"><span>Fleet Health Score • Plano de Ação</span><span class="page-number"></span></div>
</div>`;

  $('pdfStage').innerHTML = p1 + p2 + p3 + p4;
}
async function downloadPdf(){
  if(!filtered.length){alertMsg('Carregue a análise antes de baixar o PDF.','err');return}
  dbName=$('reportName').value||dbName||'Rotagyn';
  status('Preparando impressão...');
  alertMsg('O relatório será aberto na tela de impressão. Escolha "Salvar como PDF".','ok');
  
  buildPdf(); // Monta o HTML dentro do #pdfStage

  // Define o total de páginas para o CSS usar
  const totalPages = $('pdfStage').querySelectorAll('.pdf-page').length;
  $('pdfStage').style.setProperty('--total-pages', `"${totalPages}"`);

  // Mesmo com o logo em Base64, mantemos a verificação para outras possíveis imagens dinâmicas
  const imgs = Array.from($('pdfStage').querySelectorAll('img'));
  
  await Promise.all(imgs.map(i => i.complete ? Promise.resolve() : new Promise(res => { i.onload = res; i.onerror = res; })));

  // Como o logo é Base64, o processamento é quase instantâneo.
  await new Promise(r => setTimeout(r, 150));

  window.print();
  status(filtered.length+' veículos');
}
function exportCSV(){if(!filtered.length)return;const rows=[['nome','placa','score','status','problema_principal','possivel_remocao_nao_autorizada','datas_possivel_remocao','dias_sem_dados','reboots','falhas_gps','tensao_fora']].concat(filtered.map(v=>[v.nome,v.placa,v.score,scLabel(v.score),problem(v),v.unplugged>0?'sim':'nao',v.removalDatesText||'-',v.dias,v.reboots,v.gps,v.vlow+v.vhigh]));const csv=rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='fleet-health-report-'+clean(dbName)+'.csv';a.click();URL.revokeObjectURL(a.href)}
function init(api,state){apiRef=api;stateRef=state||{};dbName=getDb(api,stateRef);shell();if(api)load(api);else demo()}
if(!window.geotab)window.geotab={addin:{}};if(!window.geotab.addin)window.geotab.addin={};window.geotab.addin.fleetHealthScore=function(){return{initialize:function(api,state,cb){try{init(api,state)}catch(e){console.error(e)}if(cb)cb()},focus:function(){},blur:function(){}}};if(!window.location.href.includes('my.geotab'))setTimeout(()=>init(null,{}),50);
})();
