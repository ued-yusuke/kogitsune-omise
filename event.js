/* ============================================================
   開催情報は、このファイルだけを書き換えれば LP 全体に反映されます。
   (日程が変わったら days / time / venue を差し替えてください)
   ============================================================ */
window.EVENT = {
  year: 2027,

  // 開催日。増やす・減らすときは { } の行を足す・消す
  //   date: 申込受付の終了判定に使う日付(YYYY-MM-DD)
  //   md:   表示する月日 / wd: 曜日
  days: [
    { date: "2027-01-10", md: "1/10", wd: "日" },
    { date: "2027-01-11", md: "1/11", wd: "月・祝" }
  ],

  time: "9:30〜12:00",
  timeNote: "15分前開場",

  venue: {
    name: "アイプラザ豊橋",
    address: "愛知県豊橋市草間町東山143-6",
    access: "渥美線 南栄駅より徒歩8分",
    parking: "施設駐車場あり",
    map: "https://www.google.com/maps/search/?api=1&query=%E3%82%A2%E3%82%A4%E3%83%97%E3%83%A9%E3%82%B6%E8%B1%8A%E6%A9%8B"
  },

  fee: "無料",
  target: "年中〜小学4年生のお子さまと、その保護者さま",
  targetNote: "数が数えられればOKです",
  capacityNum: "10",          // 先着◯組
  items: "色鉛筆、はさみ、水筒",
  itemsNote: "水筒は必要な方のみ",

  // 申し込み・問い合わせ先
  formUrl: "https://docs.google.com/forms/d/1z2esK5J2v3PXBEmQ1hoZRA3s87Ox8ts52VE92txgLK4/viewform",
  lineUrl: "https://lin.ee/oavrY0I",
  instaUrl: "https://www.instagram.com/kid_money_school_kogitsune/",
  instaId: "@kid_money_school_kogitsune",
  tel: "090-9129-2430",
  telHours: "10:00〜17:00"
};
