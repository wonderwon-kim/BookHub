// [수업 코드 기반] + [추가 학습/변경]: MySQL BookHub DB 초기화 및 205권 실전 IT 도서 적재
// [사용자 요구사항 반영]: mock 대여 데이터 완전 제거 (순수 스크래핑 도서만 구축), 개인정보 제외

const mysql = require('mysql2/promise');
const fs = require('fs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  port: Number(process.env.DB_PORT) || 3306
};

async function initDB() {
  console.log('>>> [1/3] MySQL 서버 접속 시도 중...');
  const conn = await mysql.createConnection(dbConfig);
  console.log('✔ MySQL 접속 성공!');

  try {
    console.log('>>> [2/3] bookhub 데이터베이스 및 3개 정규화 테이블 생성 중...');
    await conn.query(`CREATE DATABASE IF NOT EXISTS bookhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.query(`USE bookhub;`);

    // 테이블 초기화 (자식 -> 부모 순)
    await conn.query(`DROP TABLE IF EXISTS rental_log;`);
    await conn.query(`DROP TABLE IF EXISTS book;`);
    await conn.query(`DROP TABLE IF EXISTS category;`);

    // 1. 카테고리 테이블
    await conn.query(`
      CREATE TABLE category (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '분류 고유 번호',
        name VARCHAR(50) NOT NULL COMMENT '도서 기술 분야 명칭',
        description VARCHAR(255) NULL COMMENT '기술 분야 설명'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. 도서 메타데이터 테이블
    await conn.query(`
      CREATE TABLE book (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '도서 고유 번호',
        title VARCHAR(120) NOT NULL COMMENT '도서 제목',
        author VARCHAR(60) NOT NULL COMMENT '도서 저자',
        total_pages INT NOT NULL COMMENT '도서의 전체 페이지 수',
        category_id INT NULL COMMENT '소속 분야 번호 (category.id 참조)',
        CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. 대여 및 독서기록 테이블 (mock 데이터 없이 순수 빈 테이블로 생성)
    await conn.query(`
      CREATE TABLE rental_log (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT '대여 기록 고유 번호',
        borrower VARCHAR(30) NOT NULL COMMENT '대여자 이름',
        book_id INT NOT NULL COMMENT '대여한 도서 번호 (book.id 참조)',
        rental_days INT NOT NULL DEFAULT 7 COMMENT '대여 기간 (일수)',
        read_pages INT NOT NULL DEFAULT 0 COMMENT '실제 읽은 페이지 수',
        rating DECIMAL(3,1) NOT NULL DEFAULT 5.0 COMMENT '만족도 평점 (1.0~5.0)',
        status VARCHAR(20) NOT NULL DEFAULT '대여 중' COMMENT '대여 상태 (대여 중 / 반납 완료 / 연체)',
        review TEXT NULL COMMENT '독서 한줄평 및 소감',
        rental_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '대여 등록 일시',
        CONSTRAINT fk_rental_book FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('>>> [3/3] 대량 스크래핑 도서(205권) 데이터 적재 중 (mock 대여 데이터 제외)...');
    const jsonPath = 'C:/Users/Sunrin/.gemini/antigravity/scratch/large_books.json';
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 카테고리 적재
    for (const c of data.categories) {
      await conn.query(
        `INSERT INTO category (id, name, description) VALUES (?, ?, ?)`,
        [c.id, c.name, c.description]
      );
    }

    // 도서 적재
    const seen = new Set();
    let bookCount = 0;
    for (const b of data.books) {
      const cleanTitle = b.title.trim();
      if (seen.has(cleanTitle)) continue;
      seen.add(cleanTitle);

      await conn.query(
        `INSERT INTO book (title, author, total_pages, category_id) VALUES (?, ?, ?, ?)`,
        [cleanTitle, b.author.trim() || 'IT 전문 출판부', b.total_pages || 350, b.category_id]
      );
      bookCount++;
    }

    console.log(`✔ 카테고리 ${data.categories.length}개 및 실전 IT 전공 도서 ${bookCount}권 적재 완료!`);
    console.log(`✔ rental_log 테이블: mock 데이터 없이 깨끗하게 초기화 완료 (0건).`);
  } finally {
    await conn.end();
  }
}

initDB();
