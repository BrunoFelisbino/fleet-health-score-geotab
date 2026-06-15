(function(){
  if(window.__rotagynLogoDataFetchV46) return;
  window.__rotagynLogoDataFetchV46 = true;

  var pending = [];
  var dataUri = null;
  var originalSrc = null;

  try {
    var srcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if(srcDesc && srcDesc.set && srcDesc.get){
      originalSrc = srcDesc;
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        get: function(){ return srcDesc.get.call(this); },
        set: function(v){
          var value = String(v || '');
          if(value.indexOf('rotagyn-logo') >= 0){
            if(dataUri){
              return srcDesc.set.call(this, dataUri);
            }
            pending.push(this);
            return;
          }
          return srcDesc.set.call(this, v);
        }
      });
    }
  } catch(e) {}

  try {
    Object.defineProperty(HTMLImageElement.prototype, 'crossOrigin', {
      configurable: true,
      get: function(){ return null; },
      set: function(){ return null; }
    });
  } catch(e) {}

  fetch('../assets/rotagyn-logo.svg?v=0.4.6', {cache:'no-store'})
    .then(function(r){ return r.text(); })
    .then(function(txt){
      var m = txt.match(/data:image\/png;base64,([^\"]+)/);
      if(!m || !m[1]) throw new Error('logo png data not found');
      dataUri = 'data:image/png;base64,' + m[1];
      window.ROTAGYN_LOGO_DATA_URI = dataUri;
      if(originalSrc){
        pending.splice(0).forEach(function(img){
          try { originalSrc.set.call(img, dataUri); } catch(e) {}
        });
      }
      document.querySelectorAll('img').forEach(function(img){
        var src = img.getAttribute('src') || '';
        if(src.indexOf('rotagyn-logo') >= 0){
          try { img.setAttribute('src', dataUri); } catch(e) {}
        }
      });
    })
    .catch(function(err){
      console.warn('Logo Rotagyn inline não carregou:', err);
    });
})();
