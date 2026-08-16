// C.van Pedagogy — presentation layer only. Reads the SECTIONS/state
// globals that script.js already exposes and reacts to its renders; it
// never writes questionnaire answers or changes validation behavior.
// Safe to delete without affecting how the form works.

(function () {
  const container = document.getElementById('sectionContainer');
  const tabRail = document.getElementById('tabRail');
  const progressLabel = document.getElementById('progressLabel');
  const planCard = document.getElementById('planCard');
  if (!container || !tabRail || !progressLabel) return;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }
  // prefer cutting at a natural clause break so a line reads like a
  // headline of the thought, not an arbitrarily chopped sentence
  function distill(str, max) {
    const s = String(str).trim();
    if (s.length <= max) return s;
    const window = s.slice(0, max + 20);
    const breakMatch = window.match(/^.{10,}?[.!?,]/);
    if (breakMatch) return breakMatch[0].slice(0, -1).trim();
    return s.slice(0, max).trim() + '…';
  }

  // ---- "answered" checkmark on the label dot ----
  function cardHasValue(card) {
    const textField = card.querySelector('.q-input, .q-textarea');
    if (textField && textField.value.trim() !== '') return true;
    return !!card.querySelector('.chip-option.selected');
  }
  function refreshAnswered(card) {
    if (!card) return;
    card.classList.toggle('is-answered', cardHasValue(card));
  }

  // ---- the living plan: not a recap of answers, a plan taking shape ----
  // Every line here is still her own words — nothing is invented — but the
  // headers name what each piece IS for the plan, not which question it
  // came from, and the eyebrow line names the stage the picture is at.
  const FOCUS_FIELDS = [
    { key: 'biggestChallenge', label: 'נקודת המוצא' },
    { key: 'studentsNeedNow', label: 'הצורך המרכזי' },
    { key: 'firstToCrack', label: 'הצעד הראשון' },
  ];
  function renderPlanCard(target, opts) {
    if (!target || typeof state === 'undefined') return;
    const a = state.answers;
    const identityParts = [a.name, a.school, a.role, a.gradeLevel].filter((v) => v && String(v).trim() !== '');
    const filledFocus = FOCUS_FIELDS.filter((f) => a[f.key] && String(a[f.key]).trim() !== '');
    const focusLines = filledFocus
      .map((f) => `<div class="plan-card-focus-item"><span class="arrow">→</span><b>${f.label}:</b> ${escapeHtml(distill(a[f.key], 46))}</div>`);
    const outcomes = Array.isArray(a.desiredOutcomes) ? a.desiredOutcomes : [];

    let eyebrow;
    if (opts && opts.sealed) {
      eyebrow = 'מכאן מתחילה התוכנית שלך';
    } else if (!identityParts.length && !filledFocus.length && !outcomes.length) {
      eyebrow = '<span class="live-dot" aria-hidden="true"></span>כאן מתחילים לעשות סדר';
    } else if (!filledFocus.length && !outcomes.length) {
      eyebrow = '<span class="live-dot" aria-hidden="true"></span>התמונה מתחילה להתבהר';
    } else if (filledFocus.length < FOCUS_FIELDS.length || !outcomes.length) {
      eyebrow = '<span class="live-dot" aria-hidden="true"></span>אנחנו מתחילים לזהות את העיקר';
    } else {
      eyebrow = '<span class="live-dot" aria-hidden="true"></span>כיוון העבודה מתחיל להתגבש';
    }

    let html = `<p class="plan-card-label">${eyebrow}</p>`;
    if (!identityParts.length && !focusLines.length && !outcomes.length) {
      html += '<p class="plan-card-empty">יתמלא לבד ברגע שתתחילי.</p>';
    } else {
      if (identityParts.length) {
        html += `<p class="plan-card-identity">${identityParts.map(escapeHtml).join(' <span class="sep">·</span> ')}</p>`;
      }
      if (focusLines.length) html += `<div class="plan-card-focus">${focusLines.join('')}</div>`;
      if (outcomes.length) {
        html += '<p class="plan-card-chips-label">מה שנבנה בשבילך</p>';
        html += `<ul class="plan-card-chips">${outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>`;
      }
    }
    target.innerHTML = html;
  }

  container.addEventListener('input', (e) => {
    refreshAnswered(e.target.closest('.q-card'));
    renderPlanCard(planCard);
  });
  container.addEventListener('click', (e) => {
    if (e.target.closest('.chip-option')) {
      refreshAnswered(e.target.closest('.q-card'));
      renderPlanCard(planCard);
    }
  });

  // ---- margin notes: one warm, practical aside per section ----
  const NOTES = [
    'אין תשובות נכונות. רק ספרי מי את.',
    'כתבי בחופשיות. זו לא בדיקה.',
    'לא ברור משהו? זה בדיוק המקום.',
    'תחשבי על התלמידים שלך. לא באופן כללי.',
    'כאן זה נהיה מעשי. תהיי קונקרטית.',
    'כמעט סיימנו.',
  ];

  function decorateSection() {
    if (typeof state === 'undefined' || typeof SECTIONS === 'undefined') return;
    const idx = state.sectionIndex;

    const existingGhost = container.querySelector('.ghost-num');
    if (existingGhost) existingGhost.remove();
    const ghost = document.createElement('span');
    ghost.className = 'ghost-num';
    ghost.textContent = String(idx + 1).padStart(2, '0');
    ghost.setAttribute('aria-hidden', 'true');
    container.insertBefore(ghost, container.firstChild);

    const existingNote = container.querySelector('.margin-note');
    if (existingNote) existingNote.remove();
    const subtitle = container.querySelector('.section-subtitle');
    if (subtitle && NOTES[idx]) {
      const note = document.createElement('p');
      note.className = 'margin-note';
      note.textContent = NOTES[idx];
      subtitle.insertAdjacentElement('afterend', note);
    }
  }

  // ---- tab rail: a visible index of all 6 sections ----
  function renderTabRail() {
    if (typeof state === 'undefined' || typeof SECTIONS === 'undefined') return;
    tabRail.innerHTML = '';
    SECTIONS.forEach((section, idx) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      const st = idx < state.sectionIndex ? 'done' : idx === state.sectionIndex ? 'current' : 'locked';
      tab.className = 'tab-item ' + st;
      tab.disabled = st === 'locked';
      const num = document.createElement('span');
      num.className = 'tab-num';
      num.textContent = st === 'done' ? '✓' : String(idx + 1);
      const label = document.createElement('span');
      label.textContent = section.title;
      tab.appendChild(num);
      tab.appendChild(label);
      if (st === 'done') {
        tab.addEventListener('click', () => {
          state.sectionIndex = idx;
          renderSection();
        });
      }
      tabRail.appendChild(tab);
    });
  }

  function onSectionChange() {
    renderTabRail();
    decorateSection();
    renderPlanCard(planCard);
  }

  const observer = new MutationObserver(onSectionChange);
  observer.observe(progressLabel, { childList: true, characterData: true, subtree: true });

  // ---- seal the card the moment the thank-you screen appears ----
  const thankyouScreen = document.getElementById('screen-thankyou');
  const thankyouPlanCard = document.getElementById('thankyouPlanCard');
  if (thankyouScreen && thankyouPlanCard) {
    const sealObserver = new MutationObserver(() => {
      if (!thankyouScreen.classList.contains('active')) return;
      renderPlanCard(thankyouPlanCard, { sealed: true });
      thankyouPlanCard.classList.remove('plan-card--sealed');
      void thankyouPlanCard.offsetWidth; // restart the stamp animation each time
      thankyouPlanCard.classList.add('plan-card--sealed');
    });
    sealObserver.observe(thankyouScreen, { attributes: true, attributeFilter: ['class'] });
  }

  // ---- payment gate: pay first, then the questionnaire opens ----
  // Honest limitation (see README-payment-gate.txt): this trusts a ?paid=1
  // redirect from the payment provider and remembers it in localStorage.
  // There is no server here to verify a real payment happened — it's a
  // practical deterrent, not a cryptographic lock.
  const PAID_KEY = 'cvanPaidAccess';

  function paymentConfigured() {
    const link = (typeof CVAN_CONFIG !== 'undefined' && CVAN_CONFIG.paymentLink) || '';
    return !!link && !link.includes('YOUR-PAYMENT-LINK-HERE');
  }
  function consumePaidUrlFlag() {
    const params = new URLSearchParams(location.search);
    if (params.get('paid') !== '1') return false;
    try { localStorage.setItem(PAID_KEY, '1'); } catch (e) {}
    params.delete('paid');
    const rest = params.toString();
    history.replaceState({}, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
    return true;
  }
  function hasPaid() {
    try { return localStorage.getItem(PAID_KEY) === '1'; } catch (e) { return false; }
  }

  const justPaid = consumePaidUrlFlag();
  const gateActive = paymentConfigured() && !hasPaid();

  if (gateActive) {
    const startButtons = [document.getElementById('btnStart'), document.getElementById('btnStart2')]
      .filter(Boolean);
    startButtons.forEach((btn) => { btn.textContent = 'מעבר לביט'; });
    // capture phase: runs before script.js's own click handler on the same
    // button, so it can redirect to payment instead of opening section 1
    document.addEventListener('click', (e) => {
      const target = e.target.closest && e.target.closest('#btnStart, #btnStart2');
      if (!target || !gateActive) return;
      e.stopPropagation();
      e.preventDefault();
      window.location.href = CVAN_CONFIG.paymentLink;
    }, true);
  } else if (paymentConfigured() && justPaid && typeof goToQuestionnaire === 'function') {
    goToQuestionnaire();
  }

  onSectionChange();
})();
