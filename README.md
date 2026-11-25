# おみせやさんごっこ LP(キッズ・マネー・スクール こぎつね校)

サーバーもビルドも要らない、HTML だけのページです。GitHub Pages に置けば無料で公開できます。

## 日程が変わったら
`event.js` だけを書き換えます(開催日・時間・会場・定員・持ち物・申込フォーム・LINE・電話)。
ページ内の日付や会場名は、すべてこのファイルから入ります。
最終日を過ぎると、申込ボタンは自動で「受付は終了しました」に変わります。

## ファイル
- `index.html` … 本文(文章を直すのはここ)
- `style.css` … 見た目(スマホ優先、900px 以上で PC)
- `event.js` … 開催情報
- `main.js` … event.js の流し込みと、スクロールの動き
- `assets/illust` … イラスト(版画風・赤青黄紺の4色。Gemini で生成して1点ずつ切り抜いたもの)
- `assets/cloud-*.svg` … タイトルの雲の枠
- `tools/build_single.py` … 画像ごと1つの HTML にまとめる(スマホに送って確認する用。`_preview/こぎつね校LP_確認用.html` ができる)
- `tools/add_grain.py` … イラストだけに紙のざらつきをかける。元の絵は `tools/illust-src/` に置き、実行すると `assets/illust/` が作り直される(写真と公式キャラクターにはかけない)
- `assets/photo` … 写真(生成したイメージ。実際の開催写真が手に入ったら同じファイル名で差し替え、「※写真はイメージです」を消す)
- `assets/brand` … 公式ロゴ・キャラクター(本部支給データ)

## GitHub Pages で公開する
1. GitHub で新しいリポジトリを作る(Public)
2. このフォルダの中身をそのままアップロード(`index.html` が一番上に来るように。`_preview` と `tools` は上げなくてよい)
3. Settings → Pages → Branch を `main` / `/ (root)` にして Save
4. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## 手元で確認する
このフォルダで `python3 -m http.server 8000` → ブラウザで `http://localhost:8000`
