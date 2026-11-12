/* Detalhamento auditável do Fleet Exception 360.
 * Tudo provém da sessão MyGeotab: não há placas, nomes ou eventos fixos aqui.
 */
(function(root){
  'use strict';
  const known = new Map(Object.entries({
    'harsh braking':'Frenagem brusca',
    'harsh acceleration':'Aceleração brusca',
    'harsh cornering':'Curva brusca',
    'speeding':'Excesso de velocidade',
    'speeding violation':'Excesso de velocidade',
    'speed limit violation':'Excesso de velocidade',
    'speeding over posted speed limit':'Excesso do limite de velocidade da via',
    'seatbelt violation':'Uso irregular do cinto de segurança',
    'seat belt violation':'Uso irregular do cinto de segurança',
    'driving without seatbelt':'Condução sem cinto de segurança',
    'idling':'Marcha lenta',
    'excessive idling':'Marcha lenta excessiva',
    'engine idling':'Motor em marcha lenta',
    'engine fault':'Falha do motor',
    'engine faults':'Falhas do motor',
    'vehicle fault':'Falha do veículo',
    'after hours usage':'Uso fora do horário',
    'after-hours usage':'Uso fora do horário',
    'unauthorized use':'Uso não autorizado'
  }));
  function originalRule(e){
    return String(e&&(e.regraNome||e.regra||e.ruleName||e.regraId)||'Regra não informada').trim();
  }
  function ruleTranslation(name){
    const text=String(name||'').trim();
    // Nomes personalizados não devem ser inferidos nem traduzidos automaticamente.
    return known.get(text.toLowerCase().replace(/\s+/g,' '))||text;
  }
  function stateLabel(value){
    const id=typeof value==='object'&&value!==null?String(value.id||value.name||''):String(value||'');
    const states={
      'ExceptionEventStateValidId':'Válido',
      'ExceptionEventStateInvalidId':'Inválido',
      'ExceptionEventStateAcknowledgedId':'Reconhecido',
      'ExceptionEventStateDismissedId':'Descartado'
    };
    return states[id]||id||'Não informado';
  }
  function isoTime(value){
    if(!value)return '';
    const date=new Date(value);
    return Number.isFinite(date.getTime())?date.toISOString():'';
  }
  function displayTime(value){
    const iso=isoTime(value);
    return iso?new Date(iso).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Não informado';
  }
  function durationText(e){
    let ms=Number(e&&e.durationMs);
    if(!Number.isFinite(ms)||ms<=0){
      const raw=String(e&&e.duration||'');
      const m=raw.match(/^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?$/);
      ms=m?(Number(m[1]||0)*86400+Number(m[2])*3600+Number(m[3])*60+Number(m[4]))*1000:0;
    }
    if(ms<=0&&e&&e.activeFrom&&e.activeTo){
      const start=new Date(e.activeFrom).getTime(),end=new Date(e.activeTo).getTime();
      if(Number.isFinite(start)&&Number.isFinite(end)&&end>=start)ms=end-start;
    }
    if(ms<=0)return 'Não informada';
    const total=Math.floor(ms/1000),h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;
    return [h?h+'h':'',m?m+'min':'',s?s+'s':''].filter(Boolean).join(' ')||'0s';
  }
  function count(e){
    if(e&&e.exceptionCount!==null&&e.exceptionCount!==undefined&&e.exceptionCount!==''){
      const n=Number(e.exceptionCount);
      if(Number.isFinite(n)&&n>0)return {value:n,exact:true};
    }
    return {value:1,exact:false};
  }
  function rows(events){
    return (events||[]).map(e=>{
      const original=originalRule(e),translated=ruleTranslation(original),instances=count(e);
      const maxSpeed=(()=>{const raw=e&&e.excMaxSpeed,n=raw===null||raw===undefined||raw===''?NaN:Number(raw);return Number.isFinite(n)&&n>=0?n:null})();
      return {
        id:String(e.id||''),vehicleId:String(e.veiculoId||e.deviceId||''),
        vehicle:String(e.veiculo||''),plate:String(e.placa||''),
        ruleId:String(e.regraId||''),rule:translated,originalRule:original,
        eventName:'Ocorrência: '+translated,
        start:displayTime(e.activeFrom),end:displayTime(e.activeTo),
        startIso:isoTime(e.activeFrom),endIso:isoTime(e.activeTo),
        duration:durationText(e),status:stateLabel(e.state),instances:instances.value,
        exactCount:instances.exact,driver:String(e.driver||''),
        maxSpeed,speed:maxSpeed==null?'—':Math.round(maxSpeed)+' km/h'
      };
    }).sort((a,b)=>(b.startIso||'').localeCompare(a.startIso||''));
  }
  function ruleSummary(list){
    const acc=new Map();
    rows(list).forEach(e=>{
      const key=e.ruleId||e.originalRule;
      if(!acc.has(key))acc.set(key,{name:e.rule,original:e.originalRule,id:e.ruleId,events:0,instances:0,estimated:false});
      const item=acc.get(key);item.events++;item.instances+=e.instances;
      if(!e.exactCount)item.estimated=true;
    });
    return [...acc.values()].sort((a,b)=>b.instances-a.instances||b.events-a.events);
  }
  function escapeCsv(value){return '"'+String(value??'').replace(/"/g,'""')+'"'}
  function exportCsv(list){
    const headings=['ID evento','ID regra','Veículo','Placa','Evento (pt-BR)','Regra (pt-BR)','Regra original','Início (horário local)','Fim (horário local)','Início ISO UTC','Fim ISO UTC','Duração','Velocidade máxima (km/h)','Estado','Instâncias (mínimo quando sem contagem)','Contagem exata','Condutor'];
    const data=rows(list).map(e=>[e.id,e.ruleId,e.vehicle,e.plate,e.eventName,e.rule,e.originalRule,e.start,e.end,e.startIso,e.endIso,e.duration,e.maxSpeed==null?'':e.maxSpeed,e.status,e.instances,e.exactCount?'Sim':'Não',e.driver]);
    return '\uFEFF'+[headings,...data].map(r=>r.map(escapeCsv).join(';')).join('\n');
  }
  root.Exception360Audit={rows,ruleSummary,ruleTranslation,stateLabel,exportCsv,count,displayTime};
})(window);
