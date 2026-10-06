# BookHub — IT 도서 분류 및 스터디 대여 관리 시스템

Node.js(Express) + MySQL. 기능: 대여 목록/검색, 등록, 3중 JOIN 상세, 반납·수정, 삭제, 통계(GROUP BY).

## 로컬 실행
```
npm install
DB_PASSWORD=내비밀번호 npm start     # http://localhost:3000 (처음 켤 때 DB·테이블·샘플 데이터 자동 생성)
```

## 환경변수
| 이름 | 설명 | 기본값 |
|---|---|---|
| DB_HOST / DB_PORT | MySQL 주소 / 포트 | localhost / 3306 |
| DB_USER / DB_PASSWORD | 접속 계정 | root / (빈 값) |
| DB_NAME | 사용할 DB (현재 `bookhub` 고정 권장) | bookhub |
| DB_SSL | Aiven 등 SSL 필수 서버면 `true` | (꺼짐) |
| DB_SSL_CA | Aiven의 CA certificate 내용 (선택, 넣으면 서버 인증서 검증) | - |

## 배포 (Render + Aiven MySQL)
- Build Command: `npm install` / Start Command: `npm start`
- 위 환경변수를 Render에 등록 (DB_PASSWORD는 Render 대시보드에서 직접 입력)
- 테이블을 처음부터 다시 만들려면 `npm run reset-db` (모든 데이터 삭제)
