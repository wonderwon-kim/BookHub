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
  <title>BookHub — IT Library & Study Hub</title>
  <style>
    /* -------------------------------------------------------------
       Apple Style Reference Tokens (Refero Styles Inspired)
       ------------------------------------------------------------- */
    :root {
      --bg-primary: #f5f5f7;
      --bg-surface: #ffffff;
      --bg-surface-secondary: #fafafc;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --text-tertiary: #a1a1a6;
      --accent: #0071e3;
      --accent-hover: #0077ed;
      --accent-subtle: #f0f7ff;
      --border-subtle: #e5e5e7;
      --border-strong: #d2d2d7;
      --system-green: #34c759;
      --system-green-subtle: #eafaf1;
      --system-orange: #ff9500;
      --system-orange-subtle: #fff6e8;
      --system-red: #ff3b30;
      --system-red-subtle: #fdedec;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --radius-pill: 980px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Pretendard", "Helvetica Neue", Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      letter-spacing: -0.015em;
    }

    /* Apple-style Frosted Glass Navigation Bar */
    .apple-nav {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 52px;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text-primary);
    }
    .nav-brand-logo {
      width: 26px;
      height: 26px;
      background: #000;
      color: #fff;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .nav-brand-text {
      font-size: 1.05rem;
      font-weight: 600;
      letter-spacing: -0.025em;
    }
    .nav-brand-pill {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: var(--radius-pill);
      background: var(--border-subtle);
      color: var(--text-secondary);
      letter-spacing: 0;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      list-style: none;
    }
    .nav-links a {
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 400;
      opacity: 0.8;
      transition: opacity 0.15s;
    }
    .nav-links a:hover {
      opacity: 1;
    }
    .nav-links a.active {
      opacity: 1;
      font-weight: 600;
      color: var(--accent);
    }

    /* Main Container with 2-Column Grid */
    .apple-layout {
      max-width: 1360px;
      width: 100%;
      margin: 32px auto;
      padding: 0 32px;
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 28px;
      flex: 1;
    }

    /* Sidebar (Apple Sidebar Navigation) */
    .apple-sidebar {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px 18px;
      height: fit-content;
      position: sticky;
      top: 84px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    }
    .sidebar-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
      margin-top: 18px;
      padding-left: 8px;
    }
    .sidebar-label:first-child { margin-top: 0; }

    .sidebar-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: background 0.15s ease;
      margin-bottom: 2px;
    }
    .sidebar-link:hover {
      background: var(--bg-primary);
    }
    .sidebar-link.active {
      background: var(--accent-subtle);
      color: var(--accent);
      font-weight: 600;
    }

    /* Modern List in Sidebar (수업 코드 ol 호환) */
    .sidebar-scroll-list {
      max-height: 240px;
      overflow-y: auto;
      margin-top: 4px;
    }
    .sidebar-scroll-list::-webkit-scrollbar { width: 3px; }
    .sidebar-scroll-list::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 3px; }
    .sidebar-ol { list-style: none; padding: 0; margin: 0; }
    .sidebar-ol li a {
      display: block;
      padding: 6px 10px;
      font-size: 0.82rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.15s;
    }
    .sidebar-ol li a:hover {
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    .sidebar-ol li a.selected {
      background: var(--accent-subtle);
      color: var(--accent);
      font-weight: 600;
    }

    /* Content Area */
    .apple-content {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 36px 40px;
      min-height: 640px;
      box-shadow: 0 2px 14px rgba(0, 0, 0, 0.02);
    }

    /* Typography & Headers */
    .hero-title {
      font-size: 1.85rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      line-height: 1.18;
      margin-bottom: 8px;
    }
    .hero-subtitle {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin-bottom: 28px;
    }

    /* Apple KPI Metrics Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .kpi-card {
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px 22px;
      transition: border-color 0.2s;
    }
    .kpi-card:hover {
      border-color: var(--border-strong);
    }
    .kpi-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .kpi-val {
      font-size: 2.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-top: 6px;
      letter-spacing: -0.03em;
    }
    .kpi-desc {
      font-size: 0.78rem;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    /* Apple Tables */
    .apple-table-wrap {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-top: 14px;
    }
    table.apple-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;
    }
    table.apple-table th {
      background: var(--bg-surface-secondary);
      color: var(--text-secondary);
      font-weight: 600;
      padding: 12px 18px;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--border-subtle);
    }
    table.apple-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-primary);
      vertical-align: middle;
    }
    table.apple-table tr:last-child td {
      border-bottom: none;
    }
    table.apple-table tr:hover td {
      background: #fafafc;
    }

    /* Apple Signature Pill Buttons */
    .btn-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 18px;
      border-radius: var(--radius-pill);
      font-size: 0.84rem;
      font-weight: 500;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      letter-spacing: -0.01em;
    }
    .btn-primary {
      background: var(--accent);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--accent-hover);
    }
    .btn-secondary {
      background: #e8e8ed;
      color: var(--text-primary);
    }
    .btn-secondary:hover {
      background: #dedee3;
    }
    .btn-danger {
      background: var(--system-red);
      color: #fff;
    }
    .btn-danger:hover {
      background: #e02d24;
    }
    .btn-sm {
      padding: 4px 12px;
      font-size: 0.78rem;
    }

    /* Apple Minimal Badges */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: var(--radius-pill);
      font-size: 0.74rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .badge-borrowed { background: var(--system-orange-subtle); color: #c05621; }
    .badge-returned { background: var(--system-green-subtle); color: #22543d; }
    .badge-overdue { background: var(--system-red-subtle); color: #9b2c2c; }
    .badge-cat { background: var(--accent-subtle); color: var(--accent); font-weight: 600; }

    /* Forms */
    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .form-row {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
    }
    textarea.form-input { min-height: 100px; resize: vertical; }

    /* Apple Tech Specs Card (3-Table JOIN View) */
    .specs-card {
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 36px;
      position: relative;
    }
    .specs-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
    }
    .specs-box {
      background: var(--bg-surface-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 22px;
    }
    .specs-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    /* Progress bar */
    .apple-progress-bg {
      width: 100%;
      height: 7px;
      background: #e8e8ed;
      border-radius: var(--radius-pill);
      overflow: hidden;
      margin-top: 6px;
    }
    .apple-progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: var(--radius-pill);
      transition: width 0.3s;
    }

    /* Empty state */
    .empty-box {
      text-align: center;
      padding: 48px 20px;
      color: var(--text-secondary);
    }
    .empty-icon { font-size: 2.2rem; margin-bottom: 12px; }
    .empty-title { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
    .empty-desc { font-size: 0.88rem; max-width: 400px; margin: 0 auto 20px auto; line-height: 1.5; }

    footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      padding: 24px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.78rem;
      margin-top: auto;
    }
  </style>
</head>
<body>
  <!-- Apple-Style Frosted Glass Header -->
  <header class="apple-nav">
    <a href="/" class="nav-brand">
      <div class="nav-brand-logo">B</div>
      <span class="nav-brand-text">BookHub</span>
      <span class="nav-brand-pill">IT Library System</span>
    </a>
    <ul class="nav-links">
      <li><a href="/" class="${activePath === '/' ? 'active' : ''}">홈 대시보드</a></li>
      <li><a href="/books" class="${activePath === '/books' ? 'active' : ''}">구비 도서</a></li>
      <li><a href="/category" class="${activePath === '/category' ? 'active' : ''}">기술 분야</a></li>
      <li><a href="/stats" class="${activePath === '/stats' ? 'active' : ''}">통계 랭킹</a></li>
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
    BookHub — Professional IT Library & Study Rental Management System &bull; Clean Architecture Database
  </footer>
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
        <strong style="color: var(--text-primary);"><br>
        <br>
        <br>
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
          <h1 class="hero-title">BookHub Library Overview</h1>
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
      <div style="margin-top: 10px;">
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
