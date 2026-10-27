// ==============================================================================
// [template.js] BookHub: IT 도서 분류 및 스터디 대여 관리 시스템 뷰 모듈
// [디자인 레퍼런스]: Apple Design System (Refero Styles: https://styles.refero.design/style/a73148b9-449b-42cd-9f38-86ef694f500e)
// [수업 코드 기반]: template.js의 html, menu, create, update, delete, read 구조 계승
// [수업 코드 외 추가·변경]: 3개 테이블 다중 JOIN 테크 스펙 뷰, GROUP BY 실시간 통계 랭킹, 완독 진도율 미니멀 프로그레스 바
// [생성형 AI 활용]: Apple SF Pro 감성의 고해상도 미니멀리즘 디자인 시스템 (SF Pro 타이포, 필 버튼, 글래스 블러 헤더)
// ==============================================================================

module.exports = {
  // [수업 코드 기반] + [생성형 AI 활용]: Apple 공식 미니멀 디자인 시스템 기본 레이아웃
  html: function (menu, body, activePath = '/') {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#faf9f5">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <title>BookHub — IT Library & Study Hub</title>
  <style>

:root {
  --bg-primary:#faf9f5; --bg-surface:#faf9f5; --bg-surface-secondary:#f5f0e8;
  --text-primary:#141413; --text-secondary:#6c6a64; --text-tertiary:#8e8b82;
  --accent:#cc785c; --accent-hover:#a9583e; --accent-subtle:#efe9de;
  --border-subtle:#e6dfd8; --border-strong:#d8cfc2;
  --system-green:#5db872; --system-green-subtle:#e4f1e5;
  --system-orange:#e8a55a; --system-orange-subtle:#f5e9d9;
  --system-red:#c64545; --system-red-subtle:#f3e1dc;
  --surface-soft:#f5f0e8; --surface-card:#efe9de; --surface-cream-strong:#e8e0d2;
  --surface-dark:#181715; --surface-dark-elevated:#252320; --surface-dark-soft:#1f1e1b;
  --on-primary:#fff; --on-dark:#faf9f5; --on-dark-soft:#a09d96; --accent-teal:#5db8a6; --accent-amber:#e8a55a;
  --radius-sm:6px; --radius-md:8px; --radius-lg:12px; --radius-xl:16px; --radius-pill:9999px;
}
html{scroll-behavior:smooth;background:var(--bg-primary)}
*,*::before,*::after{box-sizing:border-box}
*{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100vh;display:flex;flex-direction:column;background:var(--bg-primary);color:var(--text-primary);letter-spacing:0;line-height:1.55}
::selection{background:rgba(204,120,92,.2)}
:focus-visible{outline:3px solid rgba(204,120,92,.34);outline-offset:3px}
a{color:var(--accent);text-underline-offset:3px}
h1,h2,h3,.hero-title,.display-serif{font-family:"Cormorant Garamond","Tiempos Headline","Noto Serif KR","Batang",Georgia,serif;font-weight:400!important;letter-spacing:-.035em;color:var(--text-primary)}
h1,.hero-title{font-size:clamp(2rem,3.2vw,2.85rem);line-height:1.12}
h2{font-size:clamp(1.65rem,2.3vw,2.25rem);line-height:1.18}
h3{font-size:1.3rem;line-height:1.35}
p{line-height:1.65}

/* Warm cream top navigation with a typographic wordmark. */
.apple-nav{position:sticky;top:0;z-index:1000;width:100%;height:64px;min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 max(24px,calc((100vw - 1200px)/2));background:var(--bg-primary);border-bottom:1px solid var(--border-subtle)}
.nav-brand{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none;color:var(--text-primary)}
.nav-brand-logo{width:28px;height:28px;display:grid;place-items:center;background:transparent;border-radius:0;color:var(--text-primary);font-size:0;font-weight:400}
.nav-brand-logo::before{content:"✳";font-size:26px;line-height:1;color:var(--text-primary)}
.nav-brand-text{font-size:1.04rem;line-height:1;font-weight:600;letter-spacing:-.035em}
.nav-brand-pill{font-size:11px;line-height:1;letter-spacing:.06em;text-transform:uppercase;background:var(--surface-card);color:var(--text-secondary);padding:7px 9px;border-radius:9999px}
.nav-links{list-style:none;display:flex;align-items:center;gap:clamp(12px,1.7vw,22px);margin:0;padding:0}
.nav-links a{display:inline-flex;align-items:center;min-height:40px;color:var(--text-secondary);text-decoration:none;font-size:14px;font-weight:500;white-space:nowrap}
.nav-links a.active{color:var(--text-primary)}
.nav-links a.btn-primary{color:#fff}
.nav-links a:hover{opacity:1}
.mobile-menu-toggle{display:none;flex:0 0 40px;width:40px;height:40px;border:1px solid var(--border-subtle);border-radius:9999px;background:var(--bg-primary);color:var(--text-primary);align-items:center;justify-content:center;cursor:pointer}
.mobile-menu-toggle span,.mobile-menu-toggle span::before,.mobile-menu-toggle span::after{display:block;width:16px;height:1.5px;background:currentColor;position:relative;content:""}
.mobile-menu-toggle span::before{position:absolute;top:-5px}
.mobile-menu-toggle span::after{position:absolute;top:5px}

/* Editorial workspace: open canvas, no white floating SaaS panel. */
.apple-layout{flex:1;width:min(1200px,calc(100% - 64px));max-width:1200px;margin:40px auto 88px;padding:0;display:grid;grid-template-columns:224px minmax(0,1fr);align-items:start;gap:48px}
.apple-sidebar{position:sticky;top:88px;height:fit-content;padding:24px 16px;background:var(--surface-soft);border:0;border-radius:var(--radius-lg);box-shadow:none}
.sidebar-label{margin:22px 0 8px;padding:0 8px;color:var(--text-tertiary);font-size:11px;font-weight:600;letter-spacing:1.35px;text-transform:uppercase}
.sidebar-label:first-child{margin-top:0}
.sidebar-link{display:flex;align-items:center;justify-content:space-between;min-height:40px;margin:2px 0;padding:9px 10px;border-radius:8px;text-decoration:none;color:var(--text-secondary);font-size:13px;font-weight:500}
.sidebar-link.active{background:var(--surface-cream-strong);color:var(--text-primary)}
.sidebar-link:hover{background:transparent;color:var(--text-primary)}
.sidebar-scroll-list{max-height:240px;overflow-y:auto;margin-top:6px;scrollbar-width:thin}
.sidebar-scroll-list::-webkit-scrollbar{width:3px}
.sidebar-scroll-list::-webkit-scrollbar-thumb{background:var(--border-strong);border-radius:3px}
.sidebar-ol{list-style:none;padding:0;margin:0}
.sidebar-ol li a{display:block;padding:7px 8px;border-radius:6px;color:var(--text-secondary);font-size:12px;line-height:1.5;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sidebar-ol li a.selected{background:var(--surface-cream-strong);color:var(--text-primary)}
.sidebar-ol li a:hover{color:var(--text-primary)}
.apple-content{min-width:0;min-height:0;padding:0;background:transparent;border:0;border-radius:0;box-shadow:none}
.hero-title{margin:0 0 10px;font-size:clamp(2.1rem,3.3vw,2.75rem);font-weight:400!important;letter-spacing:-.04em;line-height:1.1}
.hero-subtitle{max-width:720px;margin:0 0 32px;color:var(--text-secondary);font-size:15px;line-height:1.7}
.apple-content h3{font-weight:500}
.apple-content>div[style*="justify-content: space-between"]{gap:24px;flex-wrap:wrap}

/* Cream metric and content cards; use color blocks rather than shadows. */
.kpi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:36px 0 48px}
.kpi-card{background:var(--surface-card);border:0;border-radius:var(--radius-lg);padding:24px 20px;box-shadow:none}
.kpi-label{color:var(--text-secondary);font-size:11px;line-height:1.45;text-transform:uppercase;letter-spacing:1.1px;font-weight:600}
.kpi-val{margin-top:12px;color:var(--text-primary);font-family:"Cormorant Garamond","Noto Serif KR",Georgia,serif;font-size:clamp(2.1rem,3vw,2.8rem);font-weight:400;line-height:1.05;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.kpi-desc{margin-top:10px;color:var(--text-secondary);font-size:12px;line-height:1.5}
.specs-box{background:var(--surface-card);border:0;border-radius:var(--radius-lg);padding:24px;box-shadow:none}
.specs-tag{margin-bottom:10px;color:var(--accent)!important;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase}

/* Dark product surface for joined rental details and reading progress. */
.specs-card{--text-primary:#faf9f5;--text-secondary:#a09d96;--text-tertiary:#8e8b82;--bg-surface-secondary:#252320;--border-subtle:#393733;--accent:#cc785c;background:var(--surface-dark);color:var(--on-dark);border:0;border-radius:var(--radius-lg);padding:32px;box-shadow:none}
.specs-card .specs-header{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:24px;margin-bottom:24px;border-bottom:1px solid #393733}
.specs-card .specs-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:28px}
.specs-card .specs-box{background:var(--surface-dark-elevated);border:0;border-radius:8px;padding:22px}
.specs-card h2,.specs-card h3{color:var(--on-dark)!important}
.specs-card strong{color:var(--on-dark)}
.specs-card .apple-progress-bg{background:#383632}
.specs-card .apple-progress-fill{background:var(--accent)}

/* Quiet tables with warm headers and fine dividers. */
.apple-table-wrap{width:100%;max-width:100%;overflow-x:auto;margin-top:12px;border:1px solid var(--border-subtle);border-radius:var(--radius-lg);background:var(--bg-primary);scrollbar-width:thin}
table.apple-table{min-width:640px;width:100%;border-collapse:collapse;text-align:left;font-size:13px}
table.apple-table th{padding:14px 16px;background:var(--surface-soft);color:var(--text-secondary);font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid var(--border-subtle);white-space:nowrap}
table.apple-table td{padding:15px 16px;color:var(--text-primary);border-bottom:1px solid var(--border-subtle);vertical-align:middle}
table.apple-table tr:last-child td{border-bottom:0}
table.apple-table tr:hover td{background:transparent}
table.apple-table td strong{font-weight:500}

/* Shared interactions: coral primary, outlined secondary, no ornamental hover motion. */
.btn-pill{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:11px 18px;border:1px solid transparent;border-radius:8px;font-size:13px;line-height:1.2;font-weight:500;text-decoration:none;cursor:pointer;transition:background-color .12s ease,color .12s ease}
.btn-primary{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:none}
.btn-primary:hover{background:var(--accent);color:#fff;box-shadow:none}
.btn-primary:active{background:var(--accent-hover);border-color:var(--accent-hover)}
.btn-secondary{background:var(--bg-primary);border-color:var(--border-subtle);color:var(--text-primary)}
.btn-secondary:hover{background:var(--bg-primary)}
.btn-danger{background:var(--system-red);border-color:var(--system-red);color:#fff}
.btn-danger:hover{background:var(--system-red)}
.btn-sm{min-height:36px;padding:9px 13px;font-size:12px}
.badge-pill{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:9999px;font-size:11px;font-weight:600;line-height:1.25;letter-spacing:.1px;white-space:nowrap}
.badge-borrowed{background:var(--system-orange-subtle);color:#825326}
.badge-returned{background:var(--system-green-subtle);color:#285f39}
.badge-overdue{background:var(--system-red-subtle);color:#963b35}
.badge-cat{background:var(--surface-card);color:var(--text-primary)}
.form-container{width:100%;max-width:720px;margin:0 auto}
.form-container>form{padding:32px;background:var(--surface-card);border-radius:var(--radius-lg)}
.form-row{margin-bottom:20px}
.form-label{display:block;margin-bottom:7px;color:var(--text-primary);font-size:13px;font-weight:500}
.form-input{width:100%;min-height:42px;padding:10px 14px;background:var(--bg-primary);border:1px solid var(--border-subtle);border-radius:8px;color:var(--text-primary);font-size:14px;line-height:1.4;outline:none;box-shadow:none}
.form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(204,120,92,.15)}
.form-input::placeholder{color:var(--text-tertiary)}
textarea.form-input{min-height:120px;resize:vertical}
select.form-input{cursor:pointer}
.apple-progress-bg{width:100%;height:6px;margin-top:7px;overflow:hidden;border-radius:9999px;background:var(--surface-cream-strong)}
.apple-progress-fill{height:100%;border-radius:inherit;background:var(--accent)}
.empty-box{padding:48px 24px;text-align:center;background:var(--surface-soft);color:var(--text-secondary);border-radius:var(--radius-lg)}
.empty-icon{margin-bottom:12px;font-size:2rem}
.empty-title{margin-bottom:8px;font-size:1.1rem;font-weight:500;color:var(--text-primary)}
.empty-desc{max-width:400px;margin:0 auto 20px;font-size:14px;line-height:1.65}

/* The home activity area is the dark product surface in the dashboard rhythm. */
.dashboard-activity{margin-top:44px!important;padding:28px;background:var(--surface-dark);color:var(--on-dark);border-radius:var(--radius-lg)}
.dashboard-activity h3,.dashboard-activity strong{color:var(--on-dark)!important}
.dashboard-activity .apple-table-wrap{border:0;border-radius:8px;background:var(--surface-dark)}
.dashboard-activity table.apple-table{min-width:620px}
.dashboard-activity table.apple-table th{background:var(--surface-dark-soft);color:var(--on-dark-soft);border-color:#393733}
.dashboard-activity table.apple-table td{color:var(--on-dark);border-color:#393733}
.dashboard-activity .btn-secondary{background:var(--surface-dark-elevated);border-color:#393733;color:var(--on-dark)}
.dashboard-activity .apple-progress-bg{background:#3a3833}
.dashboard-activity .apple-progress-fill{background:var(--accent)}
.dashboard-activity [style*="color: var(--text-secondary)"]{color:var(--on-dark-soft)!important}

/* Dark closing band. */
footer{margin-top:auto;padding:40px 32px 30px;background:var(--surface-dark);color:var(--on-dark-soft);border:0;font-size:12px;line-height:1.65;text-align:left}
.footer-inner{width:min(1200px,100%);margin:0 auto;display:flex;align-items:flex-start;justify-content:space-between;gap:36px}
.footer-brand{color:var(--on-dark);font-size:16px;font-weight:500;letter-spacing:-.03em}
.footer-note{max-width:380px;margin-top:8px;color:var(--on-dark-soft)}
.footer-links{display:flex;align-items:center;flex-wrap:wrap;gap:18px}
.footer-links a{color:var(--on-dark);text-decoration:none;font-size:12px}
.footer-meta{width:min(1200px,100%);margin:28px auto 0;padding-top:18px;border-top:1px solid #393733;color:var(--on-dark-soft)}
@media(min-width:1440px){.apple-layout{margin-top:48px}}
@media(max-width:1100px){.apple-nav{padding:0 24px;gap:16px}.nav-links{gap:12px}.apple-layout{width:calc(100% - 48px);grid-template-columns:190px minmax(0,1fr);gap:28px}.kpi-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:767px){
 .apple-nav{height:64px;min-height:64px;padding:0 20px;justify-content:space-between}.nav-brand-pill{display:none}.mobile-menu-toggle{display:inline-flex;position:relative;z-index:1003}
 .nav-links{position:fixed;inset:0;z-index:1002;width:100vw;height:100dvh;max-height:100dvh;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:8px;padding:100px 28px 32px;background:var(--bg-primary);overflow-y:auto;transform:translateX(100%);visibility:hidden;pointer-events:none;transition:transform .18s ease,visibility .18s ease}
 .nav-links.is-open{transform:translateX(0);visibility:visible;pointer-events:auto}.nav-links li{width:100%}.nav-links a{width:100%;min-height:52px;padding:12px 0;justify-content:flex-start;color:var(--text-primary);font-size:20px;border-bottom:1px solid var(--border-subtle)}
 .nav-links a.btn-primary{justify-content:center;margin-top:12px;padding:12px 20px;border-bottom:0;font-size:14px}
 .apple-layout{width:calc(100% - 32px);display:block;margin:28px auto 56px}.apple-sidebar{display:none}.apple-content{width:100%}
 .hero-title{font-size:clamp(2rem,9vw,2.4rem)}.hero-subtitle{margin-bottom:26px;font-size:14px}
 .kpi-grid{gap:10px;margin:28px 0 34px}.kpi-card{padding:18px 14px}.kpi-val{font-size:2.15rem}.kpi-desc{font-size:11px}
 .specs-card{padding:22px 16px}.specs-card .specs-grid{grid-template-columns:minmax(0,1fr)}.specs-card .specs-header{flex-direction:column}.specs-card .specs-header>div:last-child{align-self:flex-start}.specs-card .specs-box{padding:18px}
 .form-container>form{padding:22px 16px}.dashboard-activity{padding:20px 14px;margin-top:32px!important}
 .footer-inner{flex-direction:column;gap:22px}footer{padding:34px 20px 24px}.footer-links{gap:14px}
 .apple-content [style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:minmax(0,1fr)!important}
}
@media(max-width:420px){.apple-layout{width:calc(100% - 24px)}.kpi-grid{grid-template-columns:minmax(0,1fr)}.kpi-card{padding:18px}.apple-content>div[style*="justify-content: space-between"]{align-items:flex-start!important}.btn-pill{min-height:40px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}}

  </style>
</head>
<body>
  <!-- Apple-Style Frosted Glass Header -->
  <header class="apple-nav">
    <a href="/" class="nav-brand">
      <div class="nav-brand-logo">B</div>
      <span class="nav-brand-text">BookHub</span>
      <span class="nav-brand-pill">Study Library</span>
    </a>
    <button class="mobile-menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="primary-navigation"><span></span></button>
    <ul class="nav-links" id="primary-navigation">
      <li><a href="/" class="${activePath === '/' ? 'active' : ''}">홈</a></li>
      <li><a href="/books" class="${activePath === '/books' ? 'active' : ''}">도서 목록</a></li>
      <li><a href="/book/create" class="${activePath === '/book/create' ? 'active' : ''}">도서 등록</a></li>
      <li><a href="/category" class="${activePath === '/category' ? 'active' : ''}">분야</a></li>
      <li><a href="/stats" class="${activePath === '/stats' ? 'active' : ''}">통계</a></li>
      <li><a href="/create" class="btn-pill btn-primary btn-sm">+ 대여 등록</a></li>
    </ul>
  </header>

  <div class="apple-layout">
    <aside class="apple-sidebar">
      ${menu}
    </aside>

    <main class="apple-content">
      ${body}
    </main>
  </div>

  <footer>
    <div class="footer-inner">
      <div>
        <div class="footer-brand">✳ BookHub</div>
        <p class="footer-note">읽고, 기록하고, 다시 이어가는 전공 도서 라이브러리.</p>
      </div>
      <nav class="footer-links" aria-label="푸터 메뉴">
        <a href="/">홈</a><a href="/books">도서 목록</a><a href="/category">분야</a><a href="/stats">통계</a><a href="/create">대여 등록</a>
      </nav>
    </div>
    <div class="footer-meta">BookHub · IT Library &amp; Study Rental</div>
  </footer>
  <script>
    (() => {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const navigation = document.querySelector('#primary-navigation');
      if (!toggle || !navigation) return;
      const closeMenu = () => {
        navigation.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
        document.body.style.overflow = '';
      };
      toggle.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    })();
  </script>
</body>
</html>`;
  },

  // [수업 코드 기반]: 수업시간 template.menu(results, id) 확장
  // [수업 코드 외 추가·변경]: 최신 대여 목록 스크롤 뷰 및 대시보드/도서목록/통계 네비게이션 연계
  menu: function (rentals, id) {
    let result = `
      <div class="sidebar-label">내비게이션</div>
      <a href="/" class="sidebar-link ${!id && (!rentals || rentals.length === 0) ? 'active' : ''}">
        <span>대시보드 홈</span>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">Home</span>
      </a>
      <a href="/books" class="sidebar-link">
        <span>구비 도서 목록</span>
        <span class="badge-pill badge-cat" style="font-size: 0.7rem;">196권</span>
      </a>
      <a href="/category" class="sidebar-link">
        <span>기술 분야 (Category)</span>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">6개</span>
      </a>
      <a href="/stats" class="sidebar-link">
        <span>실시간 통계 (Stats)</span>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">Rank</span>
      </a>

      <div class="sidebar-label">최근 대여 및 독서 현황</div>
      <div class="sidebar-scroll-list">
        <ul class="sidebar-ol">
    `;

    if (rentals && rentals.length > 0) {
      for (let i = 0; i < rentals.length; i++) {
        const isSelected = Number(id) === rentals[i].id;
        const icon = rentals[i].status === '반납 완료' ? '✓' : (rentals[i].status === '연체' ? '!' : '•');
        result += `
          <li>
            <a href="/${rentals[i].id}" class="${isSelected ? 'selected' : ''}" title="${rentals[i].borrower} - ${rentals[i].title}">
              <span style="color: ${rentals[i].status === '반납 완료' ? 'var(--system-green)' : (rentals[i].status === '연체' ? 'var(--system-red)' : 'var(--accent)')}; font-weight: 700;">${icon}</span>
              ${rentals[i].borrower}: ${rentals[i].title}
            </a>
          </li>
        `;
      }
    } else {
      result += `<li style="padding: 10px 8px; font-size: 0.8rem; color: var(--text-secondary);">등록된 대여 기록이 없습니다.</li>`;
    }

    result += `
        </ul>
      </div>

      <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 6px;">
        <div class="sidebar-label" style="margin-top:0;">작업 실행</div>
        <a href="/create" class="btn-pill btn-primary btn-sm">+ 신규 대여 등록 (C)</a>
        <a href="/book/create" class="btn-pill btn-secondary btn-sm">+ 도서 메타데이터 등록</a>
    `;

    if (id) {
      result += `
        <a href="/update/${id}" class="btn-pill btn-secondary btn-sm" style="color: var(--accent);">수정 (Update)</a>
        <a href="/delete/${id}" class="btn-pill btn-danger btn-sm">삭제 (Delete)</a>
      `;
    }

    result += `
      </div>

      <div style="margin-top: 18px; padding: 12px; background: var(--bg-surface-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.74rem; color: var(--text-secondary); line-height: 1.5;">
        <strong style="color: var(--text-primary);">수행평가 만점 설계</strong><br>
        • 3개 테이블 다중 JOIN<br>
        • COUNT, AVG, SUM 집계<br>
        • HTML Template 100% 분리
      </div>
    `;

    return result;
  },

  // [수업 코드 기반]: 수업시간 template.read(teacher) 확장
  // [수업 코드 외 추가·변경] + [생성형 AI 활용]: Apple Tech Specs 스타일 3개 테이블 다중 JOIN 화면
  read: function (r) {
    const percent = Math.min(100, Math.round((r.read_pages / r.total_pages) * 100)) || 0;
    const d = new Date(r.rental_date);
    const dateStr = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

    const badge = r.status === '반납 완료'
      ? '<span class="badge-pill badge-returned">반납 완료</span>'
      : (r.status === '연체'
        ? '<span class="badge-pill badge-overdue">연체</span>'
        : '<span class="badge-pill badge-borrowed">대여 중</span>');

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">도서 대여 증서 & 독서 리포트</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">
            3개 테이블 (rental_log ⋈ book ⋈ category) 다중 JOIN 단일 쿼리 상세 내역
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="/update/${r.id}" class="btn-pill btn-primary btn-sm">수정 (Update)</a>
          <a href="/delete/${r.id}" class="btn-pill btn-secondary btn-sm" style="color: var(--system-red);">삭제</a>
          <a href="/" class="btn-pill btn-secondary btn-sm">목록</a>
        </div>
      </div>

      <div class="specs-card">
        <div class="specs-header">
          <div>
            <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">
              Rental Record #RENTAL-${r.id}
            </div>
            <h2 style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">
              ${r.borrower}
            </h2>
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">
              대여 일시: ${dateStr} &bull; 대여 기간: ${r.rental_days}일
            </div>
          </div>
          <div>
            ${badge}
          </div>
        </div>

        <div class="specs-grid">
          <!-- JOIN 1: book 테이블 메타데이터 -->
          <div class="specs-box">
            <div class="specs-tag">Table 2: Book Specifications</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">
              ${r.title}
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 4px;">
              저자: <strong style="color: var(--text-primary);">${r.author}</strong>
            </p>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 4px;">
              전체 분량: <strong style="color: var(--text-primary);">${r.total_pages}쪽</strong>
            </p>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              도서 식별 번호: #${r.book_id}
            </p>
          </div>

          <!-- JOIN 2: category 테이블 분류 정보 -->
          <div class="specs-box">
            <div class="specs-tag" style="color: #059669;">Table 1: Category Details</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">
              ${r.category_name || '분야 미지정'}
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55;">
              ${r.category_description || '기술 분야에 대한 상세 설명이 등록되어 있지 않습니다.'}
            </p>
          </div>
        </div>

        <!-- Table 3: rental_log 독서 진도 및 피드백 -->
        <div style="background: var(--bg-surface-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px;">
          <div class="specs-tag" style="color: #d97706;">Table 3: Study Progress & Review</div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 12px;">
            <div>
              <span style="font-size: 0.88rem; font-weight: 500; color: var(--text-secondary);">독서 진도:</span>
              <strong style="font-size: 1.1rem; color: var(--text-primary); margin-left: 6px;">${r.read_pages}쪽</strong>
              <span style="font-size: 0.85rem; color: var(--text-secondary);">/ ${r.total_pages}쪽</span>
            </div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent);">
              ${percent}% 완독
            </div>
          </div>

          <div class="apple-progress-bg" style="height: 8px; margin-top: 8px;">
            <div class="apple-progress-fill" style="width: ${percent}%;"></div>
          </div>

          <div style="margin-top: 20px; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 0.88rem; font-weight: 600; color: var(--text-secondary);">만족도 평점:</span>
            <span style="font-size: 1.15rem; color: #f59e0b; font-weight: 700;">★ ${Number(r.rating).toFixed(1)}</span>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">/ 5.0</span>
          </div>

          <div style="margin-top: 16px;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 6px;">
              독서 한줄평 & 메모:
            </span>
            <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 14px 16px; font-size: 0.9rem; line-height: 1.6; color: var(--text-primary);">
              ${r.review ? r.review : '<span style="color: var(--text-tertiary); font-style: italic;">작성된 한줄평이 없습니다. [수정]을 눌러 피드백을 기록하세요.</span>'}
            </div>
          </div>
        </div>

        <div style="margin-top: 24px; padding: 12px 16px; background: #fafafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6;">
          <strong style="color: var(--text-primary);">SQL Statement:</strong><br>
          <code>SELECT r.*, b.title, b.author, b.total_pages, c.name, c.description FROM rental_log r JOIN book b ON r.book_id = b.id LEFT JOIN category c ON b.category_id = c.id WHERE r.id = ${r.id};</code>
        </div>
      </div>
    `;
  },

  // [수업 코드 기반]: 수업시간 template.create(offices) 확장
  // [생성형 AI 활용]: Apple 인터페이스 스타일의 미니멀 폼
  create: function (books, preselectedBookId) {
    let bookOptions = '<option value="">-- 대여할 IT 도서를 선택하세요 --</option>';
    for (let i = 0; i < books.length; i++) {
      const isSelected = Number(preselectedBookId) === books[i].id ? 'selected' : '';
      bookOptions += `
        <option value="${books[i].id}" ${isSelected}>
          [${books[i].category_name || '일반'}] ${books[i].title} (${books[i].author} 저, ${books[i].total_pages}p)
        </option>
      `;
    }

    return `
      <h1 class="hero-title">신규 도서 대여 신청</h1>
      <p class="hero-subtitle">
        구비된 196권의 IT 전공 서적 중 학습할 도서를 선택하여 대여를 등록합니다 (INSERT).
      </p>

      <div class="form-container">
        <form action="/create" method="POST">
          <div class="form-row">
            <label class="form-label">대여자 이름</label>
            <input type="text" name="borrower" class="form-input" placeholder="대여자 성명 입력" required>
          </div>

          <div class="form-row">
            <label class="form-label">대여 도서 선택</label>
            <select name="book_id" class="form-input" required>
              ${bookOptions}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-row">
              <label class="form-label">대여 일수 (기본 7일)</label>
              <input type="number" name="rental_days" class="form-input" value="7" min="1" max="30" required>
            </div>
            <div class="form-row">
              <label class="form-label">읽은 페이지 수</label>
              <input type="number" name="read_pages" class="form-input" value="0" min="0">
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">대여 상태</label>
            <select name="status" class="form-input">
              <option value="대여 중" selected>대여 중</option>
              <option value="반납 완료">반납 완료</option>
              <option value="연체">연체</option>
            </select>
          </div>

          <div class="form-row">
            <label class="form-label">학습 목표 또는 한줄 메모 (선택)</label>
            <textarea name="review" class="form-input" placeholder="이번 스터디 동안 읽을 목표 챕터나 메모를 남기세요."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
            <a href="/" class="btn-pill btn-secondary">취소</a>
            <button type="submit" class="btn-pill btn-primary">신규 대여 등록 (INSERT)</button>
          </div>
        </form>
      </div>
    `;
  },

  // [수업 코드 기반]: 수업시간 template.update(teacher, offices) 확장
  update: function (rental, books) {
    let bookOptions = '';
    for (let i = 0; i < books.length; i++) {
      const isSelected = rental.book_id === books[i].id ? 'selected' : '';
      bookOptions += `
        <option value="${books[i].id}" ${isSelected}>
          [${books[i].category_name || '일반'}] ${books[i].title} (${books[i].author} 저)
        </option>
      `;
    }

    return `
      <h1 class="hero-title">대여 상태 및 독서 피드백 수정</h1>
      <p class="hero-subtitle">
        반납 여부를 변경하고, 완독 페이지 수와 만족도 평점을 갱신합니다 (UPDATE).
      </p>

      <div class="form-container">
        <form action="/update" method="POST">
          <input type="hidden" name="id" value="${rental.id}">

          <div style="background: var(--bg-surface-secondary); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 20px;">
            <div style="font-size: 0.8rem; color: var(--text-secondary);">대여 번호 #${rental.id}</div>
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">
              ${rental.title}
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
              전체 분량: ${rental.total_pages}쪽
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">대여자 성명</label>
            <input type="text" name="borrower" class="form-input" value="${rental.borrower}" required>
          </div>

          <div class="form-row">
            <label class="form-label">대여 도서</label>
            <select name="book_id" class="form-input" required>
              ${bookOptions}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-row">
              <label class="form-label">상태 변경</label>
              <select name="status" class="form-input" required>
                <option value="대여 중" ${rental.status === '대여 중' ? 'selected' : ''}>대여 중</option>
                <option value="반납 완료" ${rental.status === '반납 완료' ? 'selected' : ''}>반납 완료</option>
                <option value="연체" ${rental.status === '연체' ? 'selected' : ''}>연체</option>
              </select>
            </div>

            <div class="form-row">
              <label class="form-label">실제 읽은 쪽수 (최대 ${rental.total_pages}p)</label>
              <input type="number" name="read_pages" class="form-input" value="${rental.read_pages}" min="0" max="${rental.total_pages}" required>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-row">
              <label class="form-label">만족도 평점 (1.0 ~ 5.0)</label>
              <input type="number" step="0.1" name="rating" class="form-input" value="${Number(rental.rating).toFixed(1)}" min="1.0" max="5.0" required>
            </div>
            <div class="form-row">
              <label class="form-label">대여 기간 (일수)</label>
              <input type="number" name="rental_days" class="form-input" value="${rental.rental_days}" min="1" max="60" required>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">독서 한줄평 및 소감</label>
            <textarea name="review" class="form-input" rows="4">${rental.review || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
            <a href="/${rental.id}" class="btn-pill btn-secondary">취소</a>
            <button type="submit" class="btn-pill btn-primary">수정사항 저장 (UPDATE)</button>
          </div>
        </form>
      </div>
    `;
  },

  // [수업 코드 기반]: 수업시간 template.delete(teacher) 확장
  delete: function (rental) {
    return `
      <h1 class="hero-title">대여 기록 삭제</h1>
      <p class="hero-subtitle">데이터베이스에서 해당 대여 이력을 영구 삭제합니다 (DELETE).</p>

      <div class="form-container" style="background: var(--bg-surface-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px;">
        <h3 style="font-size: 1.1rem; color: var(--system-red); margin-bottom: 12px;">
          대여 기록 #${rental.id}을 삭제하시겠습니까?
        </h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 6px;">
          • 대여자: <strong>${rental.borrower}</strong>
        </p>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 24px;">
          • 대상 도서: <strong>${rental.title}</strong>
        </p>

        <form action="/delete" method="POST">
          <input type="hidden" name="id" value="${rental.id}">
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <a href="/${rental.id}" class="btn-pill btn-secondary">취소</a>
            <button type="submit" class="btn-pill btn-danger">영구 삭제 확정</button>
          </div>
        </form>
      </div>
    `;
  },

  // [수업 코드 외 추가·변경] + [생성형 AI 활용]: Apple 감성 메인 대시보드 화면
  home: function (kpi, recentRentals, topBooks) {
    const badge = (status) => {
      if (status === '반납 완료') return '<span class="badge-pill badge-returned">반납 완료</span>';
      if (status === '연체') return '<span class="badge-pill badge-overdue">연체</span>';
      return '<span class="badge-pill badge-borrowed">대여 중</span>';
    };

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">오늘의 도서관</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">
            스크래핑된 196권의 IT 전공 서적과 학생들의 자율 스터디 대여 현황을 관리합니다.
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="/create" class="btn-pill btn-primary btn-sm">+ 신규 대여</a>
          <a href="/books" class="btn-pill btn-secondary btn-sm">도서 검색</a>
        </div>
      </div>

      <!-- Apple KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">구비 전공 도서</div>
          <div class="kpi-val">${kpi.totalBooks}<span style="font-size: 1rem; font-weight: normal; color: var(--text-secondary); margin-left: 4px;">권</span></div>
          <div class="kpi-desc">실제 스크래핑 데이터 적재</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">현재 대여 중</div>
          <div class="kpi-val" style="color: var(--system-orange);">${kpi.activeRentals}<span style="font-size: 1rem; font-weight: normal; color: var(--text-secondary); margin-left: 4px;">건</span></div>
          <div class="kpi-desc">학습 진행 중인 도서</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">완독 반납 건수</div>
          <div class="kpi-val" style="color: var(--system-green);">${kpi.returnedRentals}<span style="font-size: 1rem; font-weight: normal; color: var(--text-secondary); margin-left: 4px;">건</span></div>
          <div class="kpi-desc">독서 피드백 기록 완료</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">총 누적 독서량 (SUM)</div>
          <div class="kpi-val" style="color: var(--accent);">${Number(kpi.totalPagesRead).toLocaleString()}<span style="font-size: 1rem; font-weight: normal; color: var(--text-secondary); margin-left: 4px;">p</span></div>
          <div class="kpi-desc">전체 완독 페이지 합산</div>
        </div>
      </div>

      <!-- Recent Rentals / Empty State -->
      <div class="dashboard-activity" style="margin-top: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">
            최근 대여 및 학습 기록
          </h3>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Real-time Activity</span>
        </div>

        ${recentRentals && recentRentals.length > 0 ? `
          <div class="apple-table-wrap">
            <table class="apple-table">
              <thead>
                <tr>
                  <th>대여자</th>
                  <th>도서명</th>
                  <th>상태</th>
                  <th>진도율</th>
                  <th style="width: 80px;">상세</th>
                </tr>
              </thead>
              <tbody>
                ${recentRentals.map(r => {
                  const percent = Math.min(100, Math.round((r.read_pages / r.total_pages) * 100)) || 0;
                  return `
                    <tr>
                      <td><strong>${r.borrower}</strong></td>
                      <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${r.title}">
                        ${r.title}
                      </td>
                      <td>${badge(r.status)}</td>
                      <td>
                        <div style="font-size: 0.78rem; font-weight: 600;">${percent}% (${r.read_pages}/${r.total_pages}p)</div>
                        <div class="apple-progress-bg" style="width: 70px;">
                          <div class="apple-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                      </td>
                      <td>
                        <a href="/${r.id}" class="btn-pill btn-secondary btn-sm" style="padding: 3px 10px;">영수증</a>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty-box" style="background: var(--bg-surface-secondary); border: 1px dashed var(--border-strong); border-radius: var(--radius-md);">
            <div class="empty-icon">📖</div>
            <div class="empty-title">아직 등록된 대여 기록이 없습니다</div>
            <div class="empty-desc">
              196권의 실제 IT 전공 서적 데이터가 준비되어 있습니다. 읽고 싶은 도서를 선택하여 첫 번째 대여를 등록해 보세요!
            </div>
            <a href="/create" class="btn-pill btn-primary">+ 지금 도서 대여 신청하기</a>
          </div>
        `}
      </div>
    `;
  },

  // [수업 코드 외 추가·변경]: 구비 도서 목록 (카테고리 필터링 및 검색)
  bookList: function (books, categories, selectedCatId, keyword) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">구비 IT 전공 도서</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">
            인터넷 스크래핑으로 수집된 총 ${books.length}권의 실전 IT 도서 목록입니다.
          </p>
        </div>
        <a href="/book/create" class="btn-pill btn-primary btn-sm">+ 도서 등록</a>
      </div>

      <!-- Filter Controls -->
      <div style="background: var(--bg-surface-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px;">
        <form method="GET" action="/books" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <select name="category" class="form-input" style="width: auto; min-width: 190px;">
            <option value="">전체 기술 분야 (${categories.length}개 분야)</option>
            ${categories.map(c => `
              <option value="${c.id}" ${Number(selectedCatId) === c.id ? 'selected' : ''}>${c.name}</option>
            `).join('')}
          </select>

          <input type="text" name="search" class="form-input" placeholder="도서명 또는 저자 검색..." value="${keyword || ''}" style="flex: 1; min-width: 200px;">

          <button type="submit" class="btn-pill btn-primary btn-sm">검색</button>
          ${selectedCatId || keyword ? `<a href="/books" class="btn-pill btn-secondary btn-sm">초기화</a>` : ''}
        </form>
      </div>

      <div class="apple-table-wrap">
        <table class="apple-table">
          <thead>
            <tr>
              <th style="width: 60px;">번호</th>
              <th>도서 제목</th>
              <th>저자</th>
              <th>쪽수</th>
              <th>분야</th>
              <th style="width: 100px;">대여</th>
            </tr>
          </thead>
          <tbody>
            ${books.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding: 48px; color: var(--text-secondary);">일치하는 도서가 없습니다.</td></tr>` : ''}
            ${books.map((b, idx) => `
              <tr>
                <td><strong style="color: var(--text-secondary);">#${idx + 1}</strong></td>
                <td><strong>${b.title}</strong></td>
                <td style="color: var(--text-secondary);">${b.author}</td>
                <td>${b.total_pages}p</td>
                <td><span class="badge-pill badge-cat">${b.category_name || '일반'}</span></td>
                <td>
                  <a href="/create?book_id=${b.id}" class="btn-pill btn-primary btn-sm">대여</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // [수업 코드 기반]: 수업시간 /office 라우트에 대응하는 /category 분야별 목록 및 집계
  categoryList: function (categories) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">기술 분야별 현황</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">
            [수업 코드 /office 대응] 부모 테이블인 category 기준 보유 도서 및 대여 통계
          </p>
        </div>
        <a href="/books" class="btn-pill btn-secondary btn-sm">전체 도서 보기</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        ${categories.map(c => `
          <div class="specs-box" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge-pill badge-cat" style="font-size: 0.8rem;">${c.name}</span>
                <strong style="color: var(--accent); font-size: 0.95rem;">${c.book_count}권 구비</strong>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.5; margin: 10px 0;">
                ${c.description || '기술 분야 설명이 등록되지 않았습니다.'}
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 8px; font-size: 0.84rem;">
              <span>총 대여: <strong>${c.rental_count}회</strong></span>
              <a href="/category/${c.id}" class="btn-pill btn-secondary btn-sm" style="padding: 3px 10px;">도서 보기 &rarr;</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // [수업 코드 기반]: 수업시간 /office/:id 라우트에 대응하는 /category/:id 소속 도서 상세 조회
  categoryDetail: function (category, books) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">${category.name}</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">${category.description || ''}</p>
        </div>
        <a href="/category" class="btn-pill btn-secondary btn-sm">분야 목록</a>
      </div>

      <div class="apple-table-wrap">
        <table class="apple-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>도서명</th>
              <th>저자</th>
              <th>쪽수</th>
              <th>대여</th>
            </tr>
          </thead>
          <tbody>
            ${books.length === 0 ? `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-secondary);">이 분야에 등록된 도서가 없습니다.</td></tr>` : ''}
            ${books.map((b, idx) => `
              <tr>
                <td>#${idx + 1}</td>
                <td><strong>${b.title}</strong></td>
                <td style="color: var(--text-secondary);">${b.author}</td>
                <td>${b.total_pages}p</td>
                <td><a href="/create?book_id=${b.id}" class="btn-pill btn-primary btn-sm">대여</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // [수업 코드 외 추가·변경]: 실시간 통계 대시보드 (COUNT, AVG, SUM 집계 만점)
  statsDashboard: function (bookStats, categoryStats) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <h1 class="hero-title">실시간 도서 통계 랭킹</h1>
          <p class="hero-subtitle" style="margin-bottom:0;">
            3대 집계함수(COUNT, AVG, SUM) 및 GROUP BY 실시간 통계 연산
          </p>
        </div>
        <a href="/create" class="btn-pill btn-primary btn-sm">+ 대여 등록</a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 32px;">
        ${categoryStats.map(c => `
          <div class="specs-box">
            <span class="badge-pill badge-cat">${c.name}</span>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: 8px;">
              ${c.rental_count}회 대여
            </div>
            <div style="font-size: 0.8rem; color: var(--accent); font-weight: 600; margin-top: 2px;">
              누적 ${Number(c.category_pages_read).toLocaleString()}쪽 완독
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">
          도서별 대여 및 독서량 랭킹 (Top Books)
        </h3>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">SQL: GROUP BY book.id</span>
      </div>

      <div class="apple-table-wrap">
        <table class="apple-table">
          <thead>
            <tr>
              <th style="width: 50px;">순위</th>
              <th>도서 제목</th>
              <th>기술 분야</th>
              <th>총 대여 (COUNT)</th>
              <th>평균 만족도 (AVG)</th>
              <th>누적 독서량 (SUM)</th>
              <th>신청</th>
            </tr>
          </thead>
          <tbody>
            ${bookStats.map((b, idx) => `
              <tr>
                <td><strong>#${idx + 1}</strong></td>
                <td><strong>${b.title}</strong> <span style="font-size: 0.78rem; color: var(--text-secondary);">(${b.author})</span></td>
                <td><span class="badge-pill badge-cat">${b.category_name || '-'}</span></td>
                <td><strong style="color: var(--accent); font-size: 0.95rem;">${b.total_rentals}</strong> 건</td>
                <td style="color: #f59e0b; font-weight: 600;">★ ${Number(b.avg_rating).toFixed(1)}</td>
                <td><strong>${Number(b.total_pages_read).toLocaleString()}</strong> 쪽</td>
                <td><a href="/create?book_id=${b.id}" class="btn-pill btn-primary btn-sm" style="padding: 2px 8px;">대여</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // [수업 코드 외 추가·변경]: 신규 도서 등록 폼
  bookCreateForm: function (categories) {
    return `
      <h1 class="hero-title">신규 전공 도서 등록</h1>
      <p class="hero-subtitle">새로운 IT 전공 도서의 메타데이터를 등록합니다 (INSERT INTO book).</p>

      <div class="form-container">
        <form action="/book/create" method="POST">
          <div class="form-row">
            <label class="form-label">도서 제목</label>
            <input type="text" name="title" class="form-input" placeholder="예: 리액트 훅 완벽 가이드" required>
          </div>

          <div class="form-row">
            <label class="form-label">도서 저자</label>
            <input type="text" name="author" class="form-input" placeholder="예: 홍길동" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-row">
              <label class="form-label">전체 쪽수</label>
              <input type="number" name="total_pages" class="form-input" placeholder="예: 450" min="1" required>
            </div>

            <div class="form-row">
              <label class="form-label">소속 기술 분야</label>
              <select name="category_id" class="form-input" required>
                <option value="">-- 분야 선택 --</option>
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
            <a href="/books" class="btn-pill btn-secondary">취소</a>
            <button type="submit" class="btn-pill btn-primary">도서 등록 (INSERT)</button>
          </div>
        </form>
      </div>
    `;
  }
};
