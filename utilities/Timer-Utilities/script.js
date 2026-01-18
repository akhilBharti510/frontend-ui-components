//Digital Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

//Stopwatch
let swMilliseconds = 0;
let swInterval = null;
const swDisplay = document.getElementById("stopwatch");
const swStart = document.getElementById("swStart");
const swPause = document.getElementById("swPause");
const swReset = document.getElementById("swReset");

function renderStopwatch() {
  let totalMs = swMilliseconds;
  const h = String(Math.floor(totalMs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
  const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");

  swDisplay.textContent = `${h}:${m}:${s}.${ms}`;
}

swPause.disabled = true;
swReset.disabled = true;

swStart.addEventListener("click", () => {
  if (swInterval) return;
  swInterval = setInterval(() => {
    swMilliseconds += 10;
    renderStopwatch();
  }, 10);

  swStart.disabled = true;
  swPause.disabled = false;
  swReset.disabled = false;
});

swPause.addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  swStart.textContent = "Resume";
  swStart.disabled = false;
  swPause.disabled = true;
  swReset.disabled = false;
});

swReset.addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  swMilliseconds = 0;

  swStart.textContent = "Start";
  swStart.disabled = false;
  swPause.disabled = true;
  swReset.disabled = true;
});

renderStopwatch();

//Timer
let timerMilliseconds = 0;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById("timer");
const hrInput = document.getElementById("hrInput");
const minInput = document.getElementById("minInput");
const secInput = document.getElementById("secInput");

const tStart = document.getElementById("tStart");
const tPause = document.getElementById("tPause");
const tReset = document.getElementById("tReset");

function renderTimer() {
  let totalMs = timerMilliseconds;
  const h = String(Math.floor(totalMs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
  const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");

  timerDisplay.textContent = `${h}:${m}:${s}.${ms}`;

  if (totalMs === 0) {
    timerDisplay.style.color = "#3cdfff";
  } else if (totalMs <= 10000) {
    timerDisplay.style.color = "#ff7f7f";
  } else {
    timerDisplay.style.color = "#3cdfff";
  }
}

function startTimer() {
  if (timerInterval) return;

  if (timerMilliseconds === 0) {
    const h = Number(hrInput.value) || 0;
    const m = Number(minInput.value) || 0;
    const s = Number(secInput.value) || 0;
    timerMilliseconds = (h * 3600 + m * 60 + s) * 1000;
  }

  if (timerMilliseconds <= 0) return;

  timerRunning = true;

  timerInterval = setInterval(() => {
    timerMilliseconds -= 10;
    renderTimer();

    if (timerMilliseconds === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = true;

      timerDisplay.textContent = "DONE";
      timerDisplay.style.color = "#39AD48";
      tPause.disabled = true;
      playPremiumAlarm();
    }
  }, 10);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  timerMilliseconds = 0;

  hrInput.value = "";
  minInput.value = "";
  secInput.value = "";

  renderTimer();
}

tPause.disabled = true;
tReset.disabled = true;

tStart.addEventListener("click", () => {
  startTimer();

  tStart.disabled = true;
  tPause.disabled = false;
  tReset.disabled = false;
});

tPause.addEventListener("click", () => {
  pauseTimer();

  tStart.textContent = "Resume";
  tStart.disabled = false;
  tPause.disabled = true;
  tReset.disabled = false;
});

tReset.addEventListener("click", () => {
  resetTimer();

  tStart.textContent = "Start";
  tStart.disabled = false;
  tPause.disabled = true;
  tReset.disabled = true;
});

renderTimer();

//AUDIO
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPremiumAlarm() {
  const now = audioCtx.currentTime;
  const DURATION = 5; // 🔥 10 seconds sound

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.1); // smooth fade-in
  gain.gain.setValueAtTime(0.35, now + DURATION - 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + DURATION); // smooth fade-out
  gain.connect(audioCtx.destination);

  // Pleasant alarm chord (not irritating)
  const frequencies = [523.25, 659.25, 783.99]; // C5 E5 G5

  frequencies.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + DURATION); // 🔊 FULL 10 SECONDS
  });
}
