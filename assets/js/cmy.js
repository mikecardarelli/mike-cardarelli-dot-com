(function () {
  var container = document.getElementById('cmy');
  if (!container) return;

  var cyan   = container.querySelector('.layer-cyan');
  var yellow = container.querySelector('.layer-yellow');
  var els    = { cyan: cyan, yellow: yellow };

  var cfg = {
    cyan:   { ax: 42, ay: 16, fx: 0.001875, fy: 0.001838, px: 0,        py: Math.PI / 2, oa: 0 },
    yellow: { ax: 42, ay: 16, fx: 0.001875, fy: 0.001838, px: Math.PI, py: Math.PI / 2, oa: 0 },
  };

  var rafId     = null;
  var startTime = null;

  function driftTick(ts) {
    if (startTime === null) startTime = ts;
    var t = ts - startTime;

    for (var name in cfg) {
      var c = cfg[name];
      var rx = Math.sin(t * c.fx + c.px) * c.ax;
      var ry = Math.cos(t * c.fy + c.py) * c.ay;
      var co = Math.cos(c.oa), so = Math.sin(c.oa);
      var x = rx * co - ry * so;
      var y = rx * so + ry * co;
      els[name].style.transform = 'scale(1.4) translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
    }

    rafId = requestAnimationFrame(driftTick);
  }

  function startDrift() {
    startTime = null;
    rafId = requestAnimationFrame(driftTick);
  }

  // Slider controls
  var speedEl    = document.getElementById('ctrl-speed');
  var spreadEl   = document.getElementById('ctrl-spread');
  var rotationEl = document.getElementById('ctrl-rotation');

  function applyControls() {
    var s  = speedEl    ? +speedEl.value    : 5;
    var d  = spreadEl   ? +spreadEl.value   : 5;
    var rv = rotationEl ? +rotationEl.value : 5;
    var fx = s * 0.000375;
    var ax = d * 8 + 2;
    var ay = Math.round(d * 3 + 1);
    var oa = (rv - 5) * 18 * Math.PI / 180;  // value 5 → 0°, ±90° range
    cfg.cyan.fx   = fx;  cfg.cyan.fy   = fx * 0.98;
    cfg.cyan.ax   = ax;  cfg.cyan.ay   = ay;
    cfg.cyan.oa   = oa;
    cfg.yellow.fx = fx;  cfg.yellow.fy = fx * 0.98;
    cfg.yellow.ax = ax;  cfg.yellow.ay = ay;
    cfg.yellow.oa = oa;
  }

  if (speedEl)    speedEl.addEventListener('input',    applyControls);
  if (spreadEl)   spreadEl.addEventListener('input',   applyControls);
  if (rotationEl) rotationEl.addEventListener('input', applyControls);

  startDrift();
})();
