(function(){
  if(window.__forceInlineRotagynLogo) return;
  window.__forceInlineRotagynLogo = true;

  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 170">'
    + '<rect width="620" height="170" rx="18" fill="white"/>'
    + '<g font-family="Arial, Helvetica, sans-serif" font-weight="900">'
    + '<text x="18" y="98" font-size="92" fill="#323844" letter-spacing="-8">ROT</text>'
    + '<path d="M246 28 L304 103 L267 103 L257 89 L234 89 L224 103 L190 103 Z" fill="#323844"/>'
    + '<path d="M246 50 L236 73 H255 Z" fill="#ffffff"/>'
    + '<text x="305" y="98" font-size="92" fill="#1178be" letter-spacing="-8">GYN</text>'
    + '<text x="350" y="126" font-size="12" fill="#5b6b7d" font-weight="700">Powered by</text>'
    + '<text x="420" y="126" font-size="20" fill="#1e4f8f" font-weight="800">CheckTOTAL</text>'
    + '</g></svg>';

  var dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  window.ROTAGYN_LOGO_DATA_URI = dataUri;

  try {
    Object.defineProperty(HTMLImageElement.prototype, 'crossOrigin', {
      configurable: true,
      get: function(){ return null; },
      set: function(){ return null; }
    });
  } catch(e) {}

  try {
    var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if(desc && desc.set && desc.get){
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        get: function(){ return desc.get.call(this); },
        set: function(v){
          if(String(v || '').indexOf('rotagyn-logo') >= 0){
            return desc.set.call(this, dataUri);
          }
          return desc.set.call(this, v);
        }
      });
    }
  } catch(e) {}

  setInterval(function(){
    document.querySelectorAll('img').forEach(function(img){
      var src = img.getAttribute('src') || '';
      if(src.indexOf('rotagyn-logo') >= 0){
        img.setAttribute('src', dataUri);
      }
    });
  }, 600);
})();
