/* ==========================================================
   상담 신청 폼 (상담·오시는 길 페이지)
   - 입력값 검증 후 완료 화면을 보여 줍니다.
   - 실제 접수를 받으려면 FORM_ENDPOINT 에 폼 수신 주소
     (예: Formspree, Google Apps Script 웹앱 URL)를 넣으세요.
     비워 두면 서버로 보내지 않고 완료 화면만 표시합니다.
   ========================================================== */

const FORM_ENDPOINT = "";

const PHONE_PATTERN = /^01[016789]-\d{3,4}-\d{4}$/;
const NAME_MAX = 20;
const MESSAGE_MAX = 500;

const RULES = Object.freeze({
  name: (v) => {
    if (!v) return "이름을 입력해 주세요.";
    if (v.length > NAME_MAX) return `이름은 ${NAME_MAX}자 이내로 입력해 주세요.`;
    return "";
  },
  phone: (v) => (PHONE_PATTERN.test(v) ? "" : "휴대폰 번호를 010-0000-0000 형식으로 입력해 주세요."),
  target: (v) => (v ? "" : "수강 대상을 선택해 주세요."),
  message: (v) => (v.length > MESSAGE_MAX ? `문의 내용은 ${MESSAGE_MAX}자 이내로 입력해 주세요.` : ""),
});

/* 숫자만 남기고 010-0000-0000 형태로 하이픈을 넣습니다. */
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  const midLen = digits.length === 10 ? 3 : 4;
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + midLen)}-${digits.slice(3 + midLen)}`;
}

function readForm(form) {
  const data = new FormData(form);
  return Object.freeze({
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    target: String(data.get("target") || ""),
    course: String(data.get("course") || ""),
    time: String(data.get("time") || ""),
    message: String(data.get("message") || "").trim(),
    level: String(data.get("level") || ""),
    agree: data.get("agree") === "on",
  });
}

function setFieldError(form, name, message) {
  const field = form.querySelector(`[data-field="${name}"]`);
  if (!field) return;
  field.classList.toggle("has-error", Boolean(message));
  const box = field.querySelector(".field__error");
  if (box) box.textContent = message;
}

function validate(form, values) {
  const errors = Object.fromEntries(Object.entries(RULES).map(([key, rule]) => [key, rule(values[key])]));
  Object.entries(errors).forEach(([key, msg]) => setFieldError(form, key, msg));

  const agreeMsg = values.agree ? "" : "개인정보 수집·이용에 동의해 주세요.";
  setFieldError(form, "agree", agreeMsg);

  const firstInvalid = Object.keys(errors).find((k) => errors[k]) || (agreeMsg ? "agree" : null);
  return firstInvalid;
}

async function send(values) {
  if (!FORM_ENDPOINT) return;
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error(`접수 서버 응답 오류 (${res.status})`);
}

function prefillFromQuery(form) {
  const params = new URLSearchParams(window.location.search);
  const level = params.get("level");
  if (!level || !/^[A-Za-z]{1,20}$/.test(level)) return;
  form.querySelector('[name="level"]').value = level;
  const note = form.querySelector("[data-level-note]");
  if (note) {
    note.textContent = `미니 레벨테스트 결과: ${level} — 상담 시 참고할게요.`;
    note.hidden = false;
  }
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const success = document.querySelector("[data-form-success]");
  const submitBtn = form.querySelector('[type="submit"]');
  const phoneInput = form.querySelector('[name="phone"]');

  prefillFromQuery(form);

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("change", () => {
      const values = readForm(form);
      if (el.name in RULES) setFieldError(form, el.name, RULES[el.name](values[el.name]));
      if (el.name === "agree") setFieldError(form, "agree", values.agree ? "" : "개인정보 수집·이용에 동의해 주세요.");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const values = readForm(form);
    const invalid = validate(form, values);
    if (invalid) {
      const target = form.querySelector(`[name="${invalid}"]`);
      if (target) target.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "접수 중…";
    try {
      await send(values);
      form.hidden = true;
      success.querySelector("[data-success-name]").textContent = values.name;
      success.classList.add("is-show");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("상담 신청 전송 실패:", err);
      window.alert("죄송합니다. 신청 접수 중 문제가 생겼어요. 잠시 후 다시 시도하시거나 전화로 문의해 주세요.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "상담 신청하기";
    }
  });

  const again = success.querySelector("[data-form-again]");
  again.addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    success.classList.remove("is-show");
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);
