(function(){
  if(window.__disableReportLogoCors) return;
  window.__disableReportLogoCors = true;
  try {
    Object.defineProperty(HTMLImageElement.prototype, 'crossOrigin', {
      configurable: true,
      get: function(){ return null; },
      set: function(){ return null; }
    });
  } catch(e) {}
})();
