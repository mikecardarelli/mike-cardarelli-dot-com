(function () {
  var container = document.getElementById('cmy');
  if (!container) return;

  var cyan    = container.querySelector('.layer-cyan');
  var magenta = container.querySelector('.layer-magenta');
  var yellow  = container.querySelector('.layer-yellow');
  var els     = { cyan: cyan, magenta: magenta, yellow: yellow };

  // Each layer follows a sinusoidal path with different frequencies.
  // px/py = Math.PI/2 so all layers start at (0,0) when t=0 —
  // after a converge they drift cleanly outward with no jump.
  var cfg = {
    cyan:    { ax: 26, ay: 20, fx: 0.00080, fy: 0.00065, px: 0, py: Math.PI / 2 },
    magenta: { ax: 22, ay: 26, fx: 0.00065, fy: 0.00080, px: 0, py: Math.PI / 2 },
    yellow:  { ax: 20, ay: 22, fx: 0.00095, fy: 0.00070, px: 0, py: Math.PI / 2 },
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
      els[name].style.transform = 'translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
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
    rafId = requestAnimationFrame(driftTick);
  }

  function onHover() {
    clearTimeout(holdTimer);
    stopDrift();

    // Animate all layers to center
    for (var name in els) {
      els[name].style.transition = 'transform 0.5s ease-in-out';
      els[name].style.transform  = 'translate(0, 0)';
    }

    // Hold briefly, then drift apart from center
    holdTimer = setTimeout(startDrift, 900);
  }

  startDrift();
  container.addEventListener('mouseenter', onHover);
})();
