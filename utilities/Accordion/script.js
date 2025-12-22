const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");
const indicator = document.querySelector(".indicator");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const tabId = tab.dataset.tab;

    // Reset
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    // Activate
    tab.classList.add("active");
    document
      .querySelector(`[data-content="${tabId}"]`)
      .classList.add("active");

    // Move indicator
    indicator.style.transform = `translateX(${index * 100}%)`;
  });
});
