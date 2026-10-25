/* ==========================================================
   무료 미니 레벨테스트 (메인 페이지)
   문항은 QUESTIONS 배열에서 추가·수정할 수 있습니다.
   answer 는 options 의 0부터 시작하는 번호입니다.
   ========================================================== */

const QUESTIONS = Object.freeze([
  { q: "I ___ a student.", options: ["am", "is", "are", "be"], answer: 0 },
  { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
  { q: "There aren't ___ apples left.", options: ["some", "much", "any", "a"], answer: 2 },
  { q: "I have lived here ___ 2015.", options: ["for", "since", "from", "at"], answer: 1 },
  { q: "If I ___ rich, I would travel the world.", options: ["am", "be", "were", "will be"], answer: 2 },
  {
    q: "The novel ___ by millions of people.",
    options: ["has read", "has been read", "have read", "is reading"],
    answer: 1,
  },
  {
    q: "Hardly ___ the door when the phone rang.",
    options: ["I had opened", "did I open", "had I opened", "I opened"],
    answer: 2,
  },
  { q: "'meticulous'와 뜻이 가장 가까운 단어는?", options: ["careless", "thorough", "quick", "noisy"], answer: 1 },
]);

const LEVELS = Object.freeze([
  {
    min: 0,
    name: "Starter",
    text: "기초 문장 구조부터 차근차근! 파닉스·기초 문법 반에서 탄탄하게 시작해요.",
    program: "kids",
    programLabel: "유아·기초 프로그램 보기",
  },
  {
    min: 3,
    name: "Basic",
    text: "기본기가 잡혀 있어요. 초등 정규반에서 리딩·스피킹을 균형 있게 키워 보세요.",
    program: "elementary",
    programLabel: "초등 프로그램 보기",
  },
  {
    min: 5,
    name: "Intermediate",
    text: "핵심 문법은 충분! 중등 심화반에서 내신·서술형과 독해 속도를 끌어올려요.",
    program: "middle",
    programLabel: "중등 프로그램 보기",
  },
  {
    min: 7,
    name: "Advanced",
    text: "상위권 실력이에요. 수능·토플 대비반 또는 원어민 토론반을 추천해요.",
    program: "adult",
    programLabel: "심화·성인 프로그램 보기",
  },
]);

const FEEDBACK_DELAY_MS = 750;

function levelFor(score) {
  return [...LEVELS].reverse().find((lv) => score >= lv.min) || LEVELS[0];
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* 빈칸(___)을 강조 표시로 바꿉니다. */
function formatQuestion(text) {
  return escapeHtml(text).replace("___", "<mark>____</mark>");
}

function initLevelTest() {
  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  let state = { index: 0, score: 0, locked: false };

  const renderQuestion = () => {
    const { index } = state;
    const item = QUESTIONS[index];
    const percent = (index / QUESTIONS.length) * 100;
    root.innerHTML = `
      <div class="quiz__top">
        <span>Question ${index + 1} / ${QUESTIONS.length}</span>
        <span>약 1분 소요</span>
      </div>
      <div class="quiz__progress" role="progressbar" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${index}">
        <i style="width:${percent}%"></i>
      </div>
      <h3 class="quiz__q">${formatQuestion(item.q)}</h3>
      <div class="quiz__options">
        ${item.options
          .map((opt, i) => `<button type="button" class="quiz__opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${escapeHtml(opt)}</button>`)
          .join("")}
      </div>`;

    root.querySelectorAll(".quiz__opt").forEach((btn) => btn.addEventListener("click", () => choose(Number(btn.dataset.i))));
  };

  const choose = (picked) => {
    if (state.locked) return;
    const item = QUESTIONS[state.index];
    const correct = picked === item.answer;
    state = { ...state, locked: true, score: state.score + (correct ? 1 : 0) };

    const buttons = root.querySelectorAll(".quiz__opt");
    buttons.forEach((b) => (b.disabled = true));
    buttons[item.answer].classList.add("is-correct");
    if (!correct) buttons[picked].classList.add("is-wrong");

    window.setTimeout(() => {
      const next = state.index + 1;
      state = { ...state, index: next, locked: false };
      if (next < QUESTIONS.length) renderQuestion();
      else renderResult();
    }, FEEDBACK_DELAY_MS);
  };

  const renderResult = () => {
    const level = levelFor(state.score);
    root.innerHTML = `
      <div class="quiz__progress"><i style="width:100%"></i></div>
      <div class="quiz__result">
        <span class="card-label">YOUR LEVEL</span>
        <div class="quiz__level">${level.name}</div>
        <h3 class="quiz__q">${QUESTIONS.length}문제 중 ${state.score}문제 정답!</h3>
        <p>${level.text}<br />정확한 진단은 원어민 1:1 스피킹 테스트로 받아보세요.</p>
        <a href="contact.html?level=${encodeURIComponent(level.name)}" class="btn btn--accent">정밀 레벨테스트 예약</a>
        <a href="programs.html#${level.program}" class="btn btn--ghost">${level.programLabel}</a>
        <div style="margin-top:18px"><button type="button" class="btn btn--sm btn--ghost" data-restart>다시 풀기</button></div>
      </div>`;
    root.querySelector("[data-restart]").addEventListener("click", start);
  };

  const start = () => {
    state = { index: 0, score: 0, locked: false };
    renderQuestion();
  };

  root.querySelector("[data-quiz-start]").addEventListener("click", start);
}

document.addEventListener("DOMContentLoaded", initLevelTest);
