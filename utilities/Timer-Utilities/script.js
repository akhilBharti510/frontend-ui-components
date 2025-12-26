/* =========================================================
   DIGITAL CLOCK
   ========================================================= */

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

/* =========================================================
   STOPWATCH
   ========================================================= */

let swSeconds = 0;
let swInterval = null;
const swDisplay = document.getElementById("stopwatch");

function renderStopwatch() {
  const h = String(Math.floor(swSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((swSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(swSeconds % 60).padStart(2, "0");
  swDisplay.textContent = `${h}:${m}:${s}`;
}

document.getElementById("swStart").onclick = () => {
  if (swInterval) return;
  swInterval = setInterval(() => {
    swSeconds++;
    renderStopwatch();
  }, 1000);
};

document.getElementById("swStop").onclick = () => {
  clearInterval(swInterval);
  swInterval = null;
};

document.getElementById("swReset").onclick = () => {
  clearInterval(swInterval);
  swInterval = null;
  swSeconds = 0;
  renderStopwatch();
};

renderStopwatch();

/* =========================================================
   PROFESSIONAL TIMER (HOURS + PREMIUM ALARM)
   ========================================================= */

let timerSeconds = 0;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById("timer");
const hrInput = document.getElementById("hrInput");
const minInput = document.getElementById("minInput");
const secInput = document.getElementById("secInput");

/* =========================================================
   PREMIUM "TIMER FINISHED" SOUND
   (Soft rising chime — not irritating)
   ========================================================= */

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

/* =========================================================
   TIMER LOGIC
   ========================================================= */

function renderTimer() {
  const h = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(timerSeconds % 60).padStart(2, "0");

  timerDisplay.textContent = `${h}:${m}:${s}`;

  if (timerSeconds === 0) {
    timerDisplay.style.color = "#38bdf8";
  } else if (timerSeconds <= 10) {
    timerDisplay.style.color = "#f87171";
  } else {
    timerDisplay.style.color = "#38bdf8";
  }
}

function startTimer() {
  if (timerRunning) return;

  if (timerSeconds === 0) {
    const h = Number(hrInput.value) || 0;
    const m = Number(minInput.value) || 0;
    const s = Number(secInput.value) || 0;
    timerSeconds = h * 3600 + m * 60 + s;
  }

  if (timerSeconds <= 0) return;

  timerRunning = true;

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();

    if (timerSeconds === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;

      timerDisplay.textContent = "DONE";
      timerDisplay.style.color = "#22c55e";

      playPremiumAlarm(); // 🔔 MAST SOUND
    }
  }, 1000);
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
  timerSeconds = 0;

  hrInput.value = "";
  minInput.value = "";
  secInput.value = "";

  renderTimer();
}

document.getElementById("tStart").onclick = startTimer;
document.getElementById("tPause").onclick = pauseTimer;
document.getElementById("tReset").onclick = resetTimer;

renderTimer();
