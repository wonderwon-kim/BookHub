// [생성형 AI 활용] Claude가 작성
// 서버를 켤 때 bookhub DB와 테이블이 없으면 schema.sql로 자동 생성합니다. (Aiven처럼 mysql 클라이언트를 못 쓰는 배포 환경용)
// - 이미 테이블이 있으면 아무것도 하지 않습니다(데이터 보존).
// - 처음부터 다시 만들고 싶을 때만: npm run reset-db  (모든 데이터가 지워집니다!)
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./dbConfig');

(async () => {
  const reset = process.argv.includes('--reset');
  const conn = await mysql.createConnection({ ...config, multipleStatements: true });
  try {
    await conn.query('CREATE DATABASE IF NOT EXISTS bookhub DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci');
    const [rows] = await conn.query(
      `SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = 'bookhub' AND table_name = 'rental_log'`
    );
    if (rows[0].n > 0 && !reset) {
      console.log('[init-db] 테이블이 이미 있어서 건너뜁니다.');
      return;
    }
    await conn.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    console.log('[init-db] schema.sql 적용 완료 (테이블 + 샘플 데이터)');
  } finally {
    await conn.end();
  }
})().catch((err) => {
  console.error('[init-db] 실패:', err.message);
  process.exit(1);
});
