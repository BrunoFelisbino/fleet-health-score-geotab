/* Fleet Health Score - identidade configurada no banco MyGeotab, não no código-fonte. */
(function(){
  'use strict';
  const ADD_IN_ID = 'PF3lsbBEQeurnbFs_2HzeA';
  const KEY = 'fleet-health-branding-v1';
  const ALLOWED_FONTS = ['Montserrat','Inter','Roboto','Arial','system-ui'];
  const defaults = ()=>({name:'',logo:'',icon:'',website:'',font:'system-ui'});
  let apiRef=null,recordId=null,settings=defaults(),modal=null,ready=false;
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
  async function read(){
    if(!apiRef)return;
    const rows=await rpc('Get',{typeName:'AddInData',search:{addInId:ADD_IN_ID}});
    const current=(rows||[]).find(row=>row.details&&row.details.kind===KEY);
    recordId=current&&current.id||null;
    settings=current?sanitize(current.details.brand):defaults();
    ready=true;applyBrand();
  }
  async function save(next){
    const clean=sanitize(next),details={kind:KEY,brand:clean,updatedAt:new Date().toISOString()};
    if(JSON.stringify(details).length>9900)throw new Error('As imagens excedem o limite de 10 mil caracteres do AddInData. Use URLs HTTPS ou imagens menores.');
    const entity={addInId:ADD_IN_ID,groups:[{id:'GroupCompanyId'}],details};
    if(recordId){entity.id=recordId;await rpc('Set',{typeName:'AddInData',entity})}
    else{const added=await rpc('Add',{typeName:'AddInData',entity});recordId=added&&added.id||null}
    settings=clean;ready=true;applyBrand();return clean;
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
    const btn=document.createElement('button');btn.id='fleetBrandOpen';btn.type='button';btn.textContent='Personalizar identidade';
    btn.style.cssText='padding:7px 11px;background:#fff;border:1px solid #cbd5e1;color:#0f172a;border-radius:9px;font-size:12px;cursor:pointer;margin-left:auto';
    btn.addEventListener('click',openModal);head.appendChild(btn);
  }
  function openModal(){
    if(modal){modal.remove();modal=null}
    modal=document.createElement('div');modal.id='fleetBrandModal';
    modal.style.cssText='position:fixed;inset:0;background:rgba(8,15,26,.66);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px';
    modal.innerHTML='<section role="dialog" aria-modal="true" aria-label="Identidade do Add-In" style="background:white;color:#0f172a;padding:22px;border-radius:18px;max-width:530px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 25px 80px #0005;font:14px system-ui">'+
      '<h2 style="margin:0 0 8px">Personalização desta base Geotab</h2>'+
      '<p style="color:#64748b;font-size:12px">Estes dados são gravados no AddInData da base atual e não no repositório público.</p>'+
      '<label style="display:block;margin:12px 0 5px">Nome da organização</label><input id="brandNameInput" maxlength="100" placeholder="Nome exibido no relatório" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:12px 0 5px">Site HTTPS para o QR Code do PDF</label><input id="brandSiteInput" placeholder="https://seu-site.example/" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:12px 0 5px">Logotipo (URL HTTPS)</label><input id="brandLogoInput" placeholder="https://.../logo.png" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:10px 0 5px">Ou enviar logotipo</label><input id="brandLogoFile" type="file" accept="image/png,image/jpeg,image/webp" style="height:auto;max-width:100%"/>'+
      '<label style="display:block;margin:12px 0 5px">Ícone (URL HTTPS)</label><input id="brandIconInput" placeholder="https://.../icone.png" style="width:100%;padding:9px;height:36px"/>'+
      '<label style="display:block;margin:10px 0 5px">Ou enviar ícone</label><input id="brandIconFile" type="file" accept="image/png,image/jpeg,image/webp" style="height:auto;max-width:100%"/>'+
      '<label style="display:block;margin:12px 0 5px">Fonte dos PDFs</label><select id="brandFontInput" style="width:100%;height:36px;border:1px solid #cbd5e1;border-radius:8px"><option>system-ui</option><option>Montserrat</option><option>Inter</option><option>Roboto</option><option>Arial</option></select>'+
      '<p id="brandMessage" aria-live="polite" style="font-size:12px;color:#64748b;min-height:20px"></p>'+
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px"><button type="button" id="brandCancel" style="padding:8px 14px">Cancelar</button><button type="button" id="brandSave" style="padding:8px 14px;background:#0f766e;color:white;border:0;border-radius:8px">Salvar na Geotab</button></div></section>';
    document.body.appendChild(modal);
    $('brandNameInput').value=settings.name;
    $('brandSiteInput').value=settings.website;
    $('brandLogoInput').value=settings.logo;
    $('brandIconInput').value=settings.icon;
    $('brandFontInput').value=settings.font;
    $('brandCancel').onclick=()=>{modal.remove();modal=null};
    modal.addEventListener('click',e=>{if(e.target===modal){modal.remove();modal=null}});
    $('brandSave').onclick=async()=>{
      const b=$('brandSave'),message=$('brandMessage');b.disabled=true;message.textContent='Salvando...';
      try{
        const next={name:$('brandNameInput').value,website:$('brandSiteInput').value,
          logo:$('brandLogoInput').value,icon:$('brandIconInput').value,font:$('brandFontInput').value};
        if($('brandLogoFile').files.length)next.logo=await encodeImage($('brandLogoFile').files[0],220,90);
        if($('brandIconFile').files.length)next.icon=await encodeImage($('brandIconFile').files[0],96,96);
        if(next.website&&!websiteUrl(next.website))throw new Error('Informe um site HTTPS válido.');
        if(next.logo&&!imageSource(next.logo))throw new Error('Logotipo inválido: use imagem PNG/JPG/WebP ou link HTTPS.');
        if(next.icon&&!imageSource(next.icon))throw new Error('Ícone inválido: use imagem PNG/JPG/WebP ou link HTTPS.');
        await save(next);
        message.textContent='Configuração salva para esta base.';modal.remove();modal=null;
      }catch(e){message.textContent='Não foi possível salvar: '+(e.message||e);message.style.color='#b91c1c'}finally{b.disabled=false}
    };
  }
  async function initialize(api){
    apiRef=api||null;
    if(!apiRef)return;
    injectButton();
    try{await read()}catch(e){ready=true;settings=defaults();applyBrand();console.warn('Identidade não carregada da Geotab',e)}
    injectButton();
  }
  window.FleetBranding={initialize,get:()=>({...settings}),ready:()=>ready,
    logoHtml,iconHtml,siteUrl:()=>websiteUrl(settings.website),
    refresh:applyBrand,open:openModal};
})();
