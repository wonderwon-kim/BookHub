// [생성형 AI 활용] Claude가 초안 작성
// 화면 공통 틀(layout)과 XSS 방지용 esc() 함수.
// DB에 저장된 값(대여자 이름, 한줄평 등)은 화면에 찍을 때 반드시 esc()를 거칩니다.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

const css = `
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,'Malgun Gothic',sans-serif;background:#f5f6fa;color:#222}
  header{background:#1f3a5f;padding:14px 24px;display:flex;gap:24px;align-items:center;flex-wrap:wrap}
  header a{color:#fff;text-decoration:none} .logo{font-weight:700;font-size:1.2rem}
  main{max-width:900px;margin:24px auto;padding:0 16px}
  table{width:100%;border-collapse:collapse;background:#fff} th,td{padding:10px;border-bottom:1px solid #e3e6ee;text-align:left}
  th{background:#eef1f8} .num{text-align:right}
  .card{background:#fff;padding:20px;border-radius:8px;margin-bottom:16px}
  label{display:block;margin:12px 0;font-weight:600} input,select,textarea{display:block;width:100%;padding:8px;margin-top:4px;font:inherit}
  .btn{display:inline-block;padding:8px 14px;border:0;border-radius:6px;background:#1f3a5f;color:#fff;text-decoration:none;cursor:pointer;font:inherit;width:auto}
  .btn.danger{background:#c0392b} .btn.gray{background:#7f8c8d}
  .error{background:#fdecea;color:#b71c1c;padding:10px 24px;border-radius:6px}
  .tag{padding:2px 8px;border-radius:10px;background:#e8eefc;font-size:.85rem}
  .bar{height:10px;background:#e3e6ee;border-radius:5px;overflow:hidden} .bar>div{height:100%;background:#2e86de}
  .row{display:flex;gap:8px;margin:12px 0} .row input{margin:0}
`;

function layout(title, body) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · BookHub</title><style>${css}</style></head>
<body>
<header>
  <a class="logo" href="/">📚 BookHub</a>
  <a href="/">대여 목록</a><a href="/rental/create">신규 대여</a><a href="/stats">도서 이용 통계</a>
</header>
<main>${body}</main>
</body></html>`;
}

module.exports = { esc, layout };
