# 📖 BookHub — IT Library & Study Rental System

> **전공 도서 탐색·대여 기록·독서 진도를 관리하는 풀스택 웹 애플리케이션**  
> 196권의 IT 전공 도서 메타데이터와 3개 테이블 정규화 구조 기반 CRUD 및 통계 시스템

---

## 🌟 프로젝트 개요

**BookHub**는 웹 개발, 데이터베이스, 알고리즘, 인공지능, 네트워크, 컴퓨터 구조 등 IT 전공 도서를 체계적으로 분류하고, 대여 이력과 독서 진도를 한곳에서 관리하는 관계형 데이터베이스(RDBMS) 연동 웹 서비스입니다.

- **UI 방향**: 따뜻한 크림 캔버스, 코랄 액션, 세리프 디스플레이 타이포그래피, 짙은 제품 표면을 조합한 에디토리얼 인터페이스
- **핵심 기술 스택**: Node.js, Express, MySQL 8.0, HTML5/CSS3, Python Web Scraping

## 🎨 UI 구성

- **색상**: 캔버스 `#faf9f5`, 크림 카드 `#efe9de`, 잉크 `#141413`, 코랄 액션 `#cc785c`, 다크 표면 `#181715`
- **타이포그래피**: 디스플레이 제목은 세리프 계열, 본문과 UI는 Inter 계열 폰트 사용
- **공통 구성요소**: 상단 내비게이션, 빠른 작업 사이드바, 상태 배지, 테이블, 검색·필터 폼, 독서 진도 표시
- **화면 대응**: 데스크톱·태블릿·모바일 레이아웃과 전체 화면 모바일 메뉴 지원

---

## 🏗️ 데이터베이스 아키텍처 (3개 테이블 정규화)

3개의 독립된 테이블을 외래키(FK)로 연결하여 데이터 중복을 제거하고 데이터 무결성을 보장합니다.

```
┌─────────────────────────┐
│     category (부모)      │
├─────────────────────────┤
│ id (PK)                 │
│ name (분야명)            │
│ description (분야설명)    │
└────────────┬────────────┘
             │ 1:N
             ▼
┌─────────────────────────┐
│       book (도서)       │
├─────────────────────────┤
│ id (PK)                 │
│ title (도서명)           │
│ author (저자)           │
│ total_pages (전체쪽수)   │
│ category_id (FK)        │
└────────────┬────────────┘
             │ 1:N
             ▼
┌─────────────────────────┐
│    rental_log (자식)    │
├─────────────────────────┤
│ id (PK)                 │
│ borrower (대여자 성명)   │
│ book_id (FK)            │
│ rental_days (대여기간)   │
│ read_pages (읽은쪽수)    │
│ rating (만족도 평점)     │
│ status (대여상태)        │
│ review (독서 한줄평)     │
│ rental_date (대여일시)   │
└─────────────────────────┘
```

---

## ⚡ 주요 기능 및 SQL 명세

### 1. 신규 대여 등록 (Create)
- 사용자가 원하는 IT 도서를 선택하고 대여 기간을 설정하여 등록
- `INSERT INTO rental_log (borrower, book_id, rental_days, read_pages, rating, status, review, rental_date) VALUES (?, ?, ?, ?, 5.0, ?, ?, NOW());`

### 2. [만점 핵심] 3개 테이블 다중 JOIN 상세 조회 (Read)
- `rental_log`, `book`, `category` 3개 테이블을 한 번의 쿼리로 결합하여 대여 학생, 도서 상세 스펙, 기술 분야 설명이 통합된 어두운 에디토리얼 대여 증서 스타일 대여 증서 렌더링
- 실제 읽은 페이지 수 대비 전체 분량에 따른 **완독 진도율(%) 프로그레스 바** 실시간 계산
```sql
SELECT 
  r.id, r.borrower, r.book_id, r.rental_days, r.read_pages, r.rating, r.status, r.review, r.rental_date,
  b.title, b.author, b.total_pages,
  c.name AS category_name, c.description AS category_description
FROM rental_log r
JOIN book b ON r.book_id = b.id
LEFT JOIN category c ON b.category_id = c.id
WHERE r.id = ?;
```

### 3. 대여 상태 및 독서 피드백 수정 (Update)
- 반납 처리, 실제 읽은 쪽수 갱신, 1.0~5.0 만족도 평점 및 독서 한줄평 소감 업데이트
- `UPDATE rental_log SET borrower = ?, book_id = ?, status = ?, read_pages = ?, rating = ?, rental_days = ?, review = ? WHERE id = ?;`

### 4. 대여 기록 영구 삭제 (Delete)
- 취소되거나 잘못 입력된 대여 기록 영구 삭제
- `DELETE FROM rental_log WHERE id = ?;`

### 5. [만점 핵심] COUNT, AVG, SUM 및 GROUP BY 실시간 통계 (Stats)
- 3대 집계함수를 복합 적용하여 실시간 인기 도서 및 누적 독서량 랭킹 산출
```sql
SELECT 
  b.id, b.title, b.author, b.total_pages, c.name AS category_name,
  COUNT(r.id) AS total_rentals,
  COALESCE(ROUND(AVG(r.rating), 1), 0.0) AS avg_rating,
  COALESCE(SUM(r.read_pages), 0) AS total_pages_read
FROM book b
LEFT JOIN category c ON b.category_id = c.id
LEFT JOIN rental_log r ON b.id = r.book_id
GROUP BY b.id, b.title, b.author, b.total_pages, c.name
ORDER BY total_rentals DESC, avg_rating DESC;
```

### 6. 구비 도서 검색 및 기술 분야 필터링
- 196권의 도서 중 원하는 도서명/저자명 검색(`LIKE %keyword%`) 및 카테고리별 드롭다운 필터링 제공

---

## 📂 프로젝트 구조

```
20105 project/
├── app.js            # Express 서버 및 라우팅 컨트롤러
├── template.js       # Warm Editorial UI 뷰 렌더링 템플릿 모듈 (HTML 100% 분리)
├── init_db.js        # MySQL 데이터베이스 초기화 및 196권 실전 도서 적재 스크립트
├── init.sql          # 복사/붙여넣기 가능한 무결성 전체 SQL 스키마 및 DML 덤프
├── package.json      # 프로젝트 의존성 설정 (express, mysql2, sanitize-html)
├── .gitignore        # Git 버전 관리 제외 목록 (node_modules 등)
└── README.md         # 프로젝트 문서
```

---

## 🚀 빠른 시작 가이드

### 1. 저장소 클론 및 패키지 설치
```bash
git clone <your-repository-url>
cd bookhub
npm install
```

### 2. MySQL 데이터베이스 초기화
MySQL 서버가 실행 중인 상태에서 아래 명령어를 실행하여 196권의 실전 IT 도서와 테이블을 구축합니다:
```bash
npm run init-db
# 또는 MySQL Workbench에서 init.sql 파일 실행
```

### 3. 애플리케이션 실행
```bash
npm start
```
브라우저에서 **`http://localhost:3000`**으로 접속하여 확인합니다.
