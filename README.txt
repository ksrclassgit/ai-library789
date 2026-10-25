브라이트 영어학원 웹사이트 (HTML · CSS · JavaScript)
=====================================================

■ 실행 방법
  압축을 푼 뒤 index.html 을 더블클릭하면 브라우저에서 바로 열립니다.
  (별도 설치 · 서버 필요 없음)

■ 폴더 구성
  index.html      메인 (히어로, 프로그램 소개, 차별점, 1분 레벨테스트, 후기)
  programs.html   프로그램 상세 (탭 4개), 주간 시간표, 수강료
  teachers.html   강사진 (원어민/한국인/대상별 필터)
  contact.html    상담 신청서, 오시는 길, 자주 묻는 질문
  css/style.css   전체 디자인 (색상은 맨 위 :root 변수에서 변경)
  js/layout.js    공통 헤더·푸터 + 학원 정보
  js/main.js      메뉴, 스크롤 효과, 탭, 필터, FAQ
  js/level-test.js    미니 레벨테스트 문항·결과
  js/contact-form.js  상담 신청서 검증·전송

■ 자주 고치는 곳
  1) 학원 이름·전화·주소·사업자 정보 → js/layout.js 맨 위 ACADEMY
     (전화번호를 바꾸면 모든 페이지의 전화 버튼에 자동 반영)
  2) 대표 색상 → css/style.css 의 --primary(파랑), --accent(주황)
  3) 레벨테스트 문제 → js/level-test.js 의 QUESTIONS
  4) 수강료·시간표·강사 소개·후기 → 각 HTML 파일의 본문 텍스트

■ 상담 신청서 실제로 받기
  지금은 입력 검증 후 '완료' 화면만 보여 주고, 어디에도 저장·전송하지 않습니다.
  실제 접수를 받으려면 js/contact-form.js 의 FORM_ENDPOINT 에
  폼 수신 서비스 주소(예: Formspree, Google Apps Script 웹앱)를 넣으세요.

■ 공개 전 꼭 바꿀 것
  - 학원명, 주소, 전화, 사업자등록번호, 대표자명 (모두 예시 값)
  - 통계 숫자(교육 운영 15년, 재등록률 등)와 후기 문구 (예시 값)
  - 강사 이름·약력 (가상의 인물)
  - 오시는 길 약도 → 카카오맵/네이버지도 공유 코드로 교체 권장

■ 인터넷 배포
  폴더째 Netlify(드래그 앤 드롭), GitHub Pages, Vercel 등에 올리면 됩니다.
