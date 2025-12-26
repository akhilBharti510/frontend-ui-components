const input = document.getElementById("username");
const btn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");
const error = document.getElementById("error");

btn.addEventListener("click", fetchUser);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchUser();
});

async function fetchUser() {
  const username = input.value.trim();

  if (!username) {
    showError("Please enter a GitHub username");
    return;
  }

  error.textContent = "";
  profile.style.display = "block";
  profile.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const user = await response.json();
    renderProfile(user);
  } catch (err) {
    profile.style.display = "none";
    showError(err.message);
  }
}

function renderProfile(user) {
  profile.innerHTML = `
    <img src="${user.avatar_url}" alt="GitHub Avatar" />
    <h2>${user.name || "No Name Available"}</h2>
    <p>@${user.login}</p>
    <p>${user.bio || "No bio available"}</p>

    <div class="stats">
      <span>👥 ${user.followers}</span>
      <span>➡️ ${user.following}</span>
      <span>📦 ${user.public_repos}</span>
    </div>

    <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
  `;
}

function showError(message) {
  error.textContent = message;
}
