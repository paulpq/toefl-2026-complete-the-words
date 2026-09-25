'use strict';
const states = EXERCISES.map(() => ({answers: Array(10).fill(''), checked: false, revealed: false}));
let current = 0;
const el = id => document.getElementById(id);
const normalize = value => value.trim().toLowerCase();
const score = (index) => EXERCISES[index].gaps.reduce((n, gap, i) => n + (normalize(states[index].answers[i]) === gap.answer.toLowerCase() ? 1 : 0), 0);

function updateNavigation() {
  el('exercise-nav').replaceChildren(...EXERCISES.map((exercise, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item';
    button.setAttribute('aria-label', `Passage ${index + 1}: ${exercise.title}`);
    button.setAttribute('aria-current', String(index === current));
    const number = document.createElement('span'); number.className = 'nav-number'; number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    const title = document.createElement('span'); title.className = 'nav-name'; title.textContent = exercise.title;
    label.append(title);
    if (states[index].checked || states[index].revealed) {
      const status = document.createElement('span'); status.className = 'nav-state';
      status.textContent = states[index].checked ? `${score(index)} / 10 correct${states[index].revealed ? ' · key viewed' : ''}` : 'Answer key viewed';
      label.append(status);
    }
    button.append(number, label); button.addEventListener('click', () => navigate(index)); return button;
  }));
  const done = states.filter(state => state.checked).length;
  el('progress-text').textContent = `${done} of 10 checked`;
  el('progress-percent').textContent = `${done * 10}%`;
  el('set-progress').value = done;
}

function updateFilled() { el('filled-count').textContent = `${states[current].answers.filter(answer => answer.trim()).length} / 10 filled`; }

function clearFeedback() {
  el('feedback').hidden = true;
  document.querySelectorAll('.gap-input').forEach(input => { input.className = 'gap-input'; input.removeAttribute('aria-invalid'); input.removeAttribute('title'); });
}

function render() {
  const exercise = EXERCISES[current];
  const state = states[current];
  el('passage-counter').textContent = `PASSAGE ${String(current + 1).padStart(2,'0')} / 10`;
  el('topic').textContent = exercise.topic;
  el('exercise-title').textContent = exercise.title;
  el('word-count').textContent = `${exercise.wordCount} words`;
  el('passage').replaceChildren();
  exercise.parts.forEach((part, i) => {
    el('passage').append(document.createTextNode(i ? part.replace(/^[.,;:!?]+/, '') : part));
    if (i === exercise.gaps.length) return;
    const gap = exercise.gaps[i];
    const wrapper = document.createElement('span'); wrapper.className = 'word-gap';
    wrapper.append(document.createTextNode(gap.prefix));
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'gap-input'; input.id = `gap-${i}`;
    input.value = state.answers[i]; input.maxLength = gap.answer.length;
    input.placeholder = '–'.repeat(gap.answer.length);
    input.style.setProperty('--letters', gap.answer.length);
    input.setAttribute('aria-label', `Blank ${i + 1}: ${gap.prefix}, ${gap.answer.length} missing letters`);
    input.setAttribute('aria-describedby', 'directions');
    input.autocomplete = 'off'; input.autocapitalize = 'none'; input.spellcheck = false;
    input.setAttribute('autocorrect','off');
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^a-z]/gi, '');
      state.answers[i] = input.value;
      if (state.checked) { state.checked = false; clearFeedback(); updateNavigation(); }
      updateFilled();
      if (!el('review').hidden) renderReview();
    });
    const number = document.createElement('sup'); number.textContent = i + 1; number.setAttribute('aria-hidden','true');
    wrapper.append(input, number);
    const punctuation = exercise.parts[i + 1].match(/^[.,;:!?]+/);
    if (punctuation) wrapper.append(document.createTextNode(punctuation[0]));
    el('passage').append(wrapper);
  });
  el('review').hidden = true; el('reveal').textContent = 'Show answer key'; el('reveal').setAttribute('aria-expanded','false');
  el('previous').disabled = current === 0; el('next').disabled = current === EXERCISES.length - 1;
  updateFilled(); clearFeedback(); updateNavigation();
  if (state.checked) displayFeedback();
}

function navigate(index) {
  if (!Number.isInteger(index) || index < 0 || index >= EXERCISES.length) return;
  current = index; render();
  el('exercise-title').tabIndex = -1; el('exercise-title').focus({preventScroll:true});
  el('main').scrollIntoView({block:'start'});
}

function displayFeedback() {
  const state = states[current];
  const exercise = EXERCISES[current];
  const correct = score(current);
  let empty = 0;
  exercise.gaps.forEach((gap, i) => {
    const input = el(`gap-${i}`);
    const answer = normalize(state.answers[i]);
    const ok = answer === gap.answer.toLowerCase();
    if (!answer) empty++;
    input.className = `gap-input ${ok ? 'correct' : answer ? 'incorrect' : 'unanswered'}`;
    input.setAttribute('aria-invalid', String(!ok));
    input.title = `Blank ${i+1}: ${ok ? 'Correct' : answer ? 'Try again' : 'Unanswered'}`;
  });
  el('feedback').replaceChildren();
  const strong = document.createElement('strong'); strong.textContent = `${correct} / 10 correct`;
  const message = correct === 10 ? 'All words complete. Ready for the next passage?' : `${empty ? `${empty} unanswered. ` : ''}Review the marked blanks, or open the answer key for explanations.`;
  el('feedback').append(strong, document.createTextNode(message + (state.revealed ? ' Answer key has been viewed.' : '')));
  el('feedback').hidden = false;
}

function checkAnswers() { states[current].checked = true; displayFeedback(); updateNavigation(); }

function renderReview() {
  const exercise = EXERCISES[current];
  const state = states[current];
  el('answer-list').replaceChildren(...exercise.gaps.map((gap, index) => {
    const row = document.createElement('div'); row.className = 'answer-row';
    const number = document.createElement('span'); number.className = 'answer-number'; number.textContent = String(index+1).padStart(2,'0');
    const body = document.createElement('div');
    const line = document.createElement('div'); line.className = 'answer-line';
    const word = document.createElement('span'); word.className = 'answer-word'; word.textContent = gap.prefix;
    const ending = document.createElement('strong'); ending.textContent = gap.answer; word.append(ending);
    const letters = document.createElement('span'); letters.className = 'answer-letters'; letters.textContent = `Missing: ${gap.answer}`;
    const status = document.createElement('span'); status.className = 'answer-status';
    const answer = normalize(state.answers[index]);
    if (!answer) { status.textContent = 'Unanswered'; }
    else if (answer === gap.answer.toLowerCase()) { status.textContent = '✓ Correct'; status.classList.add('good'); }
    else { status.textContent = `Your letters: ${state.answers[index]} · Try again`; status.classList.add('wrong'); }
    line.append(word, letters, status);
    const explanation = document.createElement('p'); explanation.textContent = gap.explanation;
    body.append(line, explanation); row.append(number, body); return row;
  }));
  el('full-passage').textContent = exercise.passage;
}

el('exercise-form').addEventListener('submit', event => {event.preventDefault(); checkAnswers();});
el('reveal').addEventListener('click', () => {
  const show = el('review').hidden;
  el('review').hidden = !show;
  el('reveal').textContent = show ? 'Hide answer key' : 'Show answer key';
  el('reveal').setAttribute('aria-expanded', String(show));
  if (show) {
    states[current].revealed = true; renderReview(); updateNavigation();
    if (states[current].checked) displayFeedback();
  }
});
el('previous').addEventListener('click', () => navigate(current - 1));
el('next').addEventListener('click', () => navigate(current + 1));
el('reset').addEventListener('click', () => {
  states[current].answers = Array(10).fill(''); states[current].checked = false;
  render(); el('gap-0').focus();
});
render();

// Optional browser-native read access to the same visible exercise; no answer-key spoilers.
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(document.modelContext.registerTool({
      name:'read_current_practice', title:'Read the current practice passage',
      description:'Return the visible practice passage with blanks and the learner’s current entries. Does not reveal the answer key.',
      inputSchema:{type:'object',properties:{},additionalProperties:false},
      annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('Expected an empty object.');
        const exercise = EXERCISES[current];
        return {passage:current+1,title:exercise.title,text:exercise.parts.map((part,i)=>part+(exercise.gaps[i] ? exercise.gaps[i].prefix+'_'.repeat(exercise.gaps[i].answer.length) : '')).join(''),entries:[...states[current].answers]};
      }
    })).catch(()=>{});
  } catch (_) { /* Practice remains available without this optional browser API. */ }
}
