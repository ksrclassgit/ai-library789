/* ==========================================================
   공통 헤더 · 푸터 · 플로팅 버튼
   학원 이름, 연락처, 주소는 아래 ACADEMY 값만 바꾸면 전 페이지에 반영됩니다.
   ========================================================== */

const ACADEMY = Object.freeze({
  name: "브라이트 영어학원",
  nameEn: "BRIGHT ENGLISH",
  phone: "02-1234-5678",
  address: "서울시 ○○구 ○○로 123, 브라이트빌딩 4층",
  hours: "평일 13:00 – 22:00 · 토 10:00 – 18:00",
  email: "hello@bright-english.example",
  bizNo: "000-00-00000",
  owner: "홍길동",
});

const NAV_ITEMS = Object.freeze([
  { href: "index.html", label: "홈" },
  { href: "programs.html", label: "프로그램" },
  { href: "teachers.html", label: "강사진" },
  { href: "contact.html", label: "상담·오시는 길" },
]);

function currentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function logoMarkup() {
  return `
    <a href="index.html" class="logo" aria-label="${ACADEMY.name} 홈">
      <span class="logo__mark" aria-hidden="true">B</span>
      <span>${ACADEMY.name}<small>${ACADEMY.nameEn}</small></span>
    </a>`;
}

function headerMarkup() {
  const page = currentPage();
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.href}" class="nav__link${item.href === page ? " is-active" : ""}"${
        item.href === page ? ' aria-current="page"' : ""
      }>${item.label}</a>`
  ).join("");

  return `
    <div class="container header__inner">
      ${logoMarkup()}
      <nav class="nav" id="site-nav" aria-label="주 메뉴">
        ${links}
        <a href="index.html#level-test" class="btn btn--primary btn--sm">무료 레벨테스트</a>
      </nav>
      <button class="nav-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="site-nav">
        <span></span>
      </button>
    </div>`;
}

function footerMarkup() {
  const year = new Date().getFullYear();
  return `
    <div class="container">
      <div class="footer__grid">
        <div>
          ${logoMarkup()}
          <p>말하는 영어, 오래가는 실력.<br />유아부터 성인까지 단계별로 함께합니다.</p>
        </div>
        <div>
          <h4>바로가기</h4>
          <ul>${NAV_ITEMS.map((i) => `<li><a href="${i.href}">${i.label}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>프로그램</h4>
          <ul>
            <li><a href="programs.html#kids">유아 파닉스</a></li>
            <li><a href="programs.html#elementary">초등 영어</a></li>
            <li><a href="programs.html#middle">중등 내신·수능</a></li>
            <li><a href="programs.html#adult">성인 회화</a></li>
          </ul>
        </div>
        <div>
          <h4>연락처</h4>
          <ul>
            <li>☎ <a href="tel:${ACADEMY.phone}">${ACADEMY.phone}</a></li>
            <li>${ACADEMY.hours}</li>
            <li>${ACADEMY.address}</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>상호 ${ACADEMY.name} · 대표 ${ACADEMY.owner} · 사업자등록번호 ${ACADEMY.bizNo}</span>
        <span>© ${year} ${ACADEMY.nameEn}. All rights reserved.</span>
      </div>
    </div>`;
}

function floatingMarkup() {
  return `
    <a href="tel:${ACADEMY.phone}" class="to-call" aria-label="전화 상담 ${ACADEMY.phone}">☎</a>
    <button type="button" class="to-top" aria-label="맨 위로">↑</button>`;
}

function mountLayout() {
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  if (header) header.innerHTML = headerMarkup();
  if (footer) footer.innerHTML = footerMarkup();

  const floating = document.createElement("div");
  floating.className = "floating";
  floating.innerHTML = floatingMarkup();
  document.body.appendChild(floating);

  document.querySelectorAll("[data-academy]").forEach((el) => {
    const key = el.dataset.academy;
    if (key in ACADEMY) el.textContent = ACADEMY[key];
  });

  const tel = `tel:${ACADEMY.phone.replace(/[^\d+]/g, "")}`;
  document.querySelectorAll('a[href^="tel:"]').forEach((a) => a.setAttribute("href", tel));
}

mountLayout();
