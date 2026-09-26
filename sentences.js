'use strict';

const SENTENCES = [
  {
    title: 'Purpose', topic: 'Research', skill: 'Infinitive of purpose',
    before: 'The research team repeated the experiment ', after: ' confirm that the results were reliable.',
    options: ['to', 'for', 'by', 'at'], answer: 'to',
    explanation: '“To confirm” is an infinitive of purpose. It explains why the team repeated the experiment.',
    distractors: '“For” would need a noun or an -ing form. “By” describes a method, and “at” does not introduce a purpose clause here.'
  },
  {
    title: 'Agreement', topic: 'Campus', skill: 'Subject–verb agreement',
    before: 'Neither the professor nor the teaching assistants ', after: ' available after 6 p.m.',
    options: ['was', 'were', 'is', 'has'], answer: 'were',
    explanation: 'With “neither … nor,” the verb agrees with the nearer subject. “Teaching assistants” is plural, so “were” is correct.',
    distractors: '“Was” and “is” are singular. “Has” cannot stand before the adjective “available” without “been.”'
  },
  {
    title: 'Sequence of events', topic: 'Lecture', skill: 'Past perfect',
    before: 'By the time the lecture began, most students ', after: ' already taken their seats.',
    options: ['have', 'had', 'were', 'are'], answer: 'had',
    explanation: 'The students took their seats before another past event began. The past perfect “had taken” marks the earlier action.',
    distractors: '“Have” uses the present perfect. “Were taken” changes the meaning to passive voice, and “are taken” uses the present tense.'
  },
  {
    title: 'Comparison', topic: 'Transportation', skill: 'Comparative structure',
    before: 'The new bus route is more convenient ', after: ' the previous one.',
    options: ['than', 'then', 'as', 'from'], answer: 'than',
    explanation: 'A comparative adjective with “more” is followed by “than”: “more convenient than.”',
    distractors: '“Then” refers to time. “As” belongs in an “as … as” comparison, and “from” does not complete this comparative structure.'
  },
  {
    title: 'Articles', topic: 'Academic writing', skill: 'Indefinite article',
    before: 'Although the article is brief, it provides ', after: ' useful overview of the topic.',
    options: ['a', 'an', 'the', 'no article'], answer: 'a',
    explanation: '“Overview” is a singular countable noun mentioned generally, so it needs an indefinite article. “Useful” begins with a /y/ consonant sound, so the article is “a.”',
    distractors: '“An” is used before a vowel sound, not simply a vowel letter. “The” would require a specific known overview, and omitting the article leaves a singular countable noun incomplete.'
  },
  {
    title: 'Modal form', topic: 'Registration', skill: 'Modal + base verb',
    before: 'Students who submit the form late may ', after: ' to wait until the next semester.',
    options: ['have', 'having', 'has', 'had'], answer: 'have',
    explanation: 'A modal verb such as “may” is followed by the base form. The correct expression is “may have to wait.”',
    distractors: '“Having,” “has,” and “had” are not base forms, so none can directly follow the modal “may.”'
  },
  {
    title: 'Relative clause', topic: 'Laboratory', skill: 'Nonrestrictive clause',
    before: 'The new equipment, ', after: ' was donated by a local company, will be installed tomorrow.',
    options: ['which', 'where', 'who', 'whose'], answer: 'which',
    explanation: '“Which” refers to a thing and serves as the subject of the nonrestrictive clause “which was donated.”',
    distractors: '“Where” refers to a place, “who” refers to a person, and “whose” must show possession before a noun.'
  },
  {
    title: 'Preposition', topic: 'Fieldwork', skill: 'Adjective + preposition',
    before: 'Each field researcher is responsible ', after: ' collecting accurate data.',
    options: ['for', 'to', 'with', 'at'], answer: 'for',
    explanation: 'The fixed expression is “responsible for.” A gerund can follow it: “responsible for collecting.”',
    distractors: '“To,” “with,” and “at” do not follow “responsible” when it means having a duty to do something.'
  },
  {
    title: 'Possibility', topic: 'Climate', skill: 'First conditional meaning',
    before: 'If temperatures continue to rise, some species ', after: ' migrate to cooler regions.',
    options: ['may', 'must have', 'would have', 'had'], answer: 'may',
    explanation: '“May” expresses a possible future result of the real condition introduced by “if.”',
    distractors: '“Must have” and “would have” point to past situations, while “had migrate” is not a grammatical verb phrase.'
  },
  {
    title: 'Contrast', topic: 'Data analysis', skill: 'Conjunctive adverb',
    before: 'The sample was small; ', after: ', the results revealed a consistent pattern.',
    options: ['nevertheless', 'therefore', 'for example', 'similarly'], answer: 'nevertheless',
    explanation: '“Nevertheless” signals contrast: the sample was small, but the results still showed a consistent pattern.',
    distractors: '“Therefore” signals a result, “for example” introduces an illustration, and “similarly” shows likeness. None expresses the needed contrast.'
  }
];

const states = SENTENCES.map(() => ({selected: '', checked: false, revealed: false}));
let current = 0;
const el = id => document.getElementById(id);

function isCorrect(index) {
  return states[index].selected === SENTENCES[index].answer;
}

function updateNavigation() {
  el('sentence-nav').replaceChildren(...SENTENCES.map((question, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item';
    button.setAttribute('aria-current', String(index === current));
    button.setAttribute('aria-label', `Question ${index + 1}: ${question.title}`);
    const number = document.createElement('span');
    number.className = 'nav-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'nav-name';
    name.textContent = question.title;
    label.append(name);
    if (states[index].checked || states[index].revealed) {
      const status = document.createElement('span');
      status.className = 'nav-state';
      status.textContent = states[index].checked ? (isCorrect(index) ? '✓ Correct' : 'Review answer') : 'Explanation viewed';
      label.append(status);
    }
    button.append(number, label);
    button.addEventListener('click', () => navigate(index));
    return button;
  }));
  const done = states.filter(state => state.checked).length;
  el('progress-text').textContent = `${done} of 10 checked`;
  el('progress-percent').textContent = `${done * 10}%`;
  el('set-progress').value = done;
}

function buildSentence(container, question, answer, emphasize) {
  container.replaceChildren(document.createTextNode(question.before));
  const completion = document.createElement(emphasize ? 'strong' : 'span');
  completion.className = emphasize ? '' : 'sentence-blank';
  completion.textContent = answer;
  container.append(completion, document.createTextNode(question.after));
}

function renderOptions() {
  const question = SENTENCES[current];
  const state = states[current];
  const legend = document.createElement('legend');
  legend.textContent = 'Answer choices';
  const options = question.options.map((option, index) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    if ((state.checked || state.revealed) && option === question.answer) label.classList.add('correct');
    if (state.checked && option === state.selected && option !== question.answer) label.classList.add('incorrect');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'sentence-answer';
    input.value = option;
    input.checked = state.selected === option;
    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = String.fromCharCode(65 + index);
    const text = document.createElement('span');
    text.className = 'option-text';
    text.textContent = option;
    input.addEventListener('change', () => {
      state.selected = option;
      state.checked = false;
      state.revealed = false;
      el('feedback').hidden = true;
      el('proof').hidden = true;
      el('reveal').textContent = 'Show explanation';
      el('reveal').setAttribute('aria-expanded', 'false');
      el('selection-state').textContent = `Selected: ${option}`;
      updateNavigation();
      renderOptions();
    });
    label.append(input, letter, text);
    return label;
  });
  el('option-list').replaceChildren(legend, ...options);
}

function renderProof() {
  const question = SENTENCES[current];
  const state = states[current];
  const result = el('proof-result');
  result.className = 'proof-result';
  if (state.checked) {
    result.classList.add(isCorrect(current) ? 'good' : 'wrong');
    el('proof-status').textContent = isCorrect(current) ? 'Your answer is correct.' : `Your answer was “${state.selected}.” Compare it with the correct answer below.`;
  } else {
    result.classList.add('revealed');
    el('proof-status').textContent = 'Explanation revealed before checking.';
  }
  el('answer-tag').textContent = `Answer: ${question.answer}`;
  buildSentence(el('completed-sentence'), question, question.answer, true);
  el('explanation').textContent = question.explanation;
  el('distractors').textContent = question.distractors;
}

function render() {
  const question = SENTENCES[current];
  const state = states[current];
  el('question-counter').textContent = `QUESTION ${String(current + 1).padStart(2, '0')} / 10`;
  el('topic').textContent = question.topic;
  el('exercise-title').textContent = question.title;
  el('skill').textContent = question.skill;
  buildSentence(el('sentence-prompt'), question, '____', false);
  renderOptions();
  el('selection-state').textContent = state.selected ? `Selected: ${state.selected}` : 'No answer selected';
  el('previous').disabled = current === 0;
  el('next').disabled = current === SENTENCES.length - 1;
  el('feedback').hidden = true;
  el('proof').hidden = !(state.checked || state.revealed);
  el('reveal').textContent = state.revealed || state.checked ? 'Hide explanation' : 'Show explanation';
  el('reveal').setAttribute('aria-expanded', String(state.revealed || state.checked));
  if (state.checked) showFeedback();
  if (state.checked || state.revealed) renderProof();
  updateNavigation();
}

function showFeedback() {
  const state = states[current];
  const feedback = el('feedback');
  feedback.replaceChildren();
  const strong = document.createElement('strong');
  strong.textContent = isCorrect(current) ? 'Correct.' : 'Not quite.';
  const message = isCorrect(current) ? 'The completed sentence and supporting rule are shown below.' : 'Use the completed sentence and proof below to check your reasoning.';
  feedback.append(strong, document.createTextNode(message));
  feedback.hidden = false;
}

function navigate(index) {
  if (!Number.isInteger(index) || index < 0 || index >= SENTENCES.length) return;
  current = index;
  render();
  el('exercise-title').tabIndex = -1;
  el('exercise-title').focus({preventScroll: true});
  el('main').scrollIntoView({block: 'start'});
}

el('sentence-form').addEventListener('submit', event => {
  event.preventDefault();
  const state = states[current];
  if (!state.selected) {
    el('feedback').replaceChildren(document.createTextNode('Choose an answer before checking.'));
    el('feedback').hidden = false;
    return;
  }
  state.checked = true;
  state.revealed = false;
  render();
});

el('reveal').addEventListener('click', () => {
  const state = states[current];
  const showing = !el('proof').hidden;
  if (showing) {
    el('proof').hidden = true;
    el('reveal').textContent = 'Show explanation';
    el('reveal').setAttribute('aria-expanded', 'false');
    return;
  }
  state.revealed = !state.checked;
  el('proof').hidden = false;
  el('reveal').textContent = 'Hide explanation';
  el('reveal').setAttribute('aria-expanded', 'true');
  renderOptions();
  renderProof();
  updateNavigation();
});

el('previous').addEventListener('click', () => navigate(current - 1));
el('next').addEventListener('click', () => navigate(current + 1));
el('reset').addEventListener('click', () => {
  states[current] = {selected: '', checked: false, revealed: false};
  render();
  document.querySelector('input[name="sentence-answer"]')?.focus();
});

render();
