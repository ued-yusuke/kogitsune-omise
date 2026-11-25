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

  /* タイトルの雲: 枠の実寸に合わせて、同じ大きさの丸を等間隔に並べて描く(伸び縮みさせない) */
  var NS = "http://www.w3.org/2000/svg";
  function drawCloud(box) {
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    var pc = w >= 600;
    var R = pc ? 40 : 27;             // こぶの半径
    var line = pc ? 3 : 2.5;          // 紺のふちの太さ
    var drop = pc ? 10 : 8;           // 下の紺の影
    var gap = 1.55;                   // こぶの間隔(半径の何倍か)
    var x0 = R + line, x1 = w - R - line, y0 = R + line, y1 = h - R - line - drop;
    var nx = Math.max(2, Math.round((x1 - x0) / (R * gap))), ny = Math.max(2, Math.round((y1 - y0) / (R * gap)));
    var pts = [], i;
    for (i = 0; i <= nx; i++) { var x = x0 + (x1 - x0) * i / nx; pts.push([x, y0], [x, y1]); }
    for (i = 1; i < ny; i++) { var y = y0 + (y1 - y0) * i / ny; pts.push([x0, y], [x1, y]); }
    function layer(dy, r, fill) {
      var g = document.createElementNS(NS, "g"); g.setAttribute("fill", fill);
      pts.forEach(function (p) { var c = document.createElementNS(NS, "circle"); c.setAttribute("cx", p[0].toFixed(1)); c.setAttribute("cy", (p[1] + dy).toFixed(1)); c.setAttribute("r", r); g.appendChild(c); });
      var rc = document.createElementNS(NS, "rect"); rc.setAttribute("x", x0); rc.setAttribute("y", y0 + dy); rc.setAttribute("width", x1 - x0); rc.setAttribute("height", y1 - y0); g.appendChild(rc);
      return g;
    }
    var svg = box.querySelector(".cloud-bg");
    if (!svg) { svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "cloud-bg"); svg.setAttribute("aria-hidden", "true"); box.insertBefore(svg, box.firstChild); }
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(layer(drop, R + line, "#1E2440"));   // 影
    svg.appendChild(layer(0, R + line, "#1E2440"));      // ふち
    svg.appendChild(layer(0, R, "#FFFDF8"));             // 白
    box.classList.add("is-drawn");
  }
  $$(".hero-cloud").forEach(function (box) {
    drawCloud(box);
    if ("ResizeObserver" in window) new ResizeObserver(function () { drawCloud(box); }).observe(box);
    else window.addEventListener("resize", function () { drawCloud(box); });
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
