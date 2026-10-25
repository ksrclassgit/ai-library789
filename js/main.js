/* ==========================================================
   페이지 공통 인터랙션
   각 기능은 해당 요소가 페이지에 있을 때만 동작합니다.
   ========================================================== */

/* ---------- 헤더: 스크롤 그림자 · 모바일 메뉴 · 맨 위로 ---------- */
function initHeader() {
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".nav-toggle");
  const toTop = document.querySelector(".to-top");
  if (!header) return;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.classList.toggle("is-show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };

  if (toggle) {
    toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
    document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- 스크롤 등장 애니메이션 ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- 숫자 카운트업 ---------- */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("ko-KR") + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  if (!("IntersectionObserver" in window)) {
    nums.forEach(animateCount);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((el) => io.observe(el));
}

/* ---------- 탭 (프로그램 페이지) ---------- */
function initTabs() {
  const tabs = Array.from(document.querySelectorAll("[data-tab]"));
  if (!tabs.length) return;

  const activate = (id, updateHash) => {
    const exists = tabs.some((t) => t.dataset.tab === id);
    if (!exists) return;
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    document.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.toggle("is-active", p.id === `panel-${id}`);
    });
    if (updateHash) history.replaceState(null, "", `#${id}`);
  };

  tabs.forEach((t) => t.addEventListener("click", () => activate(t.dataset.tab, true)));

  const fromHash = () => {
    const id = window.location.hash.replace("#", "");
    if (id) activate(id, false);
  };
  window.addEventListener("hashchange", fromHash);
  fromHash();
}

/* ---------- 강사 필터 ---------- */
function initTeacherFilter() {
  const buttons = document.querySelectorAll("[data-filter]");
  if (!buttons.length) return;
  const cards = document.querySelectorAll(".teacher");

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      cards.forEach((card) => {
        const groups = (card.dataset.group || "").split(" ");
        card.classList.toggle("is-hidden", filter !== "all" && !groups.includes(filter));
      });
    })
  );
}

/* ---------- FAQ 아코디언 ---------- */
function initFaq() {
  const items = document.querySelectorAll(".faq__item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq__q");
    const panel = item.querySelector(".faq__a");
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq__a").style.maxHeight = null;
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });
      if (open) {
        item.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initReveal();
  initCounters();
  initTabs();
  initTeacherFilter();
  initFaq();
});
