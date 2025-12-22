    const counter = document.getElementById("counter");
    const incrementBtn = document.getElementById("increment");
    const decrementBtn = document.getElementById("decrement");
    const resetBtn = document.getElementById("reset");

    // --- Persistent state via localStorage ---
    let count = parseInt(localStorage.getItem("count")) || 0;
    updateDisplay();

    function updateDisplay() {
    counter.textContent = count;
    counter.style.color =
        count > 0 ? "#28a745" : count < 0 ? "#dc3545" : "#764ba2";

    // limit buttons to avoid overflow (optional)
    incrementBtn.disabled = count >= 999;
    decrementBtn.disabled = count <= -999;

    incrementBtn.classList.toggle("disabled", count >= 999);
    decrementBtn.classList.toggle("disabled", count <= -999);

    // save to localStorage
    localStorage.setItem("count", count);
    }

    // --- Event Handlers ---
    incrementBtn.addEventListener("click", () => {
    count++;
    animateChange();
    updateDisplay();
    });

    decrementBtn.addEventListener("click", () => {
    count--;
    animateChange();
    updateDisplay();
    });

    resetBtn.addEventListener("click", () => {
    count = 0;
    animateChange();
    updateDisplay();
    });

    // --- Keyboard Support ---
    window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        count++;
    } else if (e.key === "ArrowDown") {
        count--;
    } else if (e.key.toLowerCase() === "r") {
        count = 0;
    }
    animateChange();
    updateDisplay();
    });

    // --- Subtle animation ---
    function animateChange() {
    counter.style.transform = "scale(1.3)";
    setTimeout(() => (counter.style.transform = "scale(1)"), 150);
    }