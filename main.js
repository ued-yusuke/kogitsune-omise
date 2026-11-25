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
