/* Fleet Health Score - identidade configurada no banco MyGeotab, não no código-fonte. */
(function(){
  'use strict';
  const ADD_IN_ID = 'PF3lsbBEQeurnbFs_2HzeA';
  const KEY = 'fleet-health-branding-v1';
  const IMAGE_PART_KEY = 'fleet-health-pdf-png-part-v1';
  const PART_SIZE = 7000;
  const MAX_PARTS = 16;
  const ALLOWED_FONTS = ['Montserrat','Inter','Roboto','Arial','system-ui'];
  const defaults = ()=>({name:'',logo:'',icon:'',website:'',font:'system-ui'});
  let apiRef=null,recordId=null,settings=defaults(),modal=null,ready=false,logoRef=null,loadWarning='';
  const $=id=>document.getElementById(id);
  const escapeHtml=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const rpc=(method,params)=>new Promise((resolve,reject)=>{
    if(!apiRef||typeof apiRef.call!=='function')return reject(new Error('Conecte o Add-In ao MyGeotab.'));
    apiRef.call(method,params,resolve,reject);
  });
  function imageSource(value){
    const s=String(value||'').trim();
    if(/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(s))return s;
    try{const url=new URL(s);if(url.protocol==='https:')return url.href}catch(e){}
    return '';
  }
  function websiteUrl(value){
    try{const url=new URL(String(value||'').trim());return url.protocol==='https:'?url.href:''}catch(e){return ''}
  }
  function sanitize(input){
    const s=input||{};
    return {name:String(s.name||'').trim().slice(0,100),logo:imageSource(s.logo),
      icon:imageSource(s.icon),website:websiteUrl(s.website),
      font:ALLOWED_FONTS.includes(s.font)?s.font:'system-ui'};
  }
  function applyBrand(){
    const font=settings.font==='system-ui'?'system-ui,Arial,sans-serif':('"'+settings.font+'",Arial,sans-serif');
    document.documentElement.style.setProperty('--fleet-brand-font',font);
    document.querySelectorAll('[data-fleet-brand-name]').forEach(el=>{
      el.textContent=settings.name||'Fleet Health Score';
    });
    document.querySelectorAll('[data-fleet-brand-icon]').forEach(el=>{
      el.replaceChildren();
      const src=imageSource(settings.icon);
      if(src){const img=document.createElement('img');img.src=src;img.alt='Ícone configurado';img.style.cssText='max-width:100%;max-height:100%;object-fit:contain';el.appendChild(img)}
      else{el.textContent='FHS';el.style.fontWeight='800'}
    });
    document.dispatchEvent(new CustomEvent('fleet-brand-updated',{detail:{hasLogo:!!settings.logo,hasIcon:!!settings.icon}}));
  }
  function makeBatchId(){
    return 'pdf-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
  }
  function validLogoRef(ref){
    return ref && typeof ref.batch==='string' && /^pdf-[a-z0-9-]+$/.test(ref.batch)
      && Number.isInteger(ref.count) && ref.count>0 && ref.count<=MAX_PARTS;
  }
  async function removeParts(rows){
    for(const row of rows){if(!row||!row.id)continue;
      try{await rpc('Remove',{typeName:'AddInData',entity:{id:row.id}})}
      catch(e){console.warn('Não foi possível limpar um fragmento antigo da imagem.',e)}
    }
  }
  async function read(){
    if(!apiRef)return;
    const rows=await rpc('Get',{typeName:'AddInData',search:{addInId:ADD_IN_ID}});
    const configs=(rows||[]).filter(row=>row.details&&row.details.kind===KEY);
    const current=configs.sort((a,b)=>String(b.details.updatedAt||'').localeCompare(String(a.details.updatedAt||'')))[0];
    recordId=current&&current.id||null;
    settings=current?sanitize(current.details.brand):defaults();
    logoRef=null;loadWarning='';
    const ref=current&&current.details&&current.details.brand&&current.details.brand.logoRef;
    if(validLogoRef(ref)){
      const parts=(rows||[]).filter(row=>row.details&&row.details.kind===IMAGE_PART_KEY&&row.details.batch===ref.batch);
      const ordered=parts.sort((a,b)=>Number(a.details.part)-Number(b.details.part));
      const correct=ordered.length===ref.count&&ordered.every((row,i)=>Number(row.details.part)===i&&typeof row.details.content==='string');
      const data=correct?ordered.map(row=>row.details.content).join(''):'';
      if(correct&&/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(data)){settings.logo=data;logoRef={batch:ref.batch,count:ref.count}}
      else{settings.logo='';loadWarning='A imagem do PDF está incompleta; envie o PNG novamente.'}
    }
    ready=true;applyBrand();
  }
  async function save(next){
    const clean=sanitize(next),oldRef=logoRef;
    let nextRef=(oldRef&&clean.logo===settings.logo)?oldRef:null;
    let newParts=[];
    if(!nextRef&&/^data:image\/png;base64,/i.test(clean.logo)&&clean.logo.length>PART_SIZE){
      const count=Math.ceil(clean.logo.length/PART_SIZE);
      if(count>MAX_PARTS)throw new Error('O PNG é muito grande mesmo após o ajuste. Tente um logotipo mais simples.');
      const batch=makeBatchId();
      try{
        for(let part=0;part<count;part++){
          const details={kind:IMAGE_PART_KEY,batch,part,content:clean.logo.slice(part*PART_SIZE,(part+1)*PART_SIZE)};
          const added=await rpc('Add',{typeName:'AddInData',entity:{addInId:ADD_IN_ID,groups:[{id:'GroupCompanyId'}],details}});
          if(!added||!added.id)throw new Error('A Geotab não confirmou o armazenamento da imagem.');
          newParts.push({id:added.id,details});
        }
      }catch(e){await removeParts(newParts);throw e}
      nextRef={batch,count};
    }
    const brand={...clean,logo:nextRef?'':clean.logo,logoRef:nextRef};
    const details={kind:KEY,brand,updatedAt:new Date().toISOString()};
    if(JSON.stringify(details).length>9900){
      await removeParts(newParts);
      throw new Error('Configuração muito grande. Reduza o tamanho do ícone ou use URL HTTPS.');
    }
    try{
      const entity={addInId:ADD_IN_ID,groups:[{id:'GroupCompanyId'}],details};
      if(recordId){entity.id=recordId;await rpc('Set',{typeName:'AddInData',entity})}
      else{const added=await rpc('Add',{typeName:'AddInData',entity});recordId=added&&added.id||null}
    }catch(e){await removeParts(newParts);throw e}
    settings=clean;logoRef=nextRef;ready=true;applyBrand();
    if(oldRef&&(!nextRef||nextRef.batch!==oldRef.batch)){
      try{
        const rows=await rpc('Get',{typeName:'AddInData',search:{addInId:ADD_IN_ID}});
        await removeParts((rows||[]).filter(row=>row.details&&row.details.kind===IMAGE_PART_KEY&&row.details.batch===oldRef.batch));
      }catch(e){console.warn('Limpeza da imagem anterior pendente.',e)}
    }
    return clean;
  }
  function encodePdfPng(file){
    return new Promise((resolve,reject)=>{
      if(!file||file.type!=='image/png')return reject(new Error('A imagem do PDF deve ser PNG.'));
      if(file.size>5*1024*1024)return reject(new Error('O arquivo PNG deve ter no máximo 5 MB.'));
      const img=new Image(),url=URL.createObjectURL(file);
      img.onload=()=>{
        try{
          let scale=Math.min(1,600/img.naturalWidth,240/img.naturalHeight),data='';
          for(let attempt=0;attempt<9;attempt++){
            const w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
            const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
            const ctx=canvas.getContext('2d');
            if(!ctx)throw new Error('Não foi possível preparar a imagem.');
            ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
            data=canvas.toDataURL('image/png');
            if(data.length<=PART_SIZE*MAX_PARTS)break;
            scale*=.78;
          }
          URL.revokeObjectURL(url);
          if(data.length>PART_SIZE*MAX_PARTS)throw new Error('O PNG continua muito grande. Use uma imagem mais simples.');
          resolve(data);
        }catch(e){URL.revokeObjectURL(url);reject(e)}
      };
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível abrir o PNG.'))};
      img.src=url;
    });
  }
  function encodeImage(file,maxW,maxH){
    return new Promise((resolve,reject)=>{
      if(!file||!/^image\/(?:png|jpeg|webp)$/.test(file.type))return reject(new Error('Envie PNG, JPG ou WebP.'));
      if(file.size>5*1024*1024)return reject(new Error('Imagem muito grande (máximo 5 MB).'));
      const img=new Image(),url=URL.createObjectURL(file);
      img.onload=()=>{
        try{
          const scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight),w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
          const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d');ctx.clearRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
          let data=canvas.toDataURL('image/webp',0.67);
          if(data.length>6500)data=canvas.toDataURL('image/jpeg',0.45);
          URL.revokeObjectURL(url);
          if(data.length>7500)return reject(new Error('Imagem continua grande. Use um link HTTPS para a imagem.'));
          resolve(data);
        }catch(e){URL.revokeObjectURL(url);reject(e)}
      };
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Arquivo de imagem inválido.'))};
      img.src=url;
    });
  }
  function logoHtml(className){
    const src=imageSource(settings.logo);
    return src?'<img class="'+escapeHtml(className||'pdf-logo')+'" src="'+escapeHtml(src)+'" alt="Logotipo da organização"/>':'';
  }
  function iconHtml(className){
    const src=imageSource(settings.icon);
    return src?'<img class="'+escapeHtml(className||'brand-icon')+'" src="'+escapeHtml(src)+'" alt="Ícone da organização"/>':'';
  }
  function injectButton(){
    if(!apiRef||$('fleetBrandOpen'))return;
    const head=document.querySelector('#app .head')||document.querySelector('.head');
    if(!head)return;
    const btn=document.createElement('button');btn.id='fleetBrandOpen';btn.type='button';btn.textContent='Configurar PDF';
    btn.style.cssText='padding:7px 11px;background:#fff;border:1px solid #cbd5e1;color:#0f172a;border-radius:9px;font-size:12px;cursor:pointer;margin-left:auto';
    btn.addEventListener('click',openModal);head.appendChild(btn);
  }
  function openModal(){
    if(modal){modal.remove();modal=null}
    modal=document.createElement('div');modal.id='fleetBrandModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(8,15,26,.66);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px';
    modal.innerHTML='<section role="dialog" aria-modal="true" aria-label="Configurar PDF e QR Code" style="background:white;color:#0f172a;padding:22px;border-radius:18px;max-width:560px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 25px 80px #0005;font:14px system-ui">'+
      '<h2 style="margin:0 0 8px">Configurar PDF</h2>'+
      '<p style="color:#64748b;font-size:12px">Personalização desta base MyGeotab. Nenhuma imagem ou URL é enviada ao repositório público.</p>'+
      '<label for="brandLogoFile" style="display:block;margin:14px 0 5px;font-weight:700">Imagem que aparecerá no PDF (PNG)</label>'+
      '<input id="brandLogoFile" type="file" accept=".png,image/png" style="height:auto;max-width:100%"/>'+
      '<p style="color:#64748b;font-size:11px;margin:5px 0">Imagem horizontal com fundo transparente é recomendada. Máximo de 5 MB; a imagem será redimensionada se necessário.</p>'+
      '<div style="display:flex;align-items:center;gap:12px;margin:8px 0 12px"><img id="brandPdfPreview" alt="Prévia da imagem do PDF" style="max-width:175px;max-height:75px;object-fit:contain;background:#eef2f7;border:1px solid #cbd5e1;border-radius:8px;padding:6px;display:none"/><span id="brandPreviewStatus" style="font-size:12px;color:#64748b">Nenhuma imagem configurada</span></div>'+
      '<label for="brandLogoInput" style="display:block;margin:12px 0 5px">Ou usar imagem pública via URL HTTPS</label><input id="brandLogoInput" placeholder="https://seu-dominio.exemplo/logo.png" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:flex;align-items:center;gap:8px;margin:12px 0"><input type="checkbox" id="brandRemoveLogo" style="width:auto;height:auto"/> Remover imagem do PDF</label>'+
      '<label for="brandSiteInput" style="display:block;margin:14px 0 5px;font-weight:700">Link que será aberto pelo QR Code</label>'+
      '<input id="brandSiteInput" inputmode="url" placeholder="https://seu-dominio.exemplo/" style="width:100%;padding:9px;height:36px"/>'+
      '<p style="color:#64748b;font-size:11px;margin:5px 0">Deixe vazio para não exibir QR Code nos relatórios.</p>'+
      '<details style="margin-top:14px;border-top:1px solid #e2e8f0;padding-top:10px"><summary style="cursor:pointer;font-weight:700">Outras opções de identidade</summary>'+
      '<label style="display:block;margin:12px 0 5px">Nome exibido no relatório</label><input id="brandNameInput" maxlength="100" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:12px 0 5px">Ícone da página (URL HTTPS)</label><input id="brandIconInput" placeholder="https://seu-dominio.exemplo/icone.png" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:10px 0 5px">Ou enviar ícone (PNG, JPG, WebP)</label><input id="brandIconFile" type="file" accept="image/png,image/jpeg,image/webp" style="height:auto;max-width:100%"/>'+
      '<label style="display:block;margin:12px 0 5px">Fonte dos PDFs</label><select id="brandFontInput" style="width:100%;height:36px;border:1px solid #cbd5e1;border-radius:8px"><option>system-ui</option><option>Montserrat</option><option>Inter</option><option>Roboto</option><option>Arial</option></select></details>'+
      '<p id="brandMessage" aria-live="polite" style="font-size:12px;color:#64748b;min-height:20px"></p>'+
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button type="button" id="brandCancel" style="padding:8px 14px">Cancelar</button><button type="button" id="brandSave" style="padding:8px 14px;background:#0f766e;color:white;border:0;border-radius:8px">Salvar configuração</button></div></section>';
    document.body.appendChild(modal);
    const $preview=$('brandPdfPreview'),$status=$('brandPreviewStatus');
    let previewUrl=null;
    const showPreview=(src,description)=>{
      $preview.style.display=src?'block':'none';
      if(src)$preview.src=src;else $preview.removeAttribute('src');
      $status.textContent=description;
    };
    const releasePreview=()=>{if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}};
    const close=()=>{releasePreview();if(modal){modal.remove();modal=null}};
    $('brandNameInput').value=settings.name;
    $('brandSiteInput').value=settings.website;
    $('brandLogoInput').value=/^https:\/\//i.test(settings.logo)?settings.logo:'';
    $('brandIconInput').value=/^https:\/\//i.test(settings.icon)?settings.icon:'';
    $('brandFontInput').value=settings.font;
    showPreview(settings.logo,settings.logo?'Imagem atualmente configurada':'Nenhuma imagem configurada');
    $('brandLogoFile').addEventListener('change',()=>{
      releasePreview();
      const file=$('brandLogoFile').files[0];
      if(file){previewUrl=URL.createObjectURL(file);showPreview(previewUrl,file.name+' · '+Math.ceil(file.size/1024)+' KB')}
      else showPreview(settings.logo,settings.logo?'Imagem atualmente configurada':'Nenhuma imagem configurada');
    });
    $('brandCancel').onclick=close;
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    $('brandSave').onclick=async()=>{
      const b=$('brandSave'),message=$('brandMessage');b.disabled=true;message.textContent='Salvando na base Geotab...';
      try{
        const next={name:$('brandNameInput').value,website:$('brandSiteInput').value,
          logo:$('brandLogoInput').value||settings.logo,icon:$('brandIconInput').value||settings.icon,font:$('brandFontInput').value};
        if($('brandLogoInput').value.trim())next.logo=$('brandLogoInput').value.trim();
        if($('brandLogoFile').files.length)next.logo=await encodePdfPng($('brandLogoFile').files[0]);
        if($('brandRemoveLogo').checked)next.logo='';
        if($('brandIconFile').files.length)next.icon=await encodeImage($('brandIconFile').files[0],96,96);
        if(next.website&&!websiteUrl(next.website))throw new Error('Informe uma URL HTTPS válida para o QR Code.');
        if(next.logo&&!imageSource(next.logo))throw new Error('Imagem do PDF inválida: envie PNG ou use URL HTTPS.');
        if(next.icon&&!imageSource(next.icon))throw new Error('Ícone inválido: use imagem ou URL HTTPS.');
        await save(next);
        message.textContent='Configuração salva nesta base MyGeotab.';close();
      }catch(e){message.textContent='Não foi possível salvar: '+(e.message||e);message.style.color='#b91c1c'}finally{b.disabled=false}
    };
  }
  async function initialize(api){
    apiRef=api||null;
    if(!apiRef)return;
    try{await read()}catch(e){ready=true;settings=defaults();applyBrand();console.warn('Identidade não carregada da Geotab',e)}
    injectButton();
  }
  window.FleetBranding={initialize,get:()=>({...settings}),ready:()=>ready,
    logoHtml,iconHtml,siteUrl:()=>websiteUrl(settings.website),
    refresh:applyBrand,open:openModal};
})();
