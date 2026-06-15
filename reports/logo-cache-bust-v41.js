(function(){
  var fresh='../assets/rotagyn-logo.svg?v=0.4.1';
  function fixUrl(v){
    if(!v) return v;
    if(String(v).indexOf('rotagyn-logo.svg')>=0) return fresh;
    return v;
  }
  try{
    var desc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
    if(desc&&desc.set&&desc.get&&!window.__rotagynLogoPatch){
      window.__rotagynLogoPatch=true;
      Object.defineProperty(HTMLImageElement.prototype,'src',{
        get:function(){return desc.get.call(this)},
        set:function(v){return desc.set.call(this,fixUrl(v))}
      });
    }
  }catch(e){}
  setInterval(function(){
    document.querySelectorAll('img').forEach(function(img){
      var src=img.getAttribute('src')||'';
      if(src.indexOf('rotagyn-logo.svg')>=0 && src.indexOf('v=0.4.1')<0){
        img.setAttribute('src',fresh);
      }
    });
  },600);
})();
