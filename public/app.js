// ===================== Shared state =====================

const CHOICE_KEYS = [
  'genre',
  'characterType',
  'characterTrait',
  'sidekick',
  'plotTwist',
  'endingVibe',
];

const storySetup = {
  genre: null,
  characterType: null,
  characterTrait: null,
  sidekick: null,
  plotTwist: null,
  endingVibe: null,
  characterName: '',
};

const TOTAL_CHUNKS = 8;

const storyState = {
  chunks: [], // { chunkNumber, text, sceneDescription, hasIllustration, interaction, isFinal, childResponse, illustrationUrl, revealed }
  viewIndex: -1, // index into chunks currently being displayed
  characterReferenceImage: null, // first illustration generated — reused as a visual anchor for every later illustration/cover
};

// ===================== Screen switching =====================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.classList.toggle('active', el.id === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================== Setup screen =====================

function injectChoiceIcons() {
  document.querySelectorAll('.choice-icon[data-icon]').forEach((el, index) => {
    el.innerHTML = getIcon(el.dataset.icon);
    el.style.animationDelay = `${(index % 6) * 0.15}s`;
  });
}

function initSetupScreen() {
  document.querySelectorAll('.choice-group[data-key]').forEach((group) => {
    const key = group.dataset.key;
    group.addEventListener('click', (event) => {
      const card = event.target.closest('.choice-card');
      if (!card) return;

      storySetup[key] = card.dataset.value;

      group.querySelectorAll('.choice-card').forEach((c) => {
        c.classList.toggle('selected', c === card);
      });

      updateStartButton();
    });
  });

  const nameInput = document.getElementById('character-name');
  nameInput.addEventListener('input', () => {
    storySetup.characterName = nameInput.value.trim();
    updateStartButton();
  });

  document.getElementById('start-story-btn').addEventListener('click', () => {
    if (!isSetupComplete()) return;
    sessionStorage.setItem('storySetup', JSON.stringify(storySetup));
    beginStory();
  });

  updateStartButton();
}

function isSetupComplete() {
  return CHOICE_KEYS.every((key) => storySetup[key]) && storySetup.characterName.length > 0;
}

function updateStartButton() {
  const btn = document.getElementById('start-story-btn');
  const hint = document.getElementById('setup-hint');
  const ready = isSetupComplete();

  btn.disabled = !ready;
  hint.textContent = ready
    ? `Ready to begin, ${storySetup.characterName}!`
    : 'Pick one of each above to begin';
}

// ===================== Narration =====================

// iOS Safari only allows speechSynthesis.speak() to produce sound if it's
// triggered synchronously by a direct user gesture — every real narration
// call in this app happens after an async fetch resolves (tap -> fetch story
// -> then speak), which iOS treats as not user-initiated and silently
// ignores. The fix is to "unlock" the speech engine with a real speak() call
// made synchronously inside the very first tap/click anywhere on the page;
// once unlocked, subsequent async-triggered speak() calls keep working for
// the rest of the page's lifetime.
function unlockSpeechSynthesisOnce() {
  if (!('speechSynthesis' in window)) return;

  const unlock = () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(' '));
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('click', unlock);
  };

  document.addEventListener('touchstart', unlock, { once: true });
  document.addEventListener('click', unlock, { once: true });
}

let cachedNarrationVoice;
let narrationVoicePromise;

function pickNarrationVoice(voices) {
  const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
  const pool = englishVoices.length ? englishVoices : voices;

  return (
    pool.find((v) => /premium/i.test(v.name)) ||
    pool.find((v) => /enhanced/i.test(v.name)) ||
    pool.find((v) => v.localService && v.lang.toLowerCase() === 'en-us') ||
    pool.find((v) => v.default) ||
    pool[0] ||
    null
  );
}

function getNarrationVoice() {
  if (narrationVoicePromise) return narrationVoicePromise;

  narrationVoicePromise = new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(pickNarrationVoice(existing));
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(pickNarrationVoice(window.speechSynthesis.getVoices()));
    };
    // Fallback in case voiceschanged never fires on this browser.
    setTimeout(() => resolve(pickNarrationVoice(window.speechSynthesis.getVoices())), 1000);
  });

  return narrationVoicePromise;
}

async function speak(text, onDone) {
  if (!('speechSynthesis' in window) || !text) {
    if (onDone) onDone();
    return;
  }

  if (cachedNarrationVoice === undefined) {
    cachedNarrationVoice = await getNarrationVoice();
  }

  // Calling speak() immediately after cancel() can make WebKit silently drop
  // the new utterance (no onend/onerror ever fires) — this is what caused
  // the very first chunk to sometimes have no audio on iOS, right after the
  // unlock utterance. Only cancel when something's actually active, and give
  // the engine a moment to settle before speaking again.
  const wasActive = window.speechSynthesis.speaking || window.speechSynthesis.pending;
  if (wasActive) window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  if (cachedNarrationVoice) utterance.voice = cachedNarrationVoice;
  utterance.rate = 0.95;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(safetyTimer);
    hideNarrationToggle();
    if (onDone) onDone();
  };

  utterance.onend = finish;
  utterance.onerror = finish;

  // Safety net: if the browser silently drops the utterance instead of
  // firing onend/onerror (as iOS Safari does when speech isn't "unlocked"),
  // the story would otherwise be stuck waiting for narration forever. Force
  // things along after a generous, text-length-based timeout.
  const estimatedMs = Math.max(8000, text.split(/\s+/).length * 500) + 5000;
  const safetyTimer = setTimeout(finish, estimatedMs);

  setTimeout(() => window.speechSynthesis.speak(utterance), wasActive ? 150 : 0);
  showNarrationToggle();
}

// ===================== Persistent narration pause/resume control =====================
//
// speechSynthesis.paused/.speaking can read stale or racy values for a brief
// moment right after speak()/pause()/resume() is called in some browsers, so
// the button's own click actions — not re-reading that state — are the
// source of truth for what label to show.

let narrationToggleBtn;

function initNarrationToggle() {
  narrationToggleBtn = document.getElementById('narration-toggle-btn');

  narrationToggleBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      narrationToggleBtn.textContent = '⏸️ Pause';
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      narrationToggleBtn.textContent = '▶️ Resume';
    }
  });
}

function showNarrationToggle() {
  if (!narrationToggleBtn) return;
  narrationToggleBtn.hidden = false;
  narrationToggleBtn.textContent = '⏸️ Pause';
}

function hideNarrationToggle() {
  if (!narrationToggleBtn) return;
  narrationToggleBtn.hidden = true;
}

// ===================== Story screen =====================
//
// storyState.viewIndex tracks which chunk is currently displayed. It's
// usually the newest chunk (the "frontier"), but Back/Forward can move it
// to an earlier chunk to revisit it. Submitting a choice/answer while on an
// earlier chunk either just moves forward (if it matches what was picked
// before and nothing changed) or branches the story from there — discarding
// everything after it and generating a fresh continuation.

const storyEls = {};

function cacheStoryEls() {
  storyEls.progressFill = document.getElementById('story-progress-fill');
  storyEls.progressLabel = document.getElementById('story-progress-label');
  storyEls.backBtn = document.getElementById('story-back-btn');
  storyEls.forwardBtn = document.getElementById('story-forward-btn');
  storyEls.illustration = document.getElementById('story-illustration');
  storyEls.illustrationImg = document.getElementById('illustration-img');
  storyEls.illustrationLoading = document.getElementById('illustration-loading');
  storyEls.card = document.getElementById('story-card');
  storyEls.text = document.getElementById('story-text');
  storyEls.loading = document.getElementById('story-loading');
  storyEls.interaction = document.getElementById('story-interaction');
  storyEls.error = document.getElementById('story-error');
  storyEls.retryBtn = document.getElementById('story-retry-btn');
}

function initStoryScreen() {
  cacheStoryEls();
  storyEls.retryBtn.addEventListener('click', () => requestNextChunk());
  storyEls.backBtn.addEventListener('click', () => goToChunk(storyState.viewIndex - 1));
  storyEls.forwardBtn.addEventListener('click', () => goToChunk(storyState.viewIndex + 1));
}

function beginStory() {
  storyState.chunks = [];
  storyState.viewIndex = -1;
  storyState.characterReferenceImage = null;
  showScreen('screen-story');
  storyEls.card.hidden = false;
  storyEls.error.hidden = true;
  storyEls.text.textContent = '';
  storyEls.illustration.hidden = true;
  updateProgress(0);
  requestNextChunk();
}

function resetToSetup() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  hideNarrationToggle();
  storyState.chunks = [];
  storyState.viewIndex = -1;
  storyState.characterReferenceImage = null;
  resetEndingScreen();
  showScreen('screen-setup');
}

function getStorySoFarText() {
  return storyState.chunks.map((c) => c.text).join(' ');
}

function getLatestResponse() {
  if (!storyState.chunks.length) return '';
  const last = storyState.chunks[storyState.chunks.length - 1];
  return last.childResponse || '';
}

function updateProgress(chunkNumber, isReview = false) {
  const pct = Math.round((chunkNumber / TOTAL_CHUNKS) * 100);
  storyEls.progressFill.style.width = `${pct}%`;
  storyEls.progressLabel.textContent =
    chunkNumber === 0
      ? 'Getting your story ready...'
      : isReview
        ? `Reviewing Part ${chunkNumber} of ${TOTAL_CHUNKS}`
        : `Part ${chunkNumber} of ${TOTAL_CHUNKS}`;
}

function setLoading(isLoading) {
  storyEls.loading.hidden = !isLoading;
  updateStoryNav();
}

function updateStoryNav() {
  const loading = !storyEls.loading.hidden;
  storyEls.backBtn.disabled = loading || storyState.viewIndex <= 0;
  storyEls.forwardBtn.disabled = loading || storyState.viewIndex >= storyState.chunks.length - 1;
}

function hideInteraction() {
  storyEls.interaction.hidden = true;
  storyEls.interaction.innerHTML = '';
}

function goToChunk(index) {
  if (index < 0 || index >= storyState.chunks.length) return;
  window.speechSynthesis && window.speechSynthesis.cancel();
  hideNarrationToggle();
  storyEls.error.hidden = true;
  storyState.viewIndex = index;
  renderChunk(storyState.chunks[index]);
}

async function requestNextChunk() {
  const nextNumber = storyState.chunks.length + 1;

  storyEls.error.hidden = true;
  hideInteraction();
  setLoading(true);

  try {
    const res = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setup: storySetup,
        chunkNumber: nextNumber,
        storySoFar: getStorySoFarText(),
        latestResponse: getLatestResponse(),
      }),
    });

    if (!res.ok) throw new Error('Story request failed');
    const data = await res.json();

    storyState.chunks.push({
      chunkNumber: data.chunkNumber,
      text: data.text,
      sceneDescription: data.sceneDescription,
      hasIllustration: data.hasIllustration,
      interaction: data.interaction,
      isFinal: data.isFinal,
      childResponse: null,
      illustrationUrl: null,
      revealed: false,
    });
    storyState.viewIndex = storyState.chunks.length - 1;

    setLoading(false);
    renderChunk(storyState.chunks[storyState.viewIndex]);
  } catch (err) {
    console.error(err);
    setLoading(false);
    storyEls.error.hidden = false;
  }
}

async function loadIllustration(chunk) {
  storyEls.illustration.hidden = false;
  storyEls.illustration.classList.remove('illustration-failed');
  storyEls.illustrationImg.hidden = true;
  storyEls.illustrationImg.removeAttribute('src');
  storyEls.illustrationLoading.hidden = false;
  storyEls.illustrationLoading.innerHTML = '<span class="spinner"></span> Drawing a picture...';

  try {
    const res = await fetch('/api/illustration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sceneDescription: chunk.sceneDescription,
        setup: storySetup,
        referenceImage: storyState.characterReferenceImage,
      }),
    });

    if (!res.ok) throw new Error('Illustration request failed');
    const data = await res.json();

    chunk.illustrationUrl = data.image;
    storyEls.illustrationImg.src = data.image;
    storyEls.illustrationImg.hidden = false;
    storyEls.illustrationLoading.hidden = true;

    // The very first illustration generated becomes the visual anchor for
    // the hero and sidekick's appearance in every illustration after it.
    if (!storyState.characterReferenceImage) {
      storyState.characterReferenceImage = data.image;
    }
  } catch (err) {
    console.error(err);
    storyEls.illustration.classList.add('illustration-failed');
    storyEls.illustrationLoading.hidden = false;
    storyEls.illustrationLoading.innerHTML = '🎨 The picture will be ready soon!';
  }
}

function renderChunk(chunk) {
  const isFrontier = storyState.viewIndex === storyState.chunks.length - 1;
  updateProgress(chunk.chunkNumber, !isFrontier);
  updateStoryNav();

  if (chunk.hasIllustration) {
    if (chunk.illustrationUrl) {
      // Already generated earlier — reuse it instead of paying to redraw it.
      storyEls.illustration.hidden = false;
      storyEls.illustration.classList.remove('illustration-failed');
      storyEls.illustrationImg.src = chunk.illustrationUrl;
      storyEls.illustrationImg.hidden = false;
      storyEls.illustrationLoading.hidden = true;
    } else {
      loadIllustration(chunk);
    }
  } else {
    storyEls.illustration.hidden = true;
  }

  storyEls.text.textContent = chunk.text;

  if (chunk.isFinal) {
    hideInteraction();
    chunk.revealed = true;
    speak(chunk.text, () => setTimeout(goToEndingScreen, 2000));
    return;
  }

  if (chunk.revealed) {
    // Already been seen before (revisited via Back/Forward) — show
    // everything immediately instead of gating behind narration finishing.
    hideInteraction();
    if (chunk.interaction) renderInteraction(chunk);
    speak(chunk.text);
  } else {
    chunk.revealed = true;
    speak(chunk.text, () => {
      if (chunk.interaction) renderInteraction(chunk);
    });
  }
}

function renderInteraction(chunk) {
  const interaction = chunk.interaction;
  storyEls.interaction.innerHTML = '';
  storyEls.interaction.hidden = false;

  const prompt = document.createElement('p');
  prompt.className = 'story-interaction-prompt';
  prompt.textContent = interaction.prompt;
  storyEls.interaction.appendChild(prompt);

  if (interaction.type === 'choice') {
    const grid = document.createElement('div');
    grid.className = 'story-choice-grid';

    interaction.options.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'story-choice-btn';
      btn.textContent = option;
      if (option === chunk.childResponse) btn.classList.add('picked');
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.story-choice-btn').forEach((b) => {
          b.disabled = true;
          b.classList.toggle('picked', b === btn);
        });
        submitAnswer(option);
      });
      grid.appendChild(btn);
    });

    storyEls.interaction.appendChild(grid);
  } else if (interaction.type === 'input') {
    const row = document.createElement('div');
    row.className = 'story-input-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 60;
    input.autocomplete = 'off';
    input.placeholder = 'Type your answer...';
    if (chunk.childResponse) input.value = chunk.childResponse;

    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'primary-btn';
    submitBtn.textContent = 'Continue';

    const submit = () => {
      const value = input.value.trim();
      if (!value) {
        input.focus();
        return;
      }
      input.disabled = true;
      submitBtn.disabled = true;
      submitAnswer(value);
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    submitBtn.addEventListener('click', submit);

    row.appendChild(input);
    row.appendChild(submitBtn);
    storyEls.interaction.appendChild(row);
    if (!chunk.childResponse) input.focus();
  }
}

function submitAnswer(answerText) {
  const index = storyState.viewIndex;
  const chunk = storyState.chunks[index];
  const nextChunk = storyState.chunks[index + 1];

  if (nextChunk && chunk.childResponse === answerText) {
    // Nothing changed — just step forward to what's already there.
    goToChunk(index + 1);
    return;
  }

  // New or changed answer: the story branches from here, so anything
  // generated after this point no longer applies.
  chunk.childResponse = answerText;
  storyState.chunks.length = index + 1;
  storyState.viewIndex = index;
  setTimeout(() => requestNextChunk(), 250);
}

// ===================== Ending screen =====================

const endingEls = {};

function cacheEndingEls() {
  endingEls.titleStep = document.getElementById('ending-title-step');
  endingEls.coverStep = document.getElementById('ending-cover-step');
  endingEls.titleInput = document.getElementById('story-title-input');
  endingEls.createCoverBtn = document.getElementById('create-cover-btn');
  endingEls.coverLoading = document.getElementById('cover-loading');
  endingEls.coverError = document.getElementById('cover-error');
  endingEls.coverRetryBtn = document.getElementById('cover-retry-btn');
  endingEls.coverImg = document.getElementById('cover-img');
  endingEls.coverTitleText = document.getElementById('cover-title-text');
  endingEls.coverDateText = document.getElementById('cover-date-text');
  endingEls.recapContent = document.getElementById('story-recap-content');
  endingEls.replayBtn = document.getElementById('replay-narration-btn');
  endingEls.newStoryBtn = document.getElementById('new-story-btn');
  endingEls.backToStoryBtn = document.getElementById('back-to-story-btn');
}

function initEndingScreen() {
  cacheEndingEls();

  endingEls.titleInput.addEventListener('input', updateCreateCoverButton);
  endingEls.titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !endingEls.createCoverBtn.disabled) createCover();
  });

  endingEls.createCoverBtn.addEventListener('click', createCover);
  endingEls.coverRetryBtn.addEventListener('click', createCover);
  endingEls.replayBtn.addEventListener('click', () => speak(getStorySoFarText()));
  endingEls.newStoryBtn.addEventListener('click', resetToSetup);
  endingEls.backToStoryBtn.addEventListener('click', () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen('screen-story');
    goToChunk(storyState.chunks.length - 1);
  });
}

function updateCreateCoverButton() {
  endingEls.createCoverBtn.disabled = !endingEls.titleInput.value.trim();
}

function goToEndingScreen() {
  hideInteraction();
  resetEndingScreen();
  showScreen('screen-ending');
  endingEls.titleInput.focus();
}

function resetEndingScreen() {
  endingEls.titleInput.value = '';
  endingEls.createCoverBtn.disabled = true;
  endingEls.coverLoading.hidden = true;
  endingEls.coverError.hidden = true;
  endingEls.titleStep.hidden = false;
  endingEls.coverStep.hidden = true;
  endingEls.coverImg.removeAttribute('src');
  endingEls.recapContent.innerHTML = '';
}

async function createCover() {
  const title = endingEls.titleInput.value.trim();
  if (!title) return;

  endingEls.createCoverBtn.disabled = true;
  endingEls.coverError.hidden = true;
  endingEls.coverLoading.hidden = false;

  try {
    const res = await fetch('/api/cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setup: storySetup, referenceImage: storyState.characterReferenceImage }),
    });

    if (!res.ok) throw new Error('Cover request failed');
    const data = await res.json();

    showCoverStep(title, data.image);
  } catch (err) {
    console.error(err);
    endingEls.coverLoading.hidden = true;
    endingEls.coverError.hidden = false;
    endingEls.createCoverBtn.disabled = false;
  }
}

function showCoverStep(title, imageUrl) {
  endingEls.coverImg.src = imageUrl;
  endingEls.coverTitleText.textContent = title;
  endingEls.coverDateText.textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  renderRecap();

  endingEls.coverLoading.hidden = true;
  endingEls.titleStep.hidden = true;
  endingEls.coverStep.hidden = false;
}

function renderRecap() {
  endingEls.recapContent.innerHTML = '';

  storyState.chunks.forEach((chunk) => {
    if (chunk.hasIllustration && chunk.illustrationUrl) {
      const img = document.createElement('img');
      img.className = 'recap-illustration';
      img.src = chunk.illustrationUrl;
      img.alt = 'A picture from the story';
      endingEls.recapContent.appendChild(img);
    }

    const p = document.createElement('p');
    p.className = 'recap-chunk-text';
    p.textContent = chunk.text;
    endingEls.recapContent.appendChild(p);
  });
}

// ===================== Init =====================

document.addEventListener('DOMContentLoaded', () => {
  injectChoiceIcons();
  unlockSpeechSynthesisOnce();
  initNarrationToggle();
  initSetupScreen();
  initStoryScreen();
  initEndingScreen();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.error('SW registration failed:', err));
  }
});
