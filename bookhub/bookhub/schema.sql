-- [생성형 AI 활용] 기획서 5장(DB 설계)을 바탕으로 Claude가 초안 작성
-- 실행: mysql -u root -p --default-character-set=utf8mb4 < schema.sql

SET NAMES utf8mb4; -- [추가 학습/변경] 한글이 깨지지 않도록 접속 문자셋 지정

CREATE DATABASE IF NOT EXISTS bookhub
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE bookhub;

DROP TABLE IF EXISTS rental_log;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS category;

-- 1) 부모 테이블: 도서 기술 분야
CREATE TABLE category (
  id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL,
  description VARCHAR(255) NULL
) AUTO_INCREMENT = 1;

-- 2) 도서 메타데이터 (category 1 : N book)
CREATE TABLE book (
  id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  author      VARCHAR(50)  NOT NULL,
  total_pages INT          NOT NULL,
  category_id INT          NULL,
  FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE SET NULL
) AUTO_INCREMENT = 101;

-- 3) 대여 이력 (book 1 : N rental_log) ← CRUD 대상
-- [추가 학습/변경] 기획서에는 read_pages/rating이 NOT NULL이라, '대여 중'일 때를 위해 DEFAULT 0 지정
CREATE TABLE rental_log (
  id          INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  borrower    VARCHAR(30)  NOT NULL,
  book_id     INT          NOT NULL,
  rental_days INT          NOT NULL DEFAULT 7,
  read_pages  INT          NOT NULL DEFAULT 0,
  rating      DECIMAL(3,1) NOT NULL DEFAULT 0.0,   -- 0.0 = 아직 평가 안 함
  status      VARCHAR(20)  NOT NULL DEFAULT '대여 중',  -- 대여 중 / 반납 완료 / 연체
  review      TEXT         NULL,
  rental_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES book (id)
) AUTO_INCREMENT = 1001;

-- ---------- 샘플 DATA (페이지 수 등은 임의의 샘플값) ----------
INSERT INTO category (name, description) VALUES
  ('컴퓨터/IT',  '프로그래밍 언어, 웹 개발, DB 전문 서적'),
  ('웹 개발',    'HTML/CSS/JavaScript, Node.js 등 웹 프로그래밍 서적'),
  ('알고리즘',   '자료구조, 코딩 테스트 대비 서적');

INSERT INTO book (title, author, total_pages, category_id) VALUES
  ('이것이 MySQL이다',               '우재남', 580,  1),
  ('Do it! 점프 투 파이썬',          '박응용', 360,  1),
  ('모던 자바스크립트 Deep Dive',    '이웅모', 1100, 2),
  ('Node.js 교과서',                 '조현영', 640,  2),
  ('이것이 취업을 위한 코딩 테스트다', '나동빈', 760,  3);

INSERT INTO rental_log (borrower, book_id, rental_days, read_pages, rating, status, review, rental_date) VALUES
  ('김선린', 101, 7,  320, 5.0, '반납 완료', '실습 중심이라 쿼리 작성을 이해하는 데 큰 도움이 됨', '2026-09-29 14:20:00'),
  ('박코딩', 103, 14, 150, 4.5, '반납 완료', '개념 설명이 자세하지만 분량이 많아 시간이 걸림',     '2026-09-30 10:05:00'),
  ('이웹개', 104, 7,  0,   0.0, '대여 중',   NULL,                                                '2026-10-02 16:40:00'),
  ('최알고', 105, 7,  210, 4.0, '반납 완료', '코테 유형별 정리가 좋았음',                           '2026-10-01 09:30:00'),
  ('정디비', 101, 7,  90,  3.5, '연체',      '아직 절반도 못 읽음',                                 '2026-09-25 13:00:00');
