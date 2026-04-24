const AUTH_JSON_URL = "https://raw.githubusercontent.com/ZTRCOMPANY1/SITE-ACESSOS-JOGOS-e-ARQUIVOS/main/auth.json";

const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");
const gamesContainer = document.getElementById("gamesContainer");
const loginError = document.getElementById("loginError");

if (sessionStorage.getItem("logado") === "true") {
  showApp();
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    loginError.textContent = "Preencha usuário e senha.";
    return;
  }

  try {
    const response = await fetch(AUTH_JSON_URL);
    const auth = await response.json();

    if (username === auth.username && password === auth.password) {
      sessionStorage.setItem("logado", "true");
      showApp();
    } else {
      loginError.textContent = "Usuário ou senha incorretos.";
    }
  } catch (error) {
    loginError.textContent = "Erro ao carregar autenticação.";
    console.error(error);
  }
}

function logout() {
  sessionStorage.removeItem("logado");
  location.reload();
}

function showApp() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");
  loadGames();
}

async function loadGames() {
  try {
    const response = await fetch("./games.json");
    const games = await response.json();

    gamesContainer.innerHTML = "";

    games.forEach(game => {
      const gameCard = document.createElement("div");
      gameCard.className = "game-card";

      gameCard.innerHTML = `
        <img src="${game.image}" alt="${game.name}">
        <h2>${game.name}</h2>
        <p>${game.description}</p>

        <div class="version-area">
          ${createVersionCard("Versão DEV", game.dev)}
          ${createVersionCard("Versão Pública", game.public)}
        </div>
      `;

      gamesContainer.appendChild(gameCard);
    });

  } catch (error) {
    gamesContainer.innerHTML = "<p>Erro ao carregar jogos.</p>";
    console.error(error);
  }
}

function createVersionCard(title, versions) {
  let html = `
    <div class="version-card">
      <h3>${title}</h3>
  `;

  versions.forEach(version => {
    html += `
      <div class="version-item">
        <strong>${version.name}</strong>
        <span>${version.date}</span>
        <a class="download-btn" href="${version.download}" download>
          Baixar .RAR
        </a>
      </div>
    `;
  });

  html += "</div>";
  return html;
}