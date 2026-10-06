// [생성형 AI 활용] 기획서(1차시)를 바탕으로 Claude가 전체 초안 작성
// BookHub: IT 도서 분류 및 스터디 대여 관리 시스템
const express = require('express');
const db = require('./db');
const { esc, layout } = require('./template');

const app = express();
app.use(express.urlencoded({ extended: false })); // <form method="post"> 데이터 읽기

const STATUSES = ['대여 중', '반납 완료', '연체'];

// ---------- 공통 함수 ----------

// 도서 선택 드롭다운 + 검증에 쓰는 도서 목록 (book LEFT JOIN category)
async function getBooks() {
  const [rows] = await db.query(
    `SELECT b.id, b.title, b.author, b.total_pages, c.name AS category_name
       FROM book b LEFT JOIN category c ON b.category_id = c.id
      ORDER BY b.title`
  );
  return rows;
}

// 폼 값 읽기 + 검증. full=true 이면 수정 화면(읽은 페이지/평점/상태/한줄평 포함)
function readForm(body, full) {
  const v = {
    id: Number(body.id),
    borrower: String(body.borrower ?? '').trim(),
    book_id: Number(body.book_id),
    rental_days: Number(body.rental_days),
    read_pages: full ? Number(body.read_pages) : 0,
    rating: full ? Number(body.rating) : 0,
    status: full ? String(body.status ?? '') : '대여 중',
    review: full ? String(body.review ?? '').trim() : '',
  };
  const errors = [];
  if (!v.borrower || v.borrower.length > 30) errors.push('대여자 이름은 1~30자로 입력하세요.');
  if (!Number.isInteger(v.book_id)) errors.push('도서를 선택하세요.');
  if (!Number.isInteger(v.rental_days) || v.rental_days < 1 || v.rental_days > 30)
    errors.push('대여 기간은 1~30일 사이로 입력하세요.');
  if (full) {
    if (!STATUSES.includes(v.status)) errors.push('대여 상태가 올바르지 않습니다.');
    if (!Number.isInteger(v.read_pages) || v.read_pages < 0) errors.push('읽은 페이지 수는 0 이상의 정수입니다.');
    if (!(v.rating === 0 || (v.rating >= 1 && v.rating <= 5))) errors.push('평점은 1.0~5.0 사이로 입력하세요. (0은 미평가)');
    if (v.status === '반납 완료' && v.rating === 0) errors.push('반납 완료 처리 시에는 평점을 입력해 주세요.');
    if (v.review.length > 500) errors.push('한줄평은 500자 이내로 작성하세요.');
  }
  return { v, errors };
}

// 등록/수정 공용 폼 화면
function formPage({ heading, action, v, books, errors = [], full = false }) {
  const options = books
    .map((b) => {
      const label = `${b.title} (${b.author}${b.category_name ? ' · ' + b.category_name : ''})`;
      return `<option value="${b.id}"${Number(v.book_id) === b.id ? ' selected' : ''}>${esc(label)}</option>`;
    })
    .join('');
  const errorBox = errors.length ? `<ul class="error">${errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : '';
  const feedback = full
    ? `<label>대여 상태
         <select name="status">${STATUSES.map((s) => `<option${v.status === s ? ' selected' : ''}>${s}</option>`).join('')}</select></label>
       <label>실제 읽은 페이지 수<input type="number" name="read_pages" min="0" value="${esc(v.read_pages)}"></label>
       <label>만족도 평점 (1.0~5.0, 0 = 미평가)
         <input type="number" name="rating" min="0" max="5" step="0.5" value="${esc(v.rating)}"></label>
       <label>독서 한줄평<textarea name="review" rows="3" maxlength="500">${esc(v.review)}</textarea></label>`
    : '';
  return layout(
    heading,
    `<div class="card"><h2>${heading}</h2>${errorBox}
     <form method="post" action="${action}">
       ${full ? `<input type="hidden" name="id" value="${esc(v.id)}">` : ''}
       <label>대여자 이름<input name="borrower" maxlength="30" required value="${esc(v.borrower)}"></label>
       <label>도서 선택<select name="book_id">${options}</select></label>
       <label>대여 기간(일)<input type="number" name="rental_days" min="1" max="30" required value="${esc(v.rental_days)}"></label>
       ${feedback}
       <button class="btn" type="submit">${full ? '저장' : '대여 등록'}</button>
       <a class="btn gray" href="/">취소</a>
     </form></div>`
  );
}

// ---------- 1) 메인 목록 (SELECT / WHERE / LIKE / ORDER BY) ----------
app.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  let sql = `SELECT l.id, l.borrower, l.rental_days, l.status, l.rental_date,
                    b.title, c.name AS category_name
               FROM rental_log l
               JOIN book b ON l.book_id = b.id
               LEFT JOIN category c ON b.category_id = c.id`;
  const params = [];
  if (q) {
    // [추가 학습/변경] 기획서의 LIKE 활용 계획: 대여자 이름 또는 도서 제목 검색
    sql += ' WHERE l.borrower LIKE ? OR b.title LIKE ?';
    const like = `%${q.replace(/[\\%_]/g, '\\$&')}%`; // 사용자가 입력한 % _ 는 일반 문자로 취급
    params.push(like, like);
  }
  sql += ' ORDER BY l.id DESC'; // 최신 등록순
  const [rows] = await db.execute(sql, params);

  const trs = rows
    .map(
      (r) => `<tr>
        <td>${r.id}</td><td>${esc(r.borrower)}</td>
        <td><a href="/rental/${r.id}">${esc(r.title)}</a></td>
        <td>${esc(r.category_name ?? '-')}</td><td>${r.rental_days}일</td>
        <td><span class="tag">${esc(r.status)}</span></td><td>${esc(r.rental_date)}</td></tr>`
    )
    .join('');
  res.send(
    layout(
      '대여 목록',
      `<h2>도서 대여 목록</h2>
       <form class="row" method="get" action="/">
         <input name="q" placeholder="대여자 또는 도서 제목 검색" value="${esc(q)}">
         <button class="btn" type="submit">검색</button><a class="btn" href="/rental/create">+ 신규 대여</a>
       </form>
       <table><tr><th>번호</th><th>대여자</th><th>도서</th><th>분야</th><th>기간</th><th>상태</th><th>대여 일시</th></tr>
       ${trs || '<tr><td colspan="7">대여 기록이 없습니다.</td></tr>'}</table>`
    )
  );
});

// ---------- 2) 신규 대여 등록 (INSERT) ----------
app.get('/rental/create', async (req, res) => {
  const books = await getBooks();
  res.send(
    formPage({
      heading: '신규 도서 대여 등록',
      action: '/rental/create_process',
      v: { borrower: '', book_id: books[0]?.id, rental_days: 7 },
      books,
    })
  );
});

app.post('/rental/create_process', async (req, res) => {
  const { v, errors } = readForm(req.body, false);
  const books = await getBooks();
  if (!books.some((b) => b.id === v.book_id)) errors.push('존재하지 않는 도서입니다.');
  if (errors.length) {
    return res.status(400).send(formPage({ heading: '신규 도서 대여 등록', action: '/rental/create_process', v, books, errors }));
  }
  const [result] = await db.execute(
    `INSERT INTO rental_log (borrower, book_id, rental_days, status) VALUES (?, ?, ?, '대여 중')`,
    [v.borrower, v.book_id, v.rental_days]
  );
  res.redirect(`/rental/${result.insertId}`); // 등록 후 해당 기록의 상세 페이지로 이동
});

// ---------- 3) 대여 상세 조회 (3개 테이블 JOIN) ----------
// ※ '/rental/create' 보다 뒤에 둬야 'create'가 :id로 잡히지 않습니다.
app.get('/rental/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return next();
  const [rows] = await db.execute(
    `SELECT r.*, b.title, b.author, b.total_pages,
            c.name AS category_name, c.description AS category_description
       FROM rental_log r
       JOIN book b ON r.book_id = b.id
       LEFT JOIN category c ON b.category_id = c.id
      WHERE r.id = ?`,
    [id]
  );
  if (!rows.length) return next();
  const r = rows[0];
  const percent = Math.min(100, Math.round((r.read_pages / r.total_pages) * 100));
  res.send(
    layout(
      '대여 상세',
      `<div class="card"><h2>📖 대여 영수증 #${r.id}</h2>
       <p><b>대여자</b> ${esc(r.borrower)} &nbsp; <span class="tag">${esc(r.status)}</span></p>
       <p><b>대여 일시</b> ${esc(r.rental_date)} (${r.rental_days}일 대여)</p>
       <hr>
       <p><b>도서</b> ${esc(r.title)} / ${esc(r.author)} (전체 ${r.total_pages}쪽)</p>
       <p><b>기술 분야</b> ${esc(r.category_name ?? '미분류')} ${r.category_description ? '— ' + esc(r.category_description) : ''}</p>
       <hr>
       <p><b>독서 진도</b> ${r.read_pages} / ${r.total_pages}쪽 (${percent}%)</p>
       <div class="bar"><div style="width:${percent}%"></div></div>
       <p><b>평점</b> ${Number(r.rating) > 0 ? '⭐ ' + esc(r.rating) : '미평가'}</p>
       <p><b>한줄평</b> ${esc(r.review ?? '-')}</p>
       <div class="row">
         <a class="btn" href="/rental/${r.id}/update">반납 처리 / 수정</a>
         <form method="post" action="/rental/delete_process" onsubmit="return confirm('정말 영구 삭제할까요?')">
           <input type="hidden" name="id" value="${r.id}"><button class="btn danger" type="submit">영구 삭제</button>
         </form>
         <a class="btn gray" href="/">목록</a>
       </div></div>`
    )
  );
});

// ---------- 4) 반납 처리 / 독서 피드백 수정 (UPDATE) ----------
app.get('/rental/:id/update', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return next();
  const [rows] = await db.execute('SELECT * FROM rental_log WHERE id = ?', [id]);
  if (!rows.length) return next();
  res.send(formPage({ heading: `대여 #${id} 반납 처리 / 수정`, action: '/rental/update_process', v: rows[0], books: await getBooks(), full: true }));
});

app.post('/rental/update_process', async (req, res, next) => {
  const { v, errors } = readForm(req.body, true);
  if (!Number.isInteger(v.id)) return next();
  const books = await getBooks();
  const book = books.find((b) => b.id === v.book_id);
  if (!book) errors.push('존재하지 않는 도서입니다.');
  // [추가 학습/변경] 읽은 페이지 수가 책의 전체 페이지를 넘지 않도록 검증
  else if (v.read_pages > book.total_pages) errors.push(`읽은 페이지 수는 전체 ${book.total_pages}쪽을 넘을 수 없습니다.`);
  if (errors.length) {
    return res.status(400).send(formPage({ heading: `대여 #${v.id} 반납 처리 / 수정`, action: '/rental/update_process', v, books, errors, full: true }));
  }
  const [result] = await db.execute(
    `UPDATE rental_log
        SET borrower = ?, book_id = ?, rental_days = ?, read_pages = ?, rating = ?, status = ?, review = ?
      WHERE id = ?`,
    [v.borrower, v.book_id, v.rental_days, v.read_pages, v.rating, v.status, v.review || null, v.id]
  );
  if (!result.affectedRows) return next();
  res.redirect(`/rental/${v.id}`); // 갱신된 상세 화면
});

// ---------- 5) 대여 기록 삭제 (DELETE) ----------
app.post('/rental/delete_process', async (req, res, next) => {
  const id = Number(req.body.id);
  if (!Number.isInteger(id)) return next();
  await db.execute('DELETE FROM rental_log WHERE id = ?', [id]);
  res.redirect('/');
});

// ---------- 6) 도서 이용 통계 (GROUP BY + COUNT / AVG / SUM) ----------
app.get('/stats', async (req, res) => {
  // [추가 학습/변경] 평점 0(미평가)은 평균에서 제외하려고 AVG(NULLIF(r.rating, 0)) 사용
  const [rows] = await db.query(
    `SELECT b.id, b.title, c.name AS category_name,
            COUNT(r.id) AS total_rentals,
            COALESCE(ROUND(AVG(NULLIF(r.rating, 0)), 1), 0.0) AS avg_rating,
            COALESCE(SUM(r.read_pages), 0) AS total_pages_read
       FROM book b
       LEFT JOIN category c ON b.category_id = c.id
       LEFT JOIN rental_log r ON b.id = r.book_id
      GROUP BY b.id, b.title, c.name
      ORDER BY total_rentals DESC, avg_rating DESC`
  );
  const trs = rows
    .map(
      (r, i) => `<tr><td>${i + 1}</td><td>${esc(r.title)}</td><td>${esc(r.category_name ?? '-')}</td>
        <td class="num">${r.total_rentals}</td><td class="num">${Number(r.avg_rating) > 0 ? esc(r.avg_rating) : '-'}</td>
        <td class="num">${esc(r.total_pages_read)}</td></tr>`
    )
    .join('');
  res.send(
    layout(
      '도서 이용 통계',
      `<h2>📊 도서 이용 통계</h2>
       <table><tr><th>순위</th><th>도서명</th><th>분야</th><th class="num">대여 횟수</th><th class="num">평균 평점</th><th class="num">누적 독서 쪽수</th></tr>
       ${trs}</table>`
    )
  );
});

// ---------- 404 / 오류 처리 ----------
app.use((req, res) => res.status(404).send(layout('404', '<div class="card"><h2>페이지를 찾을 수 없습니다.</h2><a class="btn" href="/">목록으로</a></div>')));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(layout('오류', '<div class="card"><h2>서버 오류가 발생했습니다.</h2></div>'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BookHub 실행 중: http://localhost:${PORT}`));
