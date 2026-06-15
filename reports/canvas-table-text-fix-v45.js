(function(){
  if(window.__fleetCanvasTableTextFixV45) return;
  window.__fleetCanvasTableTextFixV45 = true;

  function shorten(ctx, value, maxWidth){
    var text = String(value == null ? '' : value);
    if(!maxWidth || text.length < 4) return text;
    if(ctx.measureText(text).width <= maxWidth) return text;
    var out = text;
    while(out.length > 4 && ctx.measureText(out + '...').width > maxWidth){
      out = out.slice(0, -1);
    }
    return out + '...';
  }

  try {
    var originalMeasure = CanvasRenderingContext2D.prototype.measureText;
    var originalFill = CanvasRenderingContext2D.prototype.fillText;

    CanvasRenderingContext2D.prototype.measureText = function(value){
      var text = String(value == null ? '' : value);
      if(text.indexOf('|') >= 0 || /\d{2}\/\d{2}\/\d{4}/.test(text)){
        var result = originalMeasure.call(this, text);
        result.width = Math.min(result.width, 8);
        return result;
      }
      return originalMeasure.call(this, value);
    };

    CanvasRenderingContext2D.prototype.fillText = function(value, x, y, maxWidth){
      var width = 0;
      if(x >= 155 && x < 205) width = 125;
      else if(x >= 295 && x < 340) width = 320;
      else if(x >= 740 && x < 780) width = 220;
      else if(x >= 980 && x < 1020) width = 300;
      else if(x >= 1310 && x < 1350) width = 105;
      if(width) value = shorten(this, value, width);
      return originalFill.call(this, value, x, y, maxWidth);
    };
  } catch(e) {}
})();
