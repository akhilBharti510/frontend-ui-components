const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const overlay = document.getElementById("overlay");

let lastFocusedElement;

// Open modal
openBtn.addEventListener("click", () => {
  lastFocusedElement = document.activeElement;
  openModal();
});

function openModal() {
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

// Close modal
function closeModal() {
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocusedElement.focus();
}

// Button close
closeBtn.addEventListener("click", closeModal);

// Overlay click
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

// ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("active")) {
    closeModal();
  }
});
