// script.js - логика портала LifeHub

const STORAGE_KEY = 'lifehub_user_ads_v1';

// Базовые (демо) объявления, которые "зашиты" в сайт
const defaultListings = [
  {
    id: 1,
    type: "wohnung",
    title: "2-Zimmer Wohnung in Waiblingen",
    city: "Waiblingen",
    price: 850,
    description: "Helle, möblierte Wohnung, Nähe S-Bahn.",
    createdAt: "2025-01-10",
    image: "assets/img/wohnung.jpg"
  },
  {
    id: 2,
    type: "wohnung",
    title: "1-Zimmer Apartment in Weinstadt",
    city: "Weinstadt",
    price: 620,
    description: "Ideal für Singles, warm, moderne Küche.",
    createdAt: "2025-01-12",
    image: "assets/img/wohnung.jpg"
  },
  {
    id: 3,
    type: "job",
    title: "Teilzeitjob im Supermarkt",
    city: "Weinstadt",
    salary: 14,
    description: "Kassierer/in oder Warenverräumer/in, flexible Zeiten.",
    createdAt: "2025-01-15",
    image: "assets/img/job.jpg"
  },
  {
    id: 4,
    type: "dating",
    title: "Suche Freunde für Spaziergänge",
    city: "Stuttgart",
    age: 35,
    description: "Neu in Deutschland, möchte neue Leute kennenlernen.",
    createdAt: "2025-01-16",
    image: "assets/img/dating.jpg"
  }
];

// Объявления, которые добавляет пользователь (будут храниться в localStorage)
let userListings = [];

function loadUserListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      userListings = data;
    }
  } catch (err) {
    console.error("Fehler beim Lesen von localStorage", err);
  }
}

function saveUserListings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  } catch (err) {
    console.error("Fehler beim Speichern in localStorage", err);
  }
}

function getAllListings() {
  return [...defaultListings, ...userListings];
}

function getListingsByType(type) {
  return getAllListings().filter(item => item.type === type);
}

function renderListings(type) {
  const container = document.getElementById("listing-container");
  if (!container) return;

  const items = getListingsByType(type);

  if (items.length === 0) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items
    .map(item => {
      if (type === "wohnung") {
        return `
          <article class="listing-card">
            <img src="${item.image}" class="listing-img" alt="${item.title}">
            <div class="listing-content">
              <h3>${item.title}</h3>
              <p class="listing-meta">${item.city} • ${item.price || "-"} € / Monat</p>
              <p class="listing-desc">${item.description}</p>
            </div>
          </article>
        `;
      }

      if (type === "job") {
        return `
          <article class="listing-card">
            <img src="${item.image}" class="listing-img" alt="${item.title}">
            <div class="listing-content">
              <h3>${item.title}</h3>
              <p class="listing-meta">${item.city} • ab ${item.salary || "-"} € / Stunde</p>
              <p class="listing-desc">${item.description}</p>
            </div>
          </article>
        `;
      }

      if (type === "dating") {
        return `
          <article class="listing-card">
            <img src="${item.image}" class="listing-img" alt="${item.title}">
            <div class="listing-content">
              <h3>${item.title}</h3>
              <p class="listing-meta">${item.city} • ${item.age || ""} Jahre</p>
              <p class="listing-desc">${item.description}</p>
            </div>
          </article>
        `;
      }

      return "";
    })
    .join("");
}

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
      image:
        type === "wohnung"
          ? "assets/img/wohnung.jpg"
          : type === "job"
          ? "assets/img/job.jpg"
          : "assets/img/dating.jpg",
      createdAt: new Date().toISOString().slice(0, 10)
    };

    userListings.push(newAd);
    saveUserListings();

    alert("Anzeige gespeichert!");
    window.location.href = type + ".html";
  });
}

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

