// C.van Pedagogy — questionnaire engine
// One data-driven model renders every section, keeps answers as you move
// back and forth, validates required fields, and builds the summary +
// the email sent on submit.

const OTHER_MARK = 'תפקיד אחר|תחום אחר|משהו אחר';

const SECTIONS = [
  {
    title: 'הכרות',
    subtitle: 'כמה מילים עלייך, כדי שנדבר על הכיתה הנכונה.',
    questions: [
      { id: 'name', label: 'מה השם שלך?', type: 'text', required: true, placeholder: 'לדוגמה: מיכל' },
      { id: 'school', label: 'באיזה בית ספר את מלמדת?', type: 'text', required: true, placeholder: 'שם בית הספר' },
      { id: 'role', label: 'מה התפקיד שלך השנה?', type: 'select', required: true,
        options: ['מחנכת', 'מורה מקצועית', 'רכזת', 'מנהלת / סגנית', 'תפקיד אחר'] },
      { id: 'gradeLevel', label: 'איזו כיתה או אילו שכבות את מלמדת?', type: 'text', required: true, placeholder: 'לדוגמה: ג׳-ד׳' },
      { id: 'subjects', label: 'באילו תחומים את מלמדת?', type: 'multiselect', required: true,
        options: ['שפה', 'מתמטיקה', 'מדעים', 'חברה ורוח', 'חינוך חברתי', 'תחום אחר'] },
    ],
  },
  {
    title: 'איפה הכיתה עומדת עכשיו?',
    subtitle: 'בלי לייפות. איך זה נראה באמת.',
    questions: [
      { id: 'classDescription', label: 'ספרי לי בכמה מילים על הכיתה שלך.', type: 'textarea' },
      { id: 'whatWorks', label: 'מה עובד טוב בכיתה כרגע?', type: 'textarea' },
      { id: 'biggestChallenge', label: 'מה הכי מאתגר אותך?', type: 'textarea' },
      { id: 'gaps', label: 'אילו פערים את מזהה אצל התלמידים?', type: 'textarea' },
      { id: 'diverseNeeds', label: 'האם יש בכיתה תלמידים עם צרכים שונים שחשוב לקחת בחשבון?', type: 'textarea' },
      { id: 'independenceLevel', label: 'איך היית מתארת את רמת העצמאות של התלמידים?', type: 'textarea' },
      { id: 'socialClimate', label: 'איך היית מתארת את האקלים החברתי בכיתה?', type: 'textarea' },
    ],
  },
  {
    title: 'מה מצופה ממך?',
    subtitle: 'מהצוות, מהמנהלת, וממשרד החינוך.',
    questions: [
      { id: 'principalExpectations', label: 'מה המנהלת או הצוות המקצועי מצפים לראות השנה?', type: 'textarea' },
      { id: 'coordinatorRequests', label: 'מה רכזת השפה / המתמטיקה מבקשת שתעשי בפועל?', type: 'textarea' },
      { id: 'curriculumRequirements', label: 'האם יש תוכנית לימודים, מיפוי, מבדק או יעד שנדרש ממך לעבוד לפיו?', type: 'textarea' },
      { id: 'unclearRequirements', label: 'מה מתוך דרישות משרד החינוך עדיין לא ברור לך?', type: 'textarea' },
      { id: 'expectedProgress', label: 'מה את מרגישה שאת אמורה להספיק השנה?', type: 'textarea' },
      { id: 'mostUrgent', label: 'מה הכי דחוף כרגע?', type: 'textarea' },
    ],
  },
  {
    title: 'מה התלמידים צריכים?',
    subtitle: 'הצד השני של המשוואה.',
    questions: [
      { id: 'studentsNeedNow', label: 'מה התלמידים שלך הכי צריכים עכשיו?', type: 'textarea' },
      { id: 'focusSkills', label: 'באילו מיומנויות חשוב לך להתמקד?', type: 'textarea' },
      { id: 'moreIndependence', label: 'מה היית רוצה שהם יעשו באופן עצמאי יותר?', type: 'textarea' },
      { id: 'academicImprove', label: 'מה היית רוצה לשפר מבחינה לימודית?', type: 'textarea' },
      { id: 'socialImprove', label: 'מה היית רוצה לשפר מבחינה חברתית?', type: 'textarea' },
      { id: 'feelDifferent', label: 'מה היית רוצה שירגיש אחרת בכיתה?', type: 'textarea' },
    ],
  },
  {
    title: "תכל'ס",
    subtitle: 'איפה מתחילים בפועל.',
    questions: [
      { id: 'workTomorrow', label: 'על מה את צריכה לעבוד כבר מחר בבוקר?', type: 'textarea' },
      { id: 'firstToCrack', label: 'איזה תחום את רוצה שנפצח קודם?', type: 'text' },
      { id: 'desiredOutcomes', label: 'מה היית רוצה לקבל בסוף התהליך?', type: 'multiselect',
        options: ['תוכנית עבודה', 'חלוקה חודשית', 'רצף הוראה', 'רעיונות לשיעורים', 'פרקטיקות שעובדות בכיתה',
          'משחקים ופעילויות', 'התאמות ללומדים שונים', 'כלים ללומד עצמאי', 'פרויקט כיתתי',
          'שילוב דיגיטל', 'שילוב פדגוגיה חברתית', 'משהו אחר'] },
      { id: 'mustNotMiss', label: 'האם יש נושא מסוים שחשוב לך שלא נפספס?', type: 'textarea' },
      { id: 'worthIt', label: 'מה יגרום לך להרגיש שהתהליך באמת היה שווה עבורך?', type: 'textarea' },
    ],
  },
  {
    title: 'פרטים לקבלת התוצר',
    subtitle: 'איך אחזיר לך את זה.',
    questions: [
      { id: 'email', label: 'כתובת אימייל', type: 'email', required: true, placeholder: 'name@example.com' },
      { id: 'phone', label: 'מספר טלפון', type: 'tel', required: false, placeholder: 'לא חובה' },
      { id: 'finalNote', label: 'הערה אחרונה שחשוב לי לדעת', type: 'textarea', required: false },
    ],
  },
];

const STORAGE_KEY = 'cvanPedagogyAnswers';

const state = {
  answers: {},
  otherAnswers: {},
  sectionIndex: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.answers = parsed.answers || {};
      state.otherAnswers = parsed.otherAnswers || {};
    }
  } catch (e) { /* ignore corrupt storage */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: state.answers, otherAnswers: state.otherAnswers }));
  } catch (e) { /* storage unavailable, continue without persistence */ }
}

function isOtherOption(text) {
  return /אחר$/.test(text);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------- rendering the questionnaire ----------------

function renderProgress() {
  const track = document.getElementById('progressTrack');
  track.innerHTML = '';
  SECTIONS.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'seg';
    const fill = document.createElement('i');
    fill.style.width = i < state.sectionIndex ? '100%' : i === state.sectionIndex ? '50%' : '0%';
    seg.appendChild(fill);
    track.appendChild(seg);
  });
  document.getElementById('progressLabel').textContent = `שלב ${state.sectionIndex + 1} מתוך ${SECTIONS.length}`;
}

function renderSection() {
  const section = SECTIONS[state.sectionIndex];
  const container = document.getElementById('sectionContainer');
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = section.title;
  container.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'section-subtitle';
  subtitle.textContent = section.subtitle;
  container.appendChild(subtitle);

  section.questions.forEach((q) => container.appendChild(renderQuestionCard(q)));

  renderProgress();

  document.getElementById('btnBack').style.visibility = state.sectionIndex === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').textContent =
    state.sectionIndex === SECTIONS.length - 1 ? 'לסיכום' : 'להמשיך';
}

function renderQuestionCard(q) {
  const card = document.createElement('div');
  card.className = 'q-card';
  card.dataset.qid = q.id;

  const label = document.createElement('label');
  label.className = 'q-label';
  label.textContent = q.label;
  if (q.required) {
    const star = document.createElement('span');
    star.className = 'q-required';
    star.textContent = '*';
    label.appendChild(star);
  }
  card.appendChild(label);

  if (q.type === 'text' || q.type === 'email' || q.type === 'tel') {
    const input = document.createElement('input');
    input.type = q.type;
    input.className = 'q-input';
    input.placeholder = q.placeholder || '';
    input.value = state.answers[q.id] || '';
    input.addEventListener('input', () => {
      state.answers[q.id] = input.value;
      clearError(card);
      saveState();
    });
    card.appendChild(input);
  }

  if (q.type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.className = 'q-textarea';
    textarea.placeholder = q.placeholder || '';
    textarea.value = state.answers[q.id] || '';
    textarea.addEventListener('input', () => {
      state.answers[q.id] = textarea.value;
      clearError(card);
      saveState();
    });
    card.appendChild(textarea);
  }

  if (q.type === 'select' || q.type === 'multiselect') {
    const wrap = document.createElement('div');
    wrap.className = 'chip-options';
    const multi = q.type === 'multiselect';
    const current = state.answers[q.id];
    const selectedSet = new Set(multi ? (current || []) : current ? [current] : []);

    q.options.forEach((opt) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip-option' + (selectedSet.has(opt) ? ' selected' : '');
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        if (multi) {
          if (selectedSet.has(opt)) selectedSet.delete(opt); else selectedSet.add(opt);
          state.answers[q.id] = Array.from(selectedSet);
        } else {
          selectedSet.clear();
          selectedSet.add(opt);
          state.answers[q.id] = opt;
        }
        clearError(card);
        saveState();
        renderOtherField(card, q, selectedSet);
        wrap.querySelectorAll('.chip-option').forEach((c) => c.classList.remove('selected'));
        selectedSet.forEach((val) => {
          const match = Array.from(wrap.children).find((c) => c.textContent === val);
          if (match) match.classList.add('selected');
        });
      });
      wrap.appendChild(chip);
    });
    card.appendChild(wrap);
    renderOtherField(card, q, selectedSet);
  }

  const error = document.createElement('p');
  error.className = 'q-error';
  error.textContent = 'שדה חובה — צריך למלא את זה כדי להמשיך.';
  card.appendChild(error);

  return card;
}

function renderOtherField(card, q, selectedSet) {
  const existing = card.querySelector('.q-other-input');
  if (existing) existing.remove();
  const hasOther = Array.from(selectedSet).some((v) => isOtherOption(v));
  if (!hasOther) return;

  const wrap = document.createElement('div');
  wrap.className = 'q-other-input';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'q-input';
  input.placeholder = 'ספרי בקצרה...';
  input.value = state.otherAnswers[q.id] || '';
  input.addEventListener('input', () => {
    state.otherAnswers[q.id] = input.value;
    saveState();
  });
  wrap.appendChild(input);
  card.appendChild(wrap);
}

function clearError(card) {
  card.classList.remove('invalid');
}

function validateCurrentSection() {
  const section = SECTIONS[state.sectionIndex];
  let firstInvalid = null;
  section.questions.forEach((q) => {
    if (!q.required) return;
    const val = state.answers[q.id];
    const empty = q.type === 'multiselect' ? !val || val.length === 0 : !val || String(val).trim() === '';
    const card = document.querySelector(`.q-card[data-qid="${q.id}"]`);
    if (empty) {
      card.classList.add('invalid');
      if (!firstInvalid) firstInvalid = card;
    } else {
      card.classList.remove('invalid');
    }
  });
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

// ---------------- summary ----------------

function renderSummary() {
  const container = document.getElementById('summaryContainer');
  container.innerHTML = '';

  SECTIONS.forEach((section, sectionIdx) => {
    const answered = section.questions.filter((q) => {
      const val = state.answers[q.id];
      return q.type === 'multiselect' ? val && val.length > 0 : val && String(val).trim() !== '';
    });
    if (answered.length === 0) return;

    const box = document.createElement('div');
    box.className = 'summary-section';

    const head = document.createElement('div');
    head.className = 'summary-section-head';
    const h4 = document.createElement('h4');
    h4.textContent = section.title;
    head.appendChild(h4);
    const editBtn = document.createElement('button');
    editBtn.className = 'summary-edit-btn';
    editBtn.textContent = 'עריכה';
    editBtn.addEventListener('click', () => {
      state.sectionIndex = sectionIdx;
      renderSection();
      showScreen('screen-questionnaire');
    });
    head.appendChild(editBtn);
    box.appendChild(head);

    answered.forEach((q) => {
      const qa = document.createElement('div');
      qa.className = 'summary-qa';
      const qEl = document.createElement('p');
      qEl.className = 'summary-q';
      qEl.textContent = q.label;
      const aEl = document.createElement('p');
      aEl.className = 'summary-a';
      aEl.textContent = formatAnswer(q);
      qa.appendChild(qEl);
      qa.appendChild(aEl);
      box.appendChild(qa);
    });

    container.appendChild(box);
  });
}

function formatAnswer(q) {
  const val = state.answers[q.id];
  let text = Array.isArray(val) ? val.join(', ') : val;
  const other = state.otherAnswers[q.id];
  if (other && other.trim() !== '') text += ` (${other.trim()})`;
  return text;
}

// ---------------- email body ----------------

function buildEmailText() {
  const today = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });
  let text = `שאלון מיפוי פדגוגי — C.van Pedagogy\n`;
  text += `נשלח בתאריך: ${today}\n\n`;
  text += `מורה: ${state.answers.name || '—'}\n`;
  text += `בית ספר: ${state.answers.school || '—'}\n`;
  text += `תפקיד: ${state.answers.role || '—'}\n`;
  text += `כיתה/שכבה: ${state.answers.gradeLevel || '—'}\n`;
  text += `האתגר המרכזי: ${state.answers.biggestChallenge || '—'}\n`;
  text += `\n${'='.repeat(40)}\n`;

  SECTIONS.forEach((section) => {
    const answered = section.questions.filter((q) => {
      const val = state.answers[q.id];
      return q.type === 'multiselect' ? val && val.length > 0 : val && String(val).trim() !== '';
    });
    if (answered.length === 0) return;
    text += `\n── ${section.title} ──\n`;
    answered.forEach((q) => {
      text += `${q.label}\n${formatAnswer(q)}\n\n`;
    });
  });

  return text;
}

// ---------------- submission ----------------

function isFormspreeConfigured() {
  return typeof CVAN_CONFIG !== 'undefined'
    && CVAN_CONFIG.formspreeEndpoint
    && !CVAN_CONFIG.formspreeEndpoint.includes('YOUR_FORMSPREE_ID');
}

async function submitQuestionnaire() {
  const submitBtn = document.getElementById('btnSubmit');
  const errorBox = document.getElementById('submitError');
  errorBox.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'שולחת...';

  const messageText = buildEmailText();
  const name = state.answers.name || '';
  const school = state.answers.school || '';
  const email = state.answers.email || '';

  if (!isFormspreeConfigured()) {
    openMailtoFallback(messageText);
    submitBtn.disabled = false;
    submitBtn.textContent = 'שליחה';
    return;
  }

  try {
    const res = await fetch(CVAN_CONFIG.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        school,
        email,
        phone: state.answers.phone || '',
        main_challenge: state.answers.biggestChallenge || '',
        submission_date: new Date().toLocaleDateString('he-IL'),
        message: messageText,
        _subject: `שאלון C.van חדש — ${name || 'ללא שם'}${school ? ' (' + school + ')' : ''}`,
        _replyto: email,
      }),
    });

    if (!res.ok) throw new Error('formspree-failed');

    localStorage.removeItem(STORAGE_KEY);
    document.getElementById('thankyouBody').textContent =
      'עכשיו התור שלי. הופכת את זה לתוכנית אחת שעובדת.';
    showScreen('screen-thankyou');
  } catch (err) {
    errorBox.hidden = false;
    errorBox.innerHTML =
      'השליחה לא הצליחה הפעם — יכול להיות בעיית רשת זמנית. אפשר לנסות שוב, או ' +
      '<a href="#" id="mailtoFallbackLink">לשלוח את התשובות במייל</a> ישירות.';
    document.getElementById('mailtoFallbackLink').addEventListener('click', (e) => {
      e.preventDefault();
      openMailtoFallback(messageText);
    });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'שליחה';
  }
}

function openMailtoFallback(messageText) {
  const subject = encodeURIComponent(`שאלון C.van — ${state.answers.name || 'ללא שם'}`);
  const body = encodeURIComponent(messageText);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ---------------- wiring ----------------

function goToQuestionnaire() {
  state.sectionIndex = 0;
  renderSection();
  showScreen('screen-questionnaire');
}

document.getElementById('btnStart').addEventListener('click', goToQuestionnaire);
document.getElementById('btnStart2').addEventListener('click', goToQuestionnaire);

document.getElementById('btnNext').addEventListener('click', () => {
  if (!validateCurrentSection()) return;
  if (state.sectionIndex < SECTIONS.length - 1) {
    state.sectionIndex += 1;
    renderSection();
  } else {
    renderSummary();
    showScreen('screen-summary');
  }
});

document.getElementById('btnBack').addEventListener('click', () => {
  if (state.sectionIndex > 0) {
    state.sectionIndex -= 1;
    renderSection();
  }
});

document.getElementById('btnBackFromSummary').addEventListener('click', () => {
  showScreen('screen-questionnaire');
  renderSection();
});

document.getElementById('btnSubmit').addEventListener('click', submitQuestionnaire);

loadState();
