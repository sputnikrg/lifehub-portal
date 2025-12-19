// assets/js/script.js

const STORAGE_KEY = "lifehub_user_ads_v1";

// Базовые объявления (зашиты в код)
const defaultListings = [
  {
    id: 1,
    type: "wohnung",
    title: "2-Zimmer Wohnung in Waiblingen",
    city: "Waiblingen",
    price: 850,
    description: "Helle, möblierte Wohnung, Nähe S-Bahn.",
    image: "assets/img/wohnung.jpg",
    createdAt: "2025-01-10"
  },
  {
    id: 2,
    type: "wohnung",
    title: "1-Zimmer Apartment in Weinstadt",
    city: "Weinstadt",
    price: 620,
    description: "Ideal für Singles, warm, moderne Küche.",
    image: "assets/img/wohnung.jpg",
    createdAt: "2025-01-12"
  },
  {
    id: 3,
    type: "job",
    title: "Teilzeitjob im Supermarkt",
    city: "Weinstadt",
    salary: 14,
    description: "Kassierer/in oder Warenverräumer/in, flexible Zeiten.",
    image: "assets/img/job.jpg",
    createdAt: "2025-01-15"
  },
  {
    id: 4,
    type: "dating",
    title: "Suche Freunde für Spaziergänge",
    city: "Stuttgart",
    age: 35,
    description: "Neu in Deutschland, möchte neue Leute kennenlernen.",
    image: "assets/img/dating.jpg",
    createdAt: "2025-01-16"
  }
];

// Объявления, которые добавляет пользователь (храним в localStorage)
let userListings = [];

function loadUserListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      userListings = data;
    }
  } catch (e) {
    console.error("Fehler beim Lesen von localStorage", e);
  }
}

function saveUserListings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  } catch (e) {
    console.error("Fehler beim Speichern in localStorage", e);
  }
}

// Дефолтная картинка по типу
function getDefaultImage(type) {
  if (type === "wohnung") return "assets/img/wohnung.jpg";
  if (type === "job") return "assets/img/job.jpg";
  if (type === "dating") return "assets/img/dating.jpg";
  return "assets/img/placeholder.jpg";
}

// Все объявления (дефолтные + пользовательские)
function getAllListings() {
  return [...defaultListings, ...userListings];
}

// Фильтрация по типу
function getListingsByType(type) {
  return getAllListings().filter((item) => item.type === type);
}

// Отрисовка карточек
function renderListings(type) {
  const container = document.getElementById("listing-container");
  if (!container) return;

  const items = getListingsByType(type);

  if (items.length === 0) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const imgSrc = item.image || getDefaultImage(type);

      let metaLine = "";
      if (type === "wohnung") {
        metaLine = `${item.city} • ${item.price || "-"} € / Monat`;
      } else if (type === "job") {
        metaLine = `${item.city} • ab ${item.salary || "-"} € / Stunde`;
      } else if (type === "dating") {
        metaLine = `${item.city} • ${item.age || ""} Jahre`;
      }

      return `
        <article class="listing-card">
          <img src="${imgSrc}" alt="${item.title}" class="listing-img">
          <div class="listing-content">
            <h3>${item.title}</h3>
            <p class="listing-meta">${metaLine}</p>
            <p class="listing-desc">${item.description}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

// Инициализация формы добавления объявления
function initPostForm() {
  const form = document.getElementById("adForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value.trim();
    const city = document.getElementById("city").value.trim();
    const description = document.getElementById("desc").value.trim();

    if (!title || !city || !description) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    const newAd = {
      id: Date.now(),
      type,
      title,
      city,
      description,
      price: 0,
      salary: 0,
      age: 0,
      image: getDefaultImage(type),
      createdAt: new Date().toISOString().slice(0, 10)
    };

    userListings.push(newAd);
    saveUserListings();

    alert("Anzeige gespeichert!");
    window.location.href = type + ".html";
  });
}

// Главная инициализация
document.addEventListener("DOMContentLoaded", () => {
  loadUserListings();

  const page = document.body.dataset.page;
  if (!page) return;

  if (page === "wohnung") {
    renderListings("wohnung");
  } else if (page === "job") {
    renderListings("job");
  } else if (page === "dating") {
    renderListings("dating");
  } else if (page === "post") {
    initPostForm();
  }
});
