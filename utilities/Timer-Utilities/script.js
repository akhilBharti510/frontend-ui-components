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

// StopWatch
let swMilliseconds = 0;
let swInterval = null;
const swDisplay = document.getElementById("stopwatch");

function renderStopwatch() {
  const totalMs = swMilliseconds;

  const h = String(Math.floor(totalMs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
  const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");

  swDisplay.textContent = `${h}:${m}:${s}.${ms}`;
}

document.getElementById("swPause").disabled = true;
document.getElementById("swReset").disabled = true;
document.getElementById("swStart").addEventListener("click", () => {
  if (swInterval) return;
  swInterval = setInterval(() => {
    swMilliseconds += 10; // 10ms precision
    renderStopwatch();
  }, 10);

  document.getElementById("swStart").disabled = true;
  document.getElementById("swPause").disabled = false;
  document.getElementById("swReset").disabled = false;
});

document.getElementById("swPause").addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  document.getElementById("swStart").textContent = "Resume";
  document.getElementById("swStart").disabled = false;
  document.getElementById("swPause").disabled = true;
  document.getElementById("swReset").disabled = false;
});

document.getElementById("swReset").addEventListener("click", () => {
  clearInterval(swInterval);
  swInterval = null;
  swMilliseconds = 0;
  renderStopwatch();
  document.getElementById("swStart").textContent = "Start";
  document.getElementById("swStart").disabled = false;
  document.getElementById("swPause").disabled = true;
  document.getElementById("swReset").disabled = true;
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

function renderTimer() {
  const totalMs = timerMilliseconds;

  const h = String(Math.floor(totalMs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, "0");
  const ms = String(Math.floor((totalMs % 1000) / 10)).padStart(2, "0");

  timerDisplay.textContent = `${h}:${m}:${s}.${ms}`;

  if (totalMs === 0) {
    timerDisplay.style.color = "#38bdf8";
  } else if (totalMs <= 10000) {
    // last 10 seconds
    timerDisplay.style.color = "#f87171";
  } else {
    timerDisplay.style.color = "#38bdf8";
  }
}

function startTimer() {
  if (timerRunning) return;

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
      timerRunning = false;

      timerDisplay.textContent = "DONE";
      timerDisplay.style.color = "#22c55e";
      document.getElementById("tPause").disabled = true;
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
document.getElementById("tPause").disabled = true;
document.getElementById("tReset").disabled = true;
document.getElementById("tStart").addEventListener("click", () => {
  startTimer();
  if (timerMilliseconds != 0) {
    document.getElementById("tStart").disabled = true;
    document.getElementById("tPause").disabled = false;
    document.getElementById("tReset").disabled = false;
  }
});
document.getElementById("tPause").addEventListener("click", () => {
  pauseTimer();
  document.getElementById("tPause").disabled = true;
  document.getElementById("tReset").disabled = false;
  document.getElementById("tStart").disabled = false;
  document.getElementById("tStart").textContent = "Resume";
});
document.getElementById("tReset").addEventListener("click", () => {
  resetTimer();
  document.getElementById("tPause").disabled = true;
  document.getElementById("tReset").disabled = true;
  document.getElementById("tStart").disabled = false;
  document.getElementById("tStart").textContent = "Start";
});

renderTimer();
