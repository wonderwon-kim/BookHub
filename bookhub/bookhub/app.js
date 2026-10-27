
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const template = require('./template');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql2');

// MySQL 연결 설정 - 수업자료 방식
const db = mysql.createConnection({
  host: 'bookhub-davidbackhome1004-8836.e.aivencloud.com',
  user: 'avnadmin',
  password: 'YOUR_AIVEN_PASSWORD',
  database: 'bookhub',
  port: 22582,
  ssl: { rejectUnauthorized: false }
});

// DB 연결 확인
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.code || err.message);
    return;
  }

  console.log('MySQL 연결 성공!');
});

// 폼 데이터 수신
app.use(express.urlencoded({ extended: true }));

// 좌측 메뉴: 최근 대여 기록
function menu(id, callback) {
  const sql = `
    SELECT r.id, r.borrower, r.status, b.title
    FROM rental_log r
    JOIN book b ON r.book_id = b.id
    ORDER BY r.id DESC
    LIMIT 15
  `;

  db.query(sql, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }

    callback(template.menu(results, id));
  });
}

// 메인 페이지
app.get('/', (req, res) => {
  const kpiSql = `
    SELECT
      (SELECT COUNT(*) FROM book) AS totalBooks,
      (SELECT COUNT(*) FROM rental_log
       WHERE status = '대여 중') AS activeRentals,
      (SELECT COUNT(*) FROM rental_log
       WHERE status = '반납 완료') AS returnedRentals,
      (SELECT COALESCE(SUM(read_pages), 0)
       FROM rental_log) AS totalPagesRead
  `;

  const recentSql = `
    SELECT r.id, r.borrower, r.read_pages, r.status,
           r.rental_date, b.title, b.total_pages
    FROM rental_log r
    JOIN book b ON r.book_id = b.id
    ORDER BY r.id DESC
    LIMIT 5
  `;

  const topBooksSql = `
    SELECT b.id, b.title, c.name AS category_name,
           COUNT(r.id) AS rental_count,
           COALESCE(ROUND(AVG(r.rating), 1), 0.0) AS avg_rating
    FROM book b
    LEFT JOIN category c ON b.category_id = c.id
    LEFT JOIN rental_log r ON b.id = r.book_id
    GROUP BY b.id, b.title, c.name
    ORDER BY rental_count DESC, avg_rating DESC
    LIMIT 5
  `;

  db.query(kpiSql, (err, kpiRes) => {
    if (err) return res.status(500).send('데이터베이스 조회 오류');

    db.query(recentSql, (err, recentRes) => {
      if (err) return res.status(500).send('데이터베이스 조회 오류');

      db.query(topBooksSql, (err, topRes) => {
        if (err) return res.status(500).send('데이터베이스 조회 오류');

        const kpi = kpiRes[0] || {
          totalBooks: 0,
          activeRentals: 0,
          returnedRentals: 0,
          totalPagesRead: 0
        };

        menu(null, (menuHtml) => {
          res.send(
            template.html(
              menuHtml,
              template.home(kpi, recentRes, topRes),
              '/'
            )
          );
        });
      });
    });
  });
});

// 대여 등록 페이지
app.get('/create', (req, res) => {
  const preselectedBookId = req.query.book_id || null;

  const sql = `
    SELECT b.id, b.title, b.author, b.total_pages,
           c.name AS category_name
    FROM book b
    LEFT JOIN category c ON b.category_id = c.id
    ORDER BY b.title ASC
  `;

  db.query(sql, (err, books) => {
    if (err) return res.status(500).send('도서 조회 오류');

    menu(null, (menuHtml) => {
      res.send(
        template.html(
          menuHtml,
          template.create(books, preselectedBookId),
          '/create'
        )
      );
    });
  });
});

// 대여 등록 처리
app.post('/create', (req, res) => {
  const borrower = sanitizeHtml(req.body.borrower || '');
  const book_id = Number(req.body.book_id);
  const rental_days = Number(req.body.rental_days) || 7;
  const read_pages = Number(req.body.read_pages) || 0;
  const status = req.body.status || '대여 중';
  const review = sanitizeHtml(req.body.review || '');

  const sql = `
    INSERT INTO rental_log
      (borrower, book_id, rental_days, read_pages,
       rating, status, review, rental_date)
    VALUES (?, ?, ?, ?, 5.0, ?, ?, NOW())
  `;

  db.query(
    sql,
    [borrower, book_id, rental_days, read_pages, status, review],
    (err, results) => {
      if (err) return res.status(500).send('대여 등록 오류');
      res.redirect(`/${results.insertId}`);
    }
  );
});

// 대여 수정 페이지
app.get('/update/:id', (req, res) => {
  const id = Number(req.params.id);

  const sql = `
    SELECT r.*, b.title, b.total_pages
    FROM rental_log r
    JOIN book b ON r.book_id = b.id
    WHERE r.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send('대여 조회 오류');
    if (results.length === 0) {
      return res.status(404).send('404 Not Found');
    }

    const rental = results[0];

    const booksSql = `
      SELECT b.id, b.title, b.author,
             c.name AS category_name
      FROM book b
      LEFT JOIN category c ON b.category_id = c.id
      ORDER BY b.title ASC
    `;

    db.query(booksSql, (err, books) => {
      if (err) return res.status(500).send('도서 조회 오류');

      menu(null, (menuHtml) => {
        res.send(
          template.html(
            menuHtml,
            template.update(rental, books),
            `/update/${id}`
          )
        );
      });
    });
  });
});

// 대여 수정 처리
app.post('/update', (req, res) => {
  const id = Number(req.body.id);
  const borrower = sanitizeHtml(req.body.borrower || '');
  const book_id = Number(req.body.book_id);
  const status = sanitizeHtml(req.body.status || '');
  const read_pages = Number(req.body.read_pages);
  const rating = parseFloat(req.body.rating);
  const rental_days = Number(req.body.rental_days);
  const review = sanitizeHtml(req.body.review || '');

  const sql = `
    UPDATE rental_log
    SET borrower = ?, book_id = ?, status = ?,
        read_pages = ?, rating = ?, rental_days = ?, review = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      borrower, book_id, status, read_pages,
      rating, rental_days, review, id
    ],
    (err) => {
      if (err) return res.status(500).send('대여 수정 오류');
      res.redirect(`/${id}`);
    }
  );
});

// 대여 삭제 확인 페이지
app.get('/delete/:id', (req, res) => {
  const id = Number(req.params.id);

  const sql = `
    SELECT r.id, r.borrower, r.rental_date, b.title
    FROM rental_log r
    JOIN book b ON r.book_id = b.id
    WHERE r.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send('대여 조회 오류');
    if (results.length === 0) {
      return res.status(404).send('404 Not Found');
    }

    menu(id, (menuHtml) => {
      res.send(
        template.html(
          menuHtml,
          template.delete(results[0]),
          `/delete/${id}`
        )
      );
    });
  });
});

// 대여 삭제 처리
app.post('/delete', (req, res) => {
  const id = Number(req.body.id);

  db.query(
    'DELETE FROM rental_log WHERE id = ?',
    [id],
    (err) => {
      if (err) return res.status(500).send('대여 삭제 오류');
      res.redirect('/');
    }
  );
});

// 분야별 카테고리 목록
const categoryHandler = (req, res) => {
  const sql = `
    SELECT c.id, c.name, c.description,
           COUNT(DISTINCT b.id) AS book_count,
           COUNT(r.id) AS rental_count
    FROM category c
    LEFT JOIN book b ON c.id = b.category_id
    LEFT JOIN rental_log r ON b.id = r.book_id
    GROUP BY c.id, c.name, c.description
    ORDER BY c.id ASC
  `;

  db.query(sql, (err, categories) => {
    if (err) return res.status(500).send('카테고리 조회 오류');

    menu(null, (menuHtml) => {
      res.send(
        template.html(
          menuHtml,
          template.categoryList(categories),
          '/category'
        )
      );
    });
  });
};

app.get('/category', categoryHandler);
app.get('/office', categoryHandler);

// 카테고리 상세
const categoryDetailHandler = (req, res) => {
  const id = Number(req.params.id);

  db.query('SELECT * FROM category WHERE id = ?', [id], (err, catRes) => {
    if (err) return res.status(500).send('카테고리 조회 오류');
    if (catRes.length === 0) {
      return res.status(404).send('404 Not Found');
    }

    const category = catRes[0];

    db.query(
      'SELECT * FROM book WHERE category_id = ? ORDER BY id ASC',
      [id],
      (err, books) => {
        if (err) return res.status(500).send('도서 조회 오류');

        menu(null, (menuHtml) => {
          res.send(
            template.html(
              menuHtml,
              template.categoryDetail(category, books),
              `/category/${id}`
            )
          );
        });
      }
    );
  });
};

app.get('/category/:id', categoryDetailHandler);
app.get('/office/:id', categoryDetailHandler);

// 통계 대시보드
app.get('/stats', (req, res) => {
  const bookStatsSql = `
    SELECT b.id, b.title, b.author, b.total_pages,
           c.name AS category_name,
           COUNT(r.id) AS total_rentals,
           COALESCE(ROUND(AVG(r.rating), 1), 0.0) AS avg_rating,
           COALESCE(SUM(r.read_pages), 0) AS total_pages_read
    FROM book b
    LEFT JOIN category c ON b.category_id = c.id
    LEFT JOIN rental_log r ON b.id = r.book_id
    GROUP BY b.id, b.title, b.author, b.total_pages, c.name
    ORDER BY total_rentals DESC, avg_rating DESC
    LIMIT 20
  `;

  const catStatsSql = `
    SELECT c.id, c.name, c.description,
           COUNT(DISTINCT b.id) AS book_count,
           COUNT(r.id) AS rental_count,
           COALESCE(SUM(r.read_pages), 0) AS category_pages_read
    FROM category c
    LEFT JOIN book b ON c.id = b.category_id
    LEFT JOIN rental_log r ON b.id = r.book_id
    GROUP BY c.id, c.name, c.description
    ORDER BY rental_count DESC, book_count DESC
  `;

  db.query(bookStatsSql, (err, bookStats) => {
    if (err) return res.status(500).send('통계 조회 오류');

    db.query(catStatsSql, (err, catStats) => {
      if (err) return res.status(500).send('통계 조회 오류');

      menu(null, (menuHtml) => {
        res.send(
          template.html(
            menuHtml,
            template.statsDashboard(bookStats, catStats),
            '/stats'
          )
        );
      });
    });
  });
});

// 도서 검색 및 필터
app.get('/books', (req, res) => {
  const categoryId = req.query.category
    ? Number(req.query.category)
    : null;

  const keyword = req.query.search
    ? sanitizeHtml(req.query.search).trim()
    : null;

  let sql = `
    SELECT b.id, b.title, b.author, b.total_pages,
           b.category_id, c.name AS category_name
    FROM book b
    LEFT JOIN category c ON b.category_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (categoryId) {
    sql += ' AND b.category_id = ?';
    params.push(categoryId);
  }

  if (keyword) {
    sql += ' AND (b.title LIKE ? OR b.author LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  sql += ' ORDER BY b.id ASC';

  db.query(sql, params, (err, books) => {
    if (err) return res.status(500).send('도서 조회 오류');

    db.query(
      'SELECT id, name FROM category ORDER BY id ASC',
      (err, categories) => {
        if (err) return res.status(500).send('카테고리 조회 오류');

        menu(null, (menuHtml) => {
          res.send(
            template.html(
              menuHtml,
              template.bookList(
                books,
                categories,
                categoryId,
                keyword
              ),
              '/books'
            )
          );
        });
      }
    );
  });
});

// 도서 등록 페이지
app.get('/book/create', (req, res) => {
  db.query(
    'SELECT id, name FROM category ORDER BY id ASC',
    (err, categories) => {
      if (err) return res.status(500).send('카테고리 조회 오류');

      menu(null, (menuHtml) => {
        res.send(
          template.html(
            menuHtml,
            template.bookCreateForm(categories),
            '/book/create'
          )
        );
      });
    }
  );
});

// 도서 등록 처리
app.post('/book/create', (req, res) => {
  const title = sanitizeHtml(req.body.title || '');
  const author = sanitizeHtml(req.body.author || '');
  const total_pages = Number(req.body.total_pages);
  const category_id = req.body.category_id
    ? Number(req.body.category_id)
    : null;

  const sql = `
    INSERT INTO book (title, author, total_pages, category_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, author, total_pages, category_id],
    (err) => {
      if (err) return res.status(500).send('도서 등록 오류');
      res.redirect('/books');
    }
  );
});

// 대여 상세 조회
app.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(404).send('404 Not Found');
  }

  const sql = `
    SELECT r.id, r.borrower, r.book_id, r.rental_days,
           r.read_pages, r.rating, r.status, r.review,
           r.rental_date, b.title, b.author, b.total_pages,
           c.name AS category_name,
           c.description AS category_description
    FROM rental_log r
    JOIN book b ON r.book_id = b.id
    LEFT JOIN category c ON b.category_id = c.id
    WHERE r.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send('대여 상세 조회 오류');
    if (results.length === 0) {
      return res.status(404).send('404 Not Found');
    }

    const rental = results[0];

    menu(id, (menuHtml) => {
      res.send(
        template.html(
          menuHtml,
          template.read(rental),
          `/${id}`
        )
      );
    });
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`BookHub 서버가 포트 ${port}에서 실행 중입니다.`);
});
