const WORDS = {
  en: [
    "Pineapple",
    "Volcano",
    "Headphones",
    "Elevator",
    "Backpack",
    "Snowman",
    "Guitar",
    "Popcorn",
    "Astronaut",
    "Pizza",
  ],
  ro: [
    "Ananas",
    "Vulcan",
    "Casti",
    "Lift",
    "Rucsac",
    "Om de zapada",
    "Chitara",
    "Popcorn",
    "Astronaut",
    "Pizza",
  ],
};

const I18N = {
  en: {
    subtitle: "Pass the phone. Beat the beep.",
    setupTitle: "Let’s Play",
    setupDesc: "2 teams. 2 players each. Names optional.",
    teamAHead: "Team A",
    teamBHead: "Team B",
    teamName: "Team name",
    player1: "Player 1",
    player2: "Player 2",
    playTo: "First to",
    playToHint: "points wins.",
    roundSecLabel: "Round lasts around",
    secLabel: "sec",
    rulesHead: "Quick rules",
    rules: [
      "Start the round: a word will be shown.",
      "Get your teammate to say it without you saying the word.",
      "Once he says it tap the big circle to PASS the phone to other team.",
      "When it booms, the team holding the phone loses the round.",
    ],
    start: "Start",
    round: "Round",
    holdsPhone: "holds the phone",
    wordSub: "When the word is said tap PASS PHONE and hand the phone over.",
    startRound: "Start round",
    tapToPass: "PASS PHONE",
    tapToStart: "Start round",
    handoffTitle: "Give to",
    back: "Back",
    reset: "Reset",
    roundResult: "Round result",
    boom: "BOOM!",
    roundStats: "Round statistics",
    pointTo: "Point to",
    holdingPhone: "Holding phone",
    roundLength: "Round length",
    wordsThisRound: "Words shown this round",
    undoPoint: "Undo point",
    nextRound: "Next round",
    gameOver: "Game over",
    finalScore: "Final score",
    playAgain: "Play again",
    newSetup: "New setup",
    toastSoundOn: "Sound ON",
    toastSoundOff: "Sound OFF",
    toastLangEN: "English",
    toastLangRO: "Romanian",
    toastNeedRoundSec: "Choose a valid round length (10-90 sec).",
    toastNeedPlayTo: "Choose a valid target score.",
    toastPausedAudio: "Tap once to enable sound.",
  },
  ro: {
    subtitle: "Dă telefonul mai departe. Bate bipul.",
    setupTitle: "Hai să jucăm",
    setupDesc: "2 echipe. 2 jucători fiecare. Numele sunt opționale.",
    teamAHead: "Echipa A",
    teamBHead: "Echipa B",
    teamName: "Nume echipă",
    player1: "Jucător 1",
    player2: "Jucător 2",
    playTo: "Până la",
    playToHint: "puncte caștigă.",
    roundSecLabel: "Runda durează în jur de",
    secLabel: "sec",
    rulesHead: "Reguli rapide",
    rules: [
      "Pornește runda: cuvântul apare imediat.",
      "Fă-ți colegul să-l spună fara a spune tu cuvântul.",
      "Imediat ce a spus cuvântul apasă cercul mare ca să DAI telefonul la cealaltă echipă.",
      "Când face „boom”, echipa care ține telefonul pierde runda.",
    ],
    start: "Start",
    round: "Rundă",
    holdsPhone: "ține telefonul",
    wordSub: "Apasă DAI când dai telefonul mai departe.",
    startRound: "Pornește runda",
    tapToPass: "Apasă ca să DAI",
    tapToStart: "Pornește runda",
    handoffTitle: "Dă-i lui",
    back: "Înapoi",
    reset: "Reset",
    roundResult: "Rezultat rundă",
    boom: "BOOM!",
    roundStats: "Statistici rundă",
    pointTo: "Punct pentru",
    holdingPhone: "Ținea telefonul",
    roundLength: "Durată rundă",
    wordsThisRound: "Cuvinte afișate în rundă",
    undoPoint: "Anulează punct",
    nextRound: "Runda următoare",
    gameOver: "Joc terminat",
    finalScore: "Scor final",
    playAgain: "Joacă din nou",
    newSetup: "Setare nouă",
    toastSoundOn: "Sunet PORNIT",
    toastSoundOff: "Sunet OPRIT",
    toastLangEN: "Engleză",
    toastLangRO: "Română",
    toastNeedRoundSec: "Alege o durata valida (10-90 sec).",
    toastNeedPlayTo: "Alege un scor țintă valid.",
    toastPausedAudio: "Apasă o dată ca să activezi sunetul.",
  },
};

const $ = (id) => document.getElementById(id);

let thumpCtx = null;

function playThump() {
  if (!thumpCtx) {
    thumpCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (thumpCtx.state === "suspended") {
    thumpCtx.resume();
  }

  const osc = thumpCtx.createOscillator();
  const gain = thumpCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(140, thumpCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, thumpCtx.currentTime + 0.18);

  gain.gain.setValueAtTime(0.001, thumpCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.8, thumpCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, thumpCtx.currentTime + 0.22);

  osc.connect(gain);
  gain.connect(thumpCtx.destination);

  osc.start();
  osc.stop(thumpCtx.currentTime + 0.25);
}

const screens = {
  setup: $("screenSetup"),
  play: $("screenPlay"),
  roundEnd: $("screenRoundEnd"),
  over: $("screenGameOver"),
};

const ui = {
  subtitle: $("subtitle"),
  langToggle: $("langToggle"),
  langLabel: $("langLabel"),
  soundToggle: $("soundToggle"),
  soundLabel: $("soundLabel"),

  setupTitle: $("setupTitle"),
  setupDesc: $("setupDesc"),
  teamAHead: $("teamAHead"),
  teamBHead: $("teamBHead"),
  teamNameLabelA: $("teamNameLabelA"),
  teamNameLabelB: $("teamNameLabelB"),
  player1LabelA: $("player1LabelA"),
  player2LabelA: $("player2LabelA"),
  player1LabelB: $("player1LabelB"),
  player2LabelB: $("player2LabelB"),
  playToLabel: $("playToLabel"),
  playToHint: $("playToHint"),
  roundSecLabel: $("roundSecLabel"),
  secLabel: $("secLabel"),
  rulesHead: $("rulesHead"),
  rulesList: $("rulesList"),
  startGame: $("startGame"),
  startGameLabel: $("startGameLabel"),

  scoreNameA: $("scoreNameA"),
  scoreNameB: $("scoreNameB"),
  scoreA: $("scoreA"),
  scoreB: $("scoreB"),
  roundLabel: $("roundLabel"),
  roundNum: $("roundNum"),

  activeText: $("activeText"),

  wordLabel: $("wordLabel"),
  wordNow: $("wordNow"),
  wordSub: $("wordSub"),

  bigPass: $("bigPass"),
  ringProgress: $("ringProgress"),
  bigTime: $("bigTime"),
  bigHint: $("bigHint"),

  backToSetup: $("backToSetup"),
  backLabel: $("backLabel"),
  resetBtn: $("resetBtn"),
  resetLabel: $("resetLabel"),

  handoff: $("handoff"),
  handoffTitle: $("handoffTitle"),
  handoffTeam: $("handoffTeam"),
  handoffSub: $("handoffSub"),

  roundEndBadge: $("roundEndBadge"),
  roundEndTitle: $("roundEndTitle"),
  roundEndDesc: $("roundEndDesc"),
  sumWinnerLabel: $("sumWinnerLabel"),
  sumLoserLabel: $("sumLoserLabel"),
  sumTimeLabel: $("sumTimeLabel"),
  sumWinner: $("sumWinner"),
  sumLoser: $("sumLoser"),
  sumTime: $("sumTime"),
  logTitle: $("logTitle"),
  logList: $("logList"),
  btnUndo: $("btnUndo"),
  undoLabel: $("undoLabel"),
  btnNextRound: $("btnNextRound"),
  nextRoundLabel: $("nextRoundLabel"),

  gameOverBadge: $("gameOverBadge"),
  gameOverTitle: $("gameOverTitle"),
  gameOverDesc: $("gameOverDesc"),
  finalNameA: $("finalNameA"),
  finalNameB: $("finalNameB"),
  finalScoreA: $("finalScoreA"),
  finalScoreB: $("finalScoreB"),
  playAgain: $("playAgain"),
  againLabel: $("againLabel"),
  newSetup: $("newSetup"),
  setupLabel2: $("setupLabel2"),

  toast: $("toast"),

  teamAName: $("teamAName"),
  teamBName: $("teamBName"),
  aP1: $("aP1"),
  aP2: $("aP2"),
  bP1: $("bP1"),
  bP2: $("bP2"),
  playTo: $("playTo"),
  roundSec: $("roundSec"),
};

const state = {
  lang: "en",
  sound: true,
  initializedAudio: false,
  audioCtx: null,

  teams: [
    {
      name: "Team A",
      players: ["Player 1", "Player 2"],
      score: 0,
      holderIdx: 0,
    },
    {
      name: "Team B",
      players: ["Player 1", "Player 2"],
      score: 0,
      holderIdx: 0,
    },
  ],

  round: 1,
  targetScore: 5,
  roundSec: 30,
  fuzzSec: 15,

  activeTeam: 0,

  running: false,
  startedAt: 0,
  boomAt: 0,
  boomTimeout: null,
  raf: null,
  beepTimeout: null,

  usedWords: new Set(),

  roundWords: [],
  passes: 0,
  lastRound: null,
};

function setScreen(which) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[which].classList.remove("hidden");
}

function toast(msg) {
  ui.toast.textContent = msg;
  ui.toast.classList.add("show");
  clearTimeout(ui.toast._t);
  ui.toast._t = setTimeout(() => ui.toast.classList.remove("show"), 1400);
}

function t(key) {
  return I18N[state.lang][key];
}

function safeName(v, fallback) {
  const s = (v || "").trim();
  return s.length ? s : fallback;
}

function applySetup() {
  state.teams[0].name = safeName(
    ui.teamAName.value,
    state.lang === "ro" ? "Echipa A" : "Team A"
  );
  state.teams[1].name = safeName(
    ui.teamBName.value,
    state.lang === "ro" ? "Echipa B" : "Team B"
  );

  state.teams[0].players = [
    safeName(ui.aP1.value, state.lang === "ro" ? "Jucator 1" : "Player 1"),
    safeName(ui.aP2.value, state.lang === "ro" ? "Jucator 2" : "Player 2"),
  ];
  state.teams[1].players = [
    safeName(ui.bP1.value, state.lang === "ro" ? "Jucator 1" : "Player 1"),
    safeName(ui.bP2.value, state.lang === "ro" ? "Jucator 2" : "Player 2"),
  ];

  const playTo = parseInt(ui.playTo.value, 10);
  const roundSec = parseInt(ui.roundSec.value, 10);

  if (!Number.isFinite(playTo) || playTo < 1 || playTo > 25) {
    toast(t("toastNeedPlayTo"));
    return false;
  }

  if (!Number.isFinite(roundSec) || roundSec < 5 || roundSec > 9999) {
    toast(t("toastNeedRoundSec"));
    return false;
  }

  state.targetScore = playTo;
  state.roundSec = roundSec;
  state.fuzzSec = 15;

  return true;
}

function renderI18N() {
  const i = I18N[state.lang];

  ui.subtitle.textContent = i.subtitle;
  ui.langLabel.textContent = state.lang.toUpperCase();
  ui.soundLabel.textContent = state.sound ? "ON" : "OFF";

  ui.setupTitle.textContent = i.setupTitle;
  ui.setupDesc.textContent = i.setupDesc;

  ui.teamAHead.textContent = i.teamAHead;
  ui.teamBHead.textContent = i.teamBHead;

  ui.teamNameLabelA.textContent = i.teamName;
  ui.teamNameLabelB.textContent = i.teamName;
  ui.player1LabelA.textContent = i.player1;
  ui.player2LabelA.textContent = i.player2;
  ui.player1LabelB.textContent = i.player1;
  ui.player2LabelB.textContent = i.player2;

  ui.playToLabel.textContent = i.playTo;
  ui.playToHint.textContent = i.playToHint;

  ui.roundSecLabel.textContent = i.roundSecLabel;
  ui.secLabel.textContent = i.secLabel;

  ui.rulesHead.textContent = i.rulesHead;
  ui.rulesList.innerHTML = "";
  i.rules.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    ui.rulesList.appendChild(li);
  });

  ui.startGameLabel.textContent = i.start;

  ui.roundLabel.textContent = i.round;

  ui.wordSub.textContent = i.wordSub;

  ui.backLabel.textContent = i.back;
  ui.resetLabel.textContent = i.reset;

  ui.roundEndTitle.textContent = i.boom;
  ui.roundEndDesc.textContent = i.roundStats;
  ui.sumWinnerLabel.textContent = i.pointTo;
  ui.sumLoserLabel.textContent = i.holdingPhone;
  ui.sumTimeLabel.textContent = i.roundLength;
  ui.logTitle.textContent = i.wordsThisRound;
  ui.undoLabel.textContent = i.undoPoint;
  ui.nextRoundLabel.textContent = i.nextRound;

  ui.gameOverBadge.textContent = i.gameOver;
  ui.againLabel.textContent = i.playAgain;
  ui.setupLabel2.textContent = i.newSetup;

  ui.handoffTitle.textContent = i.handoffTitle;

  updateTopUI();
  updateActiveUI();
  updateBigHint();
}

function updateTopUI() {
  ui.scoreNameA.textContent = state.teams[0].name;
  ui.scoreNameB.textContent = state.teams[1].name;
  ui.scoreA.textContent = String(state.teams[0].score);
  ui.scoreB.textContent = String(state.teams[1].score);
  ui.roundNum.textContent = String(state.round);
}

function updateActiveUI() {
  const team = state.teams[state.activeTeam];
  ui.activeText.textContent = `${team.name} ${t("holdsPhone")}`;
}

function updateBigHint() {
  ui.bigHint.textContent = state.running ? t("tapToPass") : t("tapToStart");
  ui.bigHint.classList.toggle("muted", !state.running);
}

function ensureAudio() {
  if (state.initializedAudio) return true;
  try {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    state.initializedAudio = true;
    return true;
  } catch (e) {
    state.initializedAudio = false;
    return false;
  }
}

function beep(freq, dur, gain) {
  if (!state.sound) return;
  if (!ensureAudio()) {
    toast(t("toastPausedAudio"));
    return;
  }
  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume().catch(() => {});
  }
  const o = state.audioCtx.createOscillator();
  const g = state.audioCtx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g);
  g.connect(state.audioCtx.destination);
  const now = state.audioCtx.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.start(now);
  o.stop(now + dur + 0.02);
}

function boomSound() {
  if (!state.sound) return;
  if (!ensureAudio()) {
    toast(t("toastPausedAudio"));
    return;
  }
  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume().catch(() => {});
  }
  const o = state.audioCtx.createOscillator();
  const g = state.audioCtx.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(220, state.audioCtx.currentTime);
  g.gain.setValueAtTime(0.001, state.audioCtx.currentTime);
  o.connect(g);
  g.connect(state.audioCtx.destination);
  const t0 = state.audioCtx.currentTime;
  g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
  o.frequency.exponentialRampToValueAtTime(90, t0 + 0.18);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
  o.start(t0);
  o.stop(t0 + 0.38);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function fmt(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function randomBoomMs() {
  const base = state.roundSec;
  const fuzz = state.fuzzSec;
  const sec = base + (Math.random() * (fuzz * 2) - fuzz);
  const finalSec = clamp(sec, 5, 120);
  return Math.floor(finalSec * 1000);
}

function pickWord() {
  const list = WORDS[state.lang];
  if (!list || !list.length) return "—";
  const available = list.filter((w) => !state.usedWords.has(w));
  const pool = available.length ? available : list;
  const w = pool[Math.floor(Math.random() * pool.length)];
  if (!available.length) state.usedWords.clear();
  state.usedWords.add(w);
  return w;
}

function showWord(w) {
  ui.wordNow.textContent = w;
  state.roundWords.push({
    at: performance.now(),
    team: state.activeTeam,
    word: w,
  });
}

function setRingProgress(p) {
  const pct = clamp(p, 0, 1);
  const deg = Math.floor(pct * 360);
  ui.ringProgress.style.background = `conic-gradient(from 180deg, rgba(124,92,255,.75) 0deg, rgba(33,212,253,.55) ${Math.max(
    10,
    deg
  )}deg, rgba(255,77,109,.55) 360deg)`;
}

function startRound() {
  if (state.running) return;

  state.running = true;
  state.passes = 0;
  state.roundWords = [];

  ui.bigPass.disabled = false;

  state.startedAt = performance.now();
  const boomIn = randomBoomMs();
  state.boomAt = state.startedAt + boomIn;

  ui.bigTime.textContent = fmt(boomIn);
  setRingProgress(0);
  updateBigHint();

  showWord(pickWord());

  scheduleBeepLoop();
  state.boomTimeout = setTimeout(() => endRound(), boomIn);
  tick();
}

function stopTimers() {
  clearTimeout(state.boomTimeout);
  state.boomTimeout = null;
  clearTimeout(state.beepTimeout);
  state.beepTimeout = null;
  cancelAnimationFrame(state.raf);
  state.raf = null;
}

function scheduleBeepLoop() {
  const loop = () => {
    if (!state.running) return;

    const now = performance.now();
    const remaining = state.boomAt - now;
    const total = state.boomAt - state.startedAt;
    const p = 1 - clamp(remaining / total, 0, 1);

    let interval = 700;
    if (p > 0.25) interval = 520;
    if (p > 0.45) interval = 380;
    if (p > 0.65) interval = 260;
    if (p > 0.82) interval = 160;

    const freq = 620 + Math.floor(p * 220);
    const gain = 0.04 + p * 0.08;
    beep(freq, 0.06, gain);

    state.beepTimeout = setTimeout(loop, interval);
  };

  clearTimeout(state.beepTimeout);
  state.beepTimeout = setTimeout(loop, 280);
}

function tick() {
  if (!state.running) return;

  const now = performance.now();
  const remaining = Math.max(0, state.boomAt - now);
  const total = state.boomAt - state.startedAt;
  const p = 1 - clamp(remaining / total, 0, 1);

  ui.bigTime.textContent = fmt(remaining);
  setRingProgress(p);

  state.raf = requestAnimationFrame(tick);
}

function showHandoffOverlay(nextTeamIdx) {
  const teamName = state.teams[nextTeamIdx].name;
  ui.handoffTeam.textContent = teamName;
  ui.handoff.classList.remove("hidden");
}

function hideHandoffOverlay() {
  ui.handoff.classList.add("hidden");
}

function pass() {
  if (!state.running) {
    startRound();
    return;
  }

  state.passes += 1;
  const next = state.activeTeam === 0 ? 1 : 0;

  beep(520, 0.05, 0.06);

  showHandoffOverlay(next);

  state.activeTeam = next;
  updateActiveUI();

  ui.bigPass.disabled = true;

  setTimeout(() => {
    hideHandoffOverlay();
    ui.bigPass.disabled = false;
    showWord(pickWord());
  }, 1000);
}

function endRound() {
  if (!state.running) return;

  state.running = false;
  stopTimers();
  boomSound();

  ui.bigPass.disabled = true;
  ui.bigTime.textContent = "00:00";
  setRingProgress(1);
  updateBigHint();

  const loserIdx = state.activeTeam;
  const winnerIdx = loserIdx === 0 ? 1 : 0;

  state.teams[winnerIdx].score += 1;

  const roundLenMs = Math.max(0, performance.now() - state.startedAt);
  const roundLenStr = fmt(roundLenMs);

  state.lastRound = {
    round: state.round,
    winnerIdx,
    loserIdx,
    winnerTeam: state.teams[winnerIdx].name,
    loserTeam: state.teams[loserIdx].name,
    loserHolder: `${state.teams[loserIdx].name} · ${
      state.teams[loserIdx].players[state.teams[loserIdx].holderIdx]
    }`,
    time: roundLenStr,
    passes: state.passes,
    words: [...state.roundWords],
  };

  ui.sumWinner.textContent = state.lastRound.winnerTeam;
  ui.sumLoser.textContent = state.lastRound.loserHolder;
  ui.sumTime.textContent = `${state.lastRound.time} · ${
    state.lastRound.passes
  } ${state.lang === "ro" ? "pase" : "passes"}`;

  ui.logList.innerHTML = "";
  state.lastRound.words.forEach((x, idx) => {
    const item = document.createElement("div");
    item.className = "logItem";
    const l = document.createElement("div");
    l.className = "l";
    l.textContent = `${state.lang === "ro" ? "Echipa" : "Team"} ${
      x.team === 0 ? "A" : "B"
    } · #${idx + 1}`;
    const w = document.createElement("div");
    w.className = "w";
    w.textContent = x.word;
    item.appendChild(l);
    item.appendChild(w);
    ui.logList.appendChild(item);
  });

  updateTopUI();
  setScreen("roundEnd");

  if (state.teams[winnerIdx].score >= state.targetScore) {
    setTimeout(() => showGameOver(winnerIdx), 220);
  }
}

function swapHolders() {
  state.teams.forEach((team) => {
    team.holderIdx = team.holderIdx === 0 ? 1 : 0;
  });
}

function nextRound() {
  if (
    state.teams[0].score >= state.targetScore ||
    state.teams[1].score >= state.targetScore
  ) {
    const winnerIdx = state.teams[0].score > state.teams[1].score ? 0 : 1;
    showGameOver(winnerIdx);
    return;
  }

  state.round += 1;
  state.activeTeam = state.round % 2 === 0 ? 1 : 0;

  swapHolders();

  ui.wordNow.textContent = "—";
  hideHandoffOverlay();
  updateTopUI();
  updateActiveUI();
  updateBigHint();

  ui.bigPass.disabled = false;

  setScreen("play");
}

function undoPoint() {
  if (!state.lastRound) return;
  const w = state.lastRound.winnerIdx;
  state.teams[w].score = Math.max(0, state.teams[w].score - 1);
  updateTopUI();
  state.lastRound = null;
  setScreen("play");
}

function showGameOver(winnerIdx) {
  const i = I18N[state.lang];
  const winner = state.teams[winnerIdx];

  ui.gameOverTitle.textContent = winner.name;
  ui.gameOverDesc.textContent = `${i.finalScore}: ${state.teams[0].score} - ${state.teams[1].score}`;

  ui.finalNameA.textContent = state.teams[0].name;
  ui.finalNameB.textContent = state.teams[1].name;
  ui.finalScoreA.textContent = String(state.teams[0].score);
  ui.finalScoreB.textContent = String(state.teams[1].score);

  setScreen("over");
}

function resetGame(toSetup) {
  stopTimers();
  hideHandoffOverlay();

  state.teams.forEach((t) => {
    t.score = 0;
    t.holderIdx = 0;
  });

  state.round = 1;
  state.activeTeam = 0;
  state.running = false;
  state.startedAt = 0;
  state.boomAt = 0;
  state.usedWords.clear();
  state.roundWords = [];
  state.passes = 0;
  state.lastRound = null;

  ui.wordNow.textContent = "—";
  ui.bigTime.textContent = "00:00";
  setRingProgress(0);
  ui.bigPass.disabled = false;
  updateBigHint();
  updateTopUI();
  updateActiveUI();

  setScreen(toSetup ? "setup" : "play");
}

function wire() {
  ui.langToggle.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "ro" : "en";
    renderI18N();
    toast(state.lang === "en" ? t("toastLangEN") : t("toastLangRO"));
    ui.wordNow.textContent = "—";
  });

  ui.soundToggle.addEventListener("click", () => {
    state.sound = !state.sound;
    ui.soundLabel.textContent = state.sound ? "ON" : "OFF";
    toast(state.sound ? t("toastSoundOn") : t("toastSoundOff"));
  });

  document.addEventListener(
    "pointerdown",
    () => {
      if (!state.initializedAudio && state.sound) {
        ensureAudio();
      }
    },
    { once: true }
  );

  const startBtn = document.getElementById("startGame");

  startBtn.addEventListener("pointerdown", () => {
    playThump();
    if (navigator.vibrate) navigator.vibrate(20);
  });

  ui.startGame.addEventListener("click", () => {
    if (!applySetup()) return;
    updateTopUI();
    updateActiveUI();
    ui.wordNow.textContent = "—";
    ui.bigPass.disabled = false;
    updateBigHint();
    setRingProgress(0);
    setScreen("play");
  });

  ui.bigPass.addEventListener("click", () => {
    pass();
  });

  ui.backToSetup.addEventListener("click", () => {
    resetGame(true);
  });

  ui.resetBtn.addEventListener("click", () => {
    resetGame(false);
  });

  ui.btnNextRound.addEventListener("click", () => {
    nextRound();
  });

  ui.btnUndo.addEventListener("click", () => {
    undoPoint();
  });

  ui.playAgain.addEventListener("click", () => {
    resetGame(false);
  });

  ui.newSetup.addEventListener("click", () => {
    resetGame(true);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (!screens.setup.classList.contains("hidden")) ui.startGame.click();
      else if (!screens.roundEnd.classList.contains("hidden"))
        ui.btnNextRound.click();
    }
  });
}

function init() {
  renderI18N();
  ui.bigPass.disabled = false;
  setRingProgress(0);
  updateBigHint();
  setScreen("setup");
  wire();
}

init();
