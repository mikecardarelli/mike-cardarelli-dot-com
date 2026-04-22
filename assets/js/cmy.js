(function () {
  var container = document.getElementById('cmy');
  if (!container) return;

  var base   = container.querySelector('.cmy-base');
  var cyan   = container.querySelector('.layer-cyan');
  var yellow = container.querySelector('.layer-yellow');
  var els    = { cyan: cyan, yellow: yellow };

  var cfg = {
    cyan:   { ax: 42, ay: 16, fx: 0.00220, fy: 0.00216, px: 0, py: Math.PI / 2 },
    yellow: { ax: 16, ay: 42, fx: 0.00260, fy: 0.00256, px: 0, py: Math.PI / 2 },
  };

  var rafId     = null;
  var startTime = null;
  var drifting  = true;
  var holdTimer = null;

  function driftTick(ts) {
    if (!drifting) return;
    if (startTime === null) startTime = ts;
    var t = ts - startTime;

    for (var name in cfg) {
      var c = cfg[name];
      var x = Math.sin(t * c.fx + c.px) * c.ax;
      var y = Math.cos(t * c.fy + c.py) * c.ay;
      els[name].style.transform = 'scale(1.4) translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
    }

    rafId = requestAnimationFrame(driftTick);
  }

  function stopDrift() {
    drifting = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function startDrift() {
    drifting  = true;
    startTime = null;
    for (var name in els) els[name].style.transition = 'none';
    base.style.filter = '';
    rafId = requestAnimationFrame(driftTick);
  }

  function onHover() {
    clearTimeout(holdTimer);
    stopDrift();

    base.style.filter = 'none';

    for (var name in els) {
      els[name].style.transition = 'transform 0.5s ease-in-out';
      els[name].style.transform  = 'scale(1.4) translate(0, 0)';
    }

    holdTimer = setTimeout(startDrift, 900);
  }

  startDrift();
  container.addEventListener('mouseenter', onHover);
})();
