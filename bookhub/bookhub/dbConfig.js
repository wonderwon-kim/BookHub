// [생성형 AI 활용] Claude가 작성 — Aiven MySQL 배포용 접속 설정
// db.js(앱)와 init-db.js(테이블 생성)가 같은 접속 정보를 쓰도록 한곳에 모았습니다.

// [추가 학습/변경] Aiven MySQL은 SSL 접속이 필수라서 DB_SSL=true 일 때 SSL을 켭니다.
// DB_SSL_CA 에 Aiven 콘솔의 'CA certificate' 내용을 넣으면 서버 인증서까지 검증합니다.
let ssl;
if (process.env.DB_SSL === 'true') {
  ssl = process.env.DB_SSL_CA
    ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') }
    : { rejectUnauthorized: false }; // CA가 없으면 암호화만 하고 서버 신원은 검증하지 않음(임시)
}

module.exports = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4',
  ssl,
};
