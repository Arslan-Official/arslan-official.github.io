/* =========================================================
   Portfolio behaviour
   - hero attack-path graph (canvas)
   - scroll progress, reveals, counters, active nav
   - pointer tilt + glare, document viewer
   All motion is skipped when the visitor prefers reduced motion.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document;

  /* Marks that JS is live, which is what switches on the hidden-before-reveal
     states in the stylesheet. Without it every section renders immediately. */
  doc.documentElement.classList.add('js');

  /* hero entrance */
  requestAnimationFrame(function () { doc.body.classList.add('is-ready'); });

  Array.prototype.forEach.call(doc.querySelectorAll('.fade'), function (el) {
    el.style.setProperty('--delay', el.getAttribute('data-d') || 0);
  });

  /* ------------------------------------------------------------------
     Hero: drifting node graph with an attack path that lights up.
     Nodes are hosts, edges are reachability, the red pulse is a
     compromise propagating along a path.
     ------------------------------------------------------------------ */
  (function graph() {
    var canvas = doc.getElementById('graph');
    if (!canvas || reduce) return;

    var ctx = canvas.getContext('2d');
    var nodes = [], edges = [], w = 0, h = 0, dpr = 1, raf = null, visible = true;
    var path = null, pathT = 0;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      nodes = [];
      var count = Math.round(Math.min(64, Math.max(26, (w * h) / 26000)));
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - .5) * .14,
          vy: (Math.random() - .5) * .14,
          r: Math.random() * 1.5 + 1,
          hot: 0
        });
      }
    }

    var LINK = 165;

    function links() {
      edges = [];
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) edges.push([i, j, d]);
        }
      }
    }

    /* walk a chain of connected nodes — the "attack path" */
    function makePath() {
      if (!nodes.length) return null;
      var adj = {};
      edges.forEach(function (e) {
        (adj[e[0]] = adj[e[0]] || []).push(e[1]);
        (adj[e[1]] = adj[e[1]] || []).push(e[0]);
      });
      var keys = Object.keys(adj);
      if (!keys.length) return null;
      var cur = +keys[Math.floor(Math.random() * keys.length)];
      var chain = [cur], seen = {};
      seen[cur] = 1;
      for (var step = 0; step < 5; step++) {
        var nbrs = (adj[cur] || []).filter(function (n) { return !seen[n]; });
        if (!nbrs.length) break;
        cur = nbrs[Math.floor(Math.random() * nbrs.length)];
        seen[cur] = 1;
        chain.push(cur);
      }
      return chain.length > 2 ? chain : null;
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (n.hot > 0) n.hot -= .012;
      }
      links();

      /* edges */
      for (var e = 0; e < edges.length; e++) {
        var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
        var alpha = (1 - edges[e][2] / LINK) * .38;
        ctx.strokeStyle = 'rgba(127,168,206,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      /* attack path */
      if (!path) { path = makePath(); pathT = 0; }
      if (path) {
        pathT += .0055;
        var segs = path.length - 1;
        var pos = pathT * segs;
        var seg = Math.floor(pos);
        for (var s = 0; s < segs && s <= seg; s++) {
          var p1 = nodes[path[s]], p2 = nodes[path[s + 1]];
          if (!p1 || !p2) continue;
          var t = s === seg ? (pos - seg) : 1;
          ctx.strokeStyle = 'rgba(255,107,110,.72)';
          ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
          ctx.stroke();
          if (t >= 1 && nodes[path[s + 1]]) nodes[path[s + 1]].hot = 1;
        }
        if (nodes[path[0]]) nodes[path[0]].hot = 1;
        if (pathT >= 1.45) path = null;
      }

      /* nodes */
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        if (nd.hot > 0) {
          ctx.fillStyle = 'rgba(255,107,110,' + (nd.hot * .9).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r + 2.5 * nd.hot, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = 'rgba(198,220,240,.7)';
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, 6.2832); ctx.fill();
      }
    }

    size(); build();
    canvas.classList.add('is-on');
    frame();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); build(); }, 180);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
      }, { threshold: 0 }).observe(canvas);
    }

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) frame();
    });
  })();

  /* ---------------- scroll progress + sticky masthead ---------------- */
  (function scrollUi() {
    var bar = doc.getElementById('progress');
    var head = doc.getElementById('masthead');
    var ticking = false;

    function update() {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (head) head.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* ---------------- reveal on scroll ---------------- */
  (function reveals() {
    var items = doc.querySelectorAll('.reveal, .rule');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      io.observe(el);
    });

    /* Failsafe: if the observer never fires (odd viewport, stitched
       screenshot, prerender), show everything rather than leave the
       page blank. */
    setTimeout(function () {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
    }, 2600);
  })();

  /* ---------------- metric counters ---------------- */
  (function counters() {
    var ns = doc.querySelectorAll('.metric-n');
    if (!ns.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dp = parseInt(el.getAttribute('data-dp'), 10) || 0;
      if (reduce) { el.textContent = target.toFixed(dp); return; }
      var start = performance.now(), dur = 1400;
      (function tick(now) {
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(dp);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(ns, run);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target); io.unobserve(en.target);
      });
    }, { threshold: .6 });
    Array.prototype.forEach.call(ns, function (el) { io.observe(el); });
  })();

  /* ---------------- active nav link ---------------- */
  (function activeNav() {
    var links = doc.querySelectorAll('.nav a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      map[a.getAttribute('href').slice(1)] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Array.prototype.forEach.call(links, function (l) { l.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var sec = doc.getElementById(id);
      if (sec) io.observe(sec);
    });
  })();

  /* ---------------- pointer tilt + glare ---------------- */
  (function tilt() {
    if (reduce || window.matchMedia('(hover: none)').matches) return;
    Array.prototype.forEach.call(doc.querySelectorAll('.tilt'), function (el) {
      var inner = el.querySelector('.doc-img, .card-img');

      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width;
        var py = (ev.clientY - r.top) / r.height;
        el.style.transform =
          'perspective(900px) rotateY(' + ((px - .5) * 7).toFixed(2) + 'deg) rotateX(' +
          ((.5 - py) * 7).toFixed(2) + 'deg) translateY(-4px)';
        el.style.transition = 'transform .08s linear';
        if (inner) {
          inner.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          inner.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        }
      });

      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.22,.61,.36,1)';
        el.style.transform = '';
      });
    });
  })();

  /* ---------------- missing assets ---------------- */
  Array.prototype.forEach.call(doc.querySelectorAll('.doc'), function (d) {
    var img = d.querySelector('img');
    if (!img) return;
    function missing() {
      if (d.classList.contains('is-missing')) return;
      d.classList.add('is-missing');
      d.setAttribute('disabled', 'disabled');
      var note = doc.createElement('span');
      note.className = 'doc-missing-note';
      note.textContent = 'add ' + (d.getAttribute('data-src') || '');
      d.querySelector('.doc-img').appendChild(note);
    }
    img.addEventListener('error', missing);
    if (img.complete && img.naturalWidth === 0) missing();
  });

  /* ---------------- document viewer ---------------- */
  (function viewer() {
    var box = doc.getElementById('viewer');
    var img = doc.getElementById('viewer-img');
    var cap = doc.getElementById('viewer-cap');
    var closeBtn = doc.getElementById('viewer-close');
    var prevBtn = doc.getElementById('viewer-prev');
    var nextBtn = doc.getElementById('viewer-next');
    if (!box) return;

    var items = [], index = 0, lastFocus = null;

    function collect() {
      items = Array.prototype.filter.call(
        doc.querySelectorAll('[data-src]'),
        function (el) { return !el.classList.contains('is-missing'); }
      );
    }

    function show(i) {
      if (!items.length) return;
      index = (i + items.length) % items.length;
      var el = items[index];
      img.src = el.getAttribute('data-src');
      img.alt = el.getAttribute('data-caption') || '';
      cap.textContent = el.getAttribute('data-caption') || '';
      var multi = items.length > 1;
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;
    }

    function open(el) {
      collect();
      var i = items.indexOf(el);
      if (i < 0) return;
      lastFocus = doc.activeElement;
      box.hidden = false;
      doc.body.style.overflow = 'hidden';
      show(i);
      closeBtn.focus();
    }

    function close() {
      if (box.hidden) return;
      box.hidden = true;
      img.src = '';
      doc.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    doc.addEventListener('click', function (ev) {
      var el = ev.target.closest ? ev.target.closest('[data-src]') : null;
      if (el && !el.classList.contains('is-missing')) { open(el); return; }
      if (ev.target === box) close();
    });

    doc.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var el = doc.activeElement && doc.activeElement.closest
        ? doc.activeElement.closest('[data-src]') : null;
      if (el && el.tagName === 'FIGURE' && !el.classList.contains('is-missing')) {
        ev.preventDefault(); open(el);
      }
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });

    doc.addEventListener('keydown', function (ev) {
      if (box.hidden) return;
      if (ev.key === 'Escape') close();
      else if (ev.key === 'ArrowLeft') show(index - 1);
      else if (ev.key === 'ArrowRight') show(index + 1);
    });
  })();

  /* ---------------- mobile navigation ---------------- */
  (function mobileNav() {
    var toggle = doc.getElementById('menu-toggle');
    var nav = doc.getElementById('nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();
})();
