// [생성형 AI 활용] Claude가 초안 작성
// MySQL 연결 풀. 접속 정보는 dbConfig.js(환경변수)에서 가져옵니다.
const mysql = require('mysql2/promise');
const config = require('./dbConfig');

module.exports = mysql.createPool({
  ...config,
  database: process.env.DB_NAME || 'bookhub',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // DATETIME을 Date 객체가 아닌 문자열로 받기 (화면 출력이 쉬움)
});
