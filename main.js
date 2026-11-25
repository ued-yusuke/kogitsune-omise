/* event.js の内容をページに流し込む + スクロールの動き */
(function () {
  var E = window.EVENT;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  if (E) {
    var daysHero = E.days.map(function (d) { return "<span><b>" + esc(d.md) + "</b><i>" + esc(d.wd) + "</i></span>"; }).join('<span class="dot">・</span>');
    var daysBig = E.days.map(function (d) { return "<span><b>" + esc(d.md) + "</b><i>" + esc(d.wd) + "</i></span>"; }).join("");
    var daysLine = E.days.map(function (d) { return d.md + "(" + d.wd + ")"; }).join("・");
    var html = {
      "days-hero": daysHero,
      "days-big": daysBig,
      "venue-detail": esc(E.venue.address) + "<br>" + esc(E.venue.access) + "/" + esc(E.venue.parking)
    };
    var text = {
      "year": E.year, "days-line": daysLine, "time": E.time, "time-note": E.timeNote,
      "venue-name": E.venue.name, "fee": E.fee, "cap": E.capacityNum,
      "target": E.target, "target-note": E.targetNote, "items": E.items, "items-note": E.itemsNote,
      "tel": E.tel, "tel-hours": E.telHours
    };
    $$("[data-ev]").forEach(function (el) {
      var k = el.getAttribute("data-ev");
      if (k === "map") el.href = E.venue.map;
      else if (html[k] != null) el.innerHTML = html[k];
      else if (text[k] != null) el.textContent = text[k];
    });
    $$(".js-form").forEach(function (a) { if (!a.classList.contains("hd-cta")) { a.href = E.formUrl; } });
    $$(".js-line").forEach(function (a) { a.href = E.lineUrl; });
    $$(".js-insta").forEach(function (a) { a.href = E.instaUrl; });
    $$(".js-tel").forEach(function (a) { a.href = "tel:" + E.tel.replace(/[^0-9+]/g, ""); });

    /* 最終日を過ぎたら、申込ボタンを「受付終了」に切り替える */
    var last = E.days.map(function (d) { return d.date; }).sort().pop();
    if (last && new Date() > new Date(last + "T23:59:59+09:00")) {
      $$(".js-form").forEach(function (a) {
        if (a.classList.contains("hd-cta")) return;
        a.classList.add("is-closed"); a.removeAttribute("href");
        var s = a.querySelector("span"); if (s) s.textContent = "受付は終了しました";
      });
      $$(".js-formnote,.js-aplead").forEach(function (p) { p.textContent = "次回の開催は、Instagram・LINEでお知らせします。"; });
    }
  }

  /* ロゴを押したらページの先頭へ(読みこみ直さずに上へ戻る) */
  $$(".hd-logo").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.hash && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* タイトルの雲: 四角ではなく、角の丸い楕円(超楕円)のまわりに大小のこぶを並べた雲の形。
     枠より少し外にはみ出して描き、こぶの大きさは画面の幅で決める(縦横に引き伸ばさない) */
  var NS = "http://www.w3.org/2000/svg";
  var CLOUD = { n: 2.7, step: 1.3, big: 0.3 };   // n: 丸さ(2=楕円、大きいほど四角) / step: こぶの間隔 / big: こぶの大小の幅
  function drawCloud(box) {
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    var pc = w >= 600;
    var R = pc ? 46 : 28;                      // こぶの半径(基準)
    var line = pc ? 3 : 2.5, drop = pc ? 10 : 8;
    var mx = pc ? 24 : 14, my = pc ? 30 : 12;  // 枠の外へはみ出す量
    var W = w + mx * 2, H = h + my * 2 + drop;
    var Rmax = R * (1 + CLOUD.big / 2);
    var cx = W / 2, cy = (H - drop) / 2;
    var a = W / 2 - Rmax - line, b = (H - drop) / 2 - Rmax - line, n = CLOUD.n;
    // 超楕円の輪郭を細かくたどって、長さが等しくなるようにこぶの中心を置く
    var dense = [], k, M = 720;
    for (k = 0; k < M; k++) {
      var t = k / M * Math.PI * 2, ct = Math.cos(t), st = Math.sin(t);
      dense.push([cx + a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), cy + b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n)]);
    }
    var len = [0];
    for (k = 1; k <= M; k++) { var p0 = dense[k - 1], p1 = dense[k % M]; len.push(len[k - 1] + Math.hypot(p1[0] - p0[0], p1[1] - p0[1])); }
    var L = len[M], N = Math.max(8, Math.round(L / (R * CLOUD.step))), pts = [], q = 0;
    for (k = 0; k < N; k++) {
      var d = L * k / N;
      while (len[q + 1] < d) q++;
      var f = (d - len[q]) / (len[q + 1] - len[q]), A = dense[q], B = dense[(q + 1) % M];
      // こぶの大小: 決まった並びの揺らぎ(読みこむたびに変わらない)
      var rnd = (Math.sin(k * 12.9898 + 78.233) * 43758.5453) % 1; rnd = Math.abs(rnd);
      pts.push([A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, R * (1 - CLOUD.big / 2 + CLOUD.big * rnd)]);
    }
    var poly = pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    function layer(dy, grow, fill) {
      var g = document.createElementNS(NS, "g"); g.setAttribute("fill", fill);
      if (dy) g.setAttribute("transform", "translate(0 " + dy + ")");
      pts.forEach(function (p) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", p[0].toFixed(1)); c.setAttribute("cy", p[1].toFixed(1)); c.setAttribute("r", (p[2] + grow).toFixed(1)); g.appendChild(c); });
      var pg = document.createElementNS(NS, "polygon"); pg.setAttribute("points", poly); g.appendChild(pg);
      return g;
    }
    var svg = box.querySelector(".cloud-bg");
    if (!svg) { svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "cloud-bg"); svg.setAttribute("aria-hidden", "true"); box.insertBefore(svg, box.firstChild); }
    svg.setAttribute("viewBox", "0 0 " + W.toFixed(1) + " " + H.toFixed(1));
    svg.style.left = -mx + "px"; svg.style.top = -my + "px"; svg.style.width = W + "px"; svg.style.height = H + "px";
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(layer(drop, line, "#1E2440"));   // 影
    svg.appendChild(layer(0, line, "#1E2440"));      // ふち
    svg.appendChild(layer(0, 0, "#FFFDF8"));         // 白
    box.classList.add("is-drawn");
  }
  $$(".hero-cloud").forEach(function (box) {
    var lastW = 0, lastH = 0;
    function redraw() { if (box.clientWidth === lastW && box.clientHeight === lastH) return; lastW = box.clientWidth; lastH = box.clientHeight; drawCloud(box); }
    redraw();
    if ("ResizeObserver" in window) new ResizeObserver(redraw).observe(box);
    else window.addEventListener("resize", redraw);
  });

  /* スクロールで現れる */
  var rv = $$(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add("on"); }); }

  /* スマホ下部の申込バー: ファーストビューを過ぎたら出し、申込欄では隠す */
  var dock = document.querySelector(".dock"), hero = document.querySelector(".hero-info"), apply = document.querySelector("#apply");
  function onScroll() {
    if (!dock) return;
    var past = hero.getBoundingClientRect().bottom < 0;
    var atApply = apply.getBoundingClientRect().top < window.innerHeight * 0.75;
    dock.classList.toggle("on", past && !atApply);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
