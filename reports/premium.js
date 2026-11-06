(function(){
'use strict';

// Logotipo embutido em Base64 para evitar latência de rede e problemas de CORS
const LOGO='data:image/png;base64,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';
const DAY=86400000;
let apiRef=null,stateRef={},vehicles=[],filtered=[],dbName='Rotagyn',groupDesc={};
const FILTER_KEY='fleetHealthReportFilters';
function saveFilters(){try{localStorage.setItem(FILTER_KEY,JSON.stringify({g:$('groupFilter')?$('groupFilter').value:'',s:$('scoreFilter')?$('scoreFilter').value:''}))}catch(e){}}
function restoreFilters(){let f={};try{f=JSON.parse(localStorage.getItem(FILTER_KEY)||'{}')}catch(e){};if($('groupFilter')){const opt=[...$('groupFilter').options].find(o=>o.value===f.g);$('groupFilter').value=opt?f.g:''}if($('scoreFilter'))$('scoreFilter').value=f.s||''}
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
function problem(v){let m=v.unplugged>0?'Possível remoção não autorizada':v.offline?(v.dias>=30?'Offline 30d+ (sem dados na base)':'Sem comunicação '+v.dias+' dias'):v.vlow>0?'Tensão baixa':v.vhigh>0?'Tensão alta':v.reboots>2?'Reboot excessivo':v.gps>0?'Falha GPS':v.faults>0?'Falha device':'Sem alerta crítico';
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
 if(a.unplugged>0)p=Math.min(p,25); if(ds>=30)p=Math.min(p,15); else if(ds>=7)p=Math.min(p,45);
 a.score=Math.max(0,Math.round(p));a.dias=ds;a.offline=ds>=7;a.offline30=ds>=30;if(ds>=30)a.score=Math.min(a.score,15);else if(ds>=7)a.score=Math.min(a.score,45);a.removalDates=uniqDates(a.removalDates);a.removalDatesText=a.removalDates.length?a.removalDates.slice(0,3).map(fmtDate).join(' | '):'-';a.lastRemovalDate=a.removalDates.length?fmtDate(a.removalDates[0]):'-';return a;
}
function summary(list){const total=list.length||1,avg=Math.round(list.reduce((s,v)=>s+v.score,0)/total);return{total:list.length,avg,healthy:list.filter(v=>v.score>=80).length,attention:list.filter(v=>v.score>=60&&v.score<80).length,critical:list.filter(v=>v.score<60&&v.score>=40).length,risk:list.filter(v=>v.score<40).length,nodata:list.filter(v=>v.dias>=7).length,offline:list.filter(v=>v.offline).length,offline30:list.filter(v=>v.offline30).length,unplugged:list.filter(v=>v.unplugged>0).length,voltage:list.filter(v=>v.vlow+v.vhigh>0).length,gps:list.filter(v=>v.gps>0).length,reboot:list.filter(v=>v.reboots>2).length}}
function topProblems(list){const s=summary(list);return[{label:'Offline (sem comunicação)',value:s.offline,color:'#dc2626'},{label:'Offline 30d+ (total)',value:s.offline30,color:'#7f1d1d'},{label:'Sem dados 7d+',value:s.nodata,color:'#ef4444'},{label:'Tensão fora',value:s.voltage,color:'#f97316'},{label:'Falha GPS',value:s.gps,color:'#f59e0b'},{label:'Reboot excessivo',value:s.reboot,color:'#0ea5e9'},{label:'Desconexão',value:s.unplugged,color:'#dc2626'}]}
function groupMatch(v,g){if(!g)return true;const ids=groupDesc[g]||[g];return (v.grupos||[]).some(id=>ids.includes(id))}
function getDb(api,state){return(state&&(state.database||state.databaseName))||(api&&api.credentials&&api.credentials.database)||localStorage.getItem('fleetReportName')||'Rotagyn'}
function status(t){const e=$('statusBox');if(e)e.textContent=t}
function alertMsg(t,cls){const e=$('alertBox');if(!e)return;e.className='alert '+(cls||'');e.innerHTML=t||''}
function shell(){
 $('app').innerHTML=`<div class="head"><div class="brand"><img class="logo" src="${LOGO}"><div><div class="title">Fleet Health Reports</div><div class="sub">RELATÓRIO PDF PREMIUM • GEOTAB ADD-IN</div></div></div><div class="pill" id="statusBox">Conectando...</div></div><div class="bar"><button class="primary" id="loadBtn">Gerar análise</button><button class="soft" id="pdfBtn">Baixar PDF premium</button><button id="csvBtn">Exportar CSV</button><button id="demoBtn">Dados simulados</button><input id="reportName" placeholder="Nome do banco/base" value="${esc(dbName)}"><select id="scoreFilter"><option value="">Todos os veículos</option><option value="critical">Críticos + risco alto</option><option value="offline">Sem comunicação (offline)</option><option value="offline30">Offline 30d+ (total)</option><option value="nodata">Sem dados 7d+</option><option value="voltage">Tensão fora</option><option value="removal">Possível remoção</option><option value="v24">Veículos 24V (Caminhões)</option></select><select id="groupFilter"><option value="">Todos os grupos</option></select></div><div class="info"><span>Base ativa: <b>7 dias</b></span><span>Offline 30d: <b>FaultData extra</b></span><span>Score: <b>7 dias</b></span><span>Banco/Base: <b id="dbBox">${esc(dbName)}</b></span><span>Veículos no relatório: <b id="countBox">0</b></span></div><div id="alertBox" class="alert">Use dentro do MyGeotab para carregar dados reais. O PDF usa o nome do banco/base ou Rotagyn como fallback.</div><div id="kpis" class="grid"></div><div class="cols"><div class="panel"><div class="pt">Top problemas</div><div id="problems"></div></div><div class="panel"><div class="pt">Leitura executiva</div><div id="exec" class="exec"></div></div></div><div class="panel"><div class="pt">Ranking técnico da frota</div><div id="table" class="tablewrap"></div></div>`;
 const sf=$('scoreFilter'),gf=$('groupFilter');if(sf){sf.addEventListener('change',apply);sf.onchange=apply}if(gf){gf.addEventListener('change',apply);gf.onchange=apply}
$('loadBtn').onclick=()=>load(apiRef);$('pdfBtn').onclick=downloadPdf;$('csvBtn').onclick=exportCSV;$('demoBtn').onclick=demo;$('reportName').oninput=()=>{dbName=$('reportName').value||'Rotagyn';localStorage.setItem('fleetReportName',dbName);render()};
}
async function load(api){
 if(!api){alertMsg('Abra esta tela dentro do MyGeotab para carregar dados reais. Use Dados simulados para validar o PDF.','err');return}
 apiRef=api;dbName=getDb(api,stateRef);$('reportName').value=dbName;localStorage.setItem('fleetReportName',dbName);status('Carregando...');alertMsg('Consultando Device, DeviceStatusInfo, StatusData e FaultData...');
 const now=new Date(),from7=new Date(now.getTime()-7*DAY),from30=new Date(now.getTime()-30*DAY);
 try{const groups=await apiGet(api,'Group',{}).catch(()=>[]);const groupById={};groups.forEach(g=>{if(g&&g.id)groupById[g.id]=g});const collectDesc=id=>{const out=[],stack=[id],seen={};while(stack.length){const cur=stack.pop();if(seen[cur])continue;seen[cur]=true;out.push(cur);const node=groupById[cur];const kids=(node&&node.children)||[];kids.forEach(c=>{const cid=typeof c==='string'?c:c&&c.id;if(cid)stack.push(cid)})}return out};groupDesc={};Object.keys(groupById).forEach(id=>groupDesc[id]=collectDesc(id));if($('groupFilter')){$('groupFilter').innerHTML='<option value="">Todos os grupos</option>'+groups.filter(grp=>grp.name&&grp.name!=='GroupCompanyId'&&grp.name!=='GroupNothingId').sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(grp=>`<option value="${grp.id}">${esc(grp.name)}</option>`).join('')}restoreFilters();const devs=await apiGet(api,'Device',{fromDate:now.toISOString()}).catch(()=>apiGet(api,'Device',{})),dm={};devs.forEach(d=>{if(!d.name)return;const activeTo=d.activeTo?new Date(d.activeTo):null,activeFrom=d.activeFrom?new Date(d.activeFrom):null;if(activeTo&&activeTo<now)return;if(activeFrom&&activeFrom>now)return;if(d.isArchived===true)return;dm[d.id]={nome:d.name,placa:d.licensePlate||d.name,grupos:(d.groups||[]).map(g=>g.id)}});const dsi=await apiGet(api,'DeviceStatusInfo',{}),latest={};dsi.forEach(s=>{const id=s.device&&s.device.id;if(!id||!dm[id]||!s.dateTime)return;const t=new Date(s.dateTime);if(isNaN(t)||t<from30)return;if(!latest[id]||t>new Date(latest[id].dateTime))latest[id]=s});const active={};Object.keys(latest).forEach(id=>{if(new Date(latest[id].dateTime)>=from7)active[id]=latest[id]});let st=[],faults=[];try{st=await apiGet(api,'StatusData',{fromDate:from7.toISOString(),toDate:now.toISOString()})}catch(e){}try{faults=await apiGet(api,'FaultData',{fromDate:from7.toISOString(),toDate:now.toISOString()})}catch(e){}const staleIds=Object.keys(dm).filter(id=>!active[id]);let faultsPrev=[];if(staleIds.length){try{faultsPrev=await apiGet(api,'FaultData',{fromDate:from30.toISOString(),toDate:from7.toISOString(),deviceSearch:{deviceIds:staleIds}})}catch(e){}}const by={};st.concat(faults).concat(faultsPrev).forEach(r=>{const id=r.device&&r.device.id;if(id)(by[id]||(by[id]=[])).push(r)});const STALE=Object.keys(dm).filter(id=>!active[id]);vehicles=Object.keys(active).concat(STALE).map(id=>{const s=latest[id]||null,i=dm[id],base={id,nome:i.nome,placa:i.placa,grupos:i.grupos,lastDate:s?s.dateTime:null,online:s?!!s.isDeviceCommunicating:false};return Object.assign(base,analyze(by[id]||[],base))}).sort((a,b)=>a.score-b.score);filtered=[...vehicles];restoreFilters();status(vehicles.length+' veículos ('+STALE.length+' offline)');alertMsg('Análise concluída. Offline: '+vehicles.filter(v=>v.offline).length+' | Offline 30d+: '+vehicles.filter(v=>v.offline30).length+'. PDF premium pronto.','ok');apply()}catch(e){console.error(e);status('Erro');alertMsg('Erro ao carregar dados: '+(e.message||e),'err')}
}
function apply(){saveFilters();const f=$('scoreFilter').value,g=$('groupFilter')?$('groupFilter').value:'';filtered=vehicles.filter(v=>groupMatch(v,g)).filter(v=>f==='critical'?v.score<60:f==='offline'?!!v.offline:f==='offline30'?!!v.offline30:f==='nodata'?v.dias>=7:f==='voltage'?(v.vlow+v.vhigh)>0:f==='removal'?v.unplugged>0:f==='v24'?v.is24v:true);render()}
function render(){const miss=['app','kpis','problems','exec','table'].filter(id=>!$(id));if(miss.length){alertMsg('Elementos do relatório ausentes: '+miss.join(', ')+'. Atualize a página (Ctrl+F5) ou reinstale o add-in.','err');return}dbName=$('reportName')&&$('reportName').value?$('reportName').value:'Rotagyn';const s=summary(filtered);$('dbBox').textContent=dbName;$('countBox').textContent=s.total.toLocaleString('pt-BR');$('kpis').innerHTML=[['Fleet Health Index',s.avg,'de 100','var(--blue)'],['Veículos analisados',s.total,'base filtrada','var(--txt)'],['Críticos',s.critical+s.risk,pct(s.critical+s.risk,s.total)+'% da frota','var(--red)'],['Possível remoção',s.unplugged,'com data do evento','var(--red)'],['Offline (sem comunicação)',s.offline,'prioridade operacional','var(--red)'],['Offline 30d+ (total)',s.offline30,'sem dados na base','var(--red)'],['Sem dados 7d+',s.nodata,'prioridade operacional','var(--orange)']].map(c=>`<div class="kpi"><span>${c[0]}</span><b style="color:${c[3]}">${c[1]}</b><small>${c[2]}</small></div>`).join('');const probs=topProblems(filtered),max=Math.max(1,...probs.map(p=>p.value));$('problems').innerHTML=probs.map(p=>`<div class="barrow"><b>${p.label}</b><div class="track"><div class="fill" style="width:${Math.round(p.value/max*100)}%;background:${p.color}"></div></div><span>${p.value}</span></div>`).join('');$('exec').innerHTML=`<div><b>Banco/Base:</b> ${esc(dbName)}</div><div><b>Leitura:</b> ${executive(s.avg)}</div><div><b>Prioridade:</b> atuar primeiro em score abaixo de 60, possíveis remoções, sem dados 7d+ e tensão fora.</div><div><b>Possíveis remoções:</b> ${s.unplugged} veículo(s) com data do evento no ranking e no CSV.</div>`;$('table').innerHTML='<table><thead><tr><th>#</th><th>Score</th><th>Placa</th><th>Veículo</th><th>Último dado</th><th>Problema principal</th><th>Datas possível remoção</th><th>Status</th></tr></thead><tbody>'+filtered.slice(0,80).map((v,i)=>`<tr><td>${i+1}</td><td><b style="color:${scVar(v.score)}">${v.score}</b></td><td><b style="font-family:var(--mono);color:var(--txt)">${esc(v.placa||'-')}</b></td><td class="vehicleCell" title="${esc(v.nome)}">${esc(v.nome)}</td><td>${v.dias>=7?'7d+':v.dias+'d'}</td><td>${esc(problem(v))}</td><td>${esc(v.removalDatesText||'-')}</td><td><span class="badge ${scClass(v.score)}">${scLabel(v.score)}</span></td></tr>`).join('')+'</tbody></table>'}
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
    <div class="pcp-chip"><span class="pcp-chip-icon">📅</span><div><div class="pcp-chip-label">Base ativa</div><div class="pcp-chip-val">7 dias (+30d offline)</div></div></div>
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
  <div class="pdf-action"><h4>Prioridade 2 — offline / sem comunicação (7d+ e 30d+)</h4><p>Veículos 7d+ estão sem comunicação; 30d+ estão fora da base ativa. Validar chip/dados móveis, GPS, alimentação, remoção e integridade do equipamento.</p></div>
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
  if(!$('pdfStage')){alertMsg('Elemento de impressão ausente. Atualize a página (Ctrl+F5).','err');return}
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
function exportCSV(){if(!filtered.length)return;const rows=[['nome','placa','score','status','problema_principal','sem_comunicacao_offline','offline_30d_total','possivel_remocao_nao_autorizada','datas_possivel_remocao','dias_sem_dados','reboots','falhas_gps','tensao_fora']].concat(filtered.map(v=>[v.nome,v.placa,v.score,scLabel(v.score),problem(v),v.offline?'sim':'nao',v.offline30?'sim':'nao',v.unplugged>0?'sim':'nao',v.removalDatesText||'-',v.dias,v.reboots,v.gps,v.vlow+v.vhigh]));const csv=rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='fleet-health-report-'+clean(dbName)+'.csv';a.click();URL.revokeObjectURL(a.href)}
function init(api,state){apiRef=api;stateRef=state||{};dbName=getDb(api,stateRef);shell();if(api)load(api);else demo()}
if(!window.geotab)window.geotab={addin:{}};if(!window.geotab.addin)window.geotab.addin={};window.geotab.addin.fleetHealthScore=function(){return{initialize:function(api,state,cb){try{init(api,state)}catch(e){console.error(e)}if(cb)cb()},focus:function(){},blur:function(){}}};if(!window.location.href.includes('my.geotab'))setTimeout(()=>init(null,{}),50);
})();
