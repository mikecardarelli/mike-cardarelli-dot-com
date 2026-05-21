(function () {
  var container = document.getElementById('cmy');
  if (!container) return;

  var cyan   = container.querySelector('.layer-cyan');
  var yellow = container.querySelector('.layer-yellow');
  var els    = { cyan: cyan, yellow: yellow };

  var cfg = {
    cyan:   { ax: 42, ay: 16, fx: 0.001875, fy: 0.001838, px: 0,        py: Math.PI / 2,  oa: 0 },
    yellow: { ax: 42, ay: 16, fx: 0.001875, fy: 0.001838, px: Math.PI,  py: -Math.PI / 2, oa: 0 },
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
      var x = rx;
      var y = ry;
      els[name].style.transform = 'scale(1.4) translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
    }

    rafId = requestAnimationFrame(driftTick);
  }

  function startDrift() {
    startTime = null;
    rafId = requestAnimationFrame(driftTick);
  }

  // Slider controls
  var speedEl  = document.getElementById('ctrl-speed');
  var spreadEl = document.getElementById('ctrl-spread');
  var shapeEl  = document.getElementById('ctrl-shape');

  function applyControls() {
    var s  = speedEl  ? +speedEl.value  : 5;
    var d  = spreadEl ? +spreadEl.value : 5;
    var sh = shapeEl  ? +shapeEl.value  : 5;

    var fx    = s * 0.000375;
    var abase = d * 8 + 2;
    var angle = (sh - 1) / 8 * Math.PI / 2; // value 1 → 0° (h), value 5 → 45° (circle), value 9 → 90° (v)
    var ax    = Math.round(abase * Math.cos(angle));
    var ay    = Math.round(abase * Math.sin(angle));

    cfg.cyan.fx   = fx;  cfg.cyan.fy   = fx * 0.98;
    cfg.cyan.ax   = ax;  cfg.cyan.ay   = ay;
    cfg.yellow.fx = fx;  cfg.yellow.fy = fx * 0.98;
    cfg.yellow.ax = ax;  cfg.yellow.ay = ay;
  }

  if (speedEl)  speedEl.addEventListener('input',  applyControls);
  if (spreadEl) spreadEl.addEventListener('input',  applyControls);
  if (shapeEl)  shapeEl.addEventListener('input',   applyControls);

  startDrift();
})();
