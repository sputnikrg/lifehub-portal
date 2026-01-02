// assets/js/script.js

const STORAGE_KEY = "lifehub_user_ads_v1";

/* =========================
   БАЗОВЫЕ ОБЪЯВЛЕНИЯ
========================= */
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
    description: "Ideal für Singles, moderne Küche.",
    image: "assets/img/wohnung.jpg",
    createdAt: "2025-01-12"
  },
  {
    id: 3,
    type: "job",
    title: "Teilzeitjob im Supermarkt",
    city: "Weinstadt",
    salary: 14,
    description: "Flexible Zeiten, freundliches Team.",
    image: "assets/img/job.jpg",
    createdAt: "2025-01-15"
  },
  {
    id: 4,
    type: "dating",
    title: "Suche Freunde für Spaziergänge",
    city: "Stuttgart",
    age: 35,
    description: "Neu in Deutschland, offen für Kontakte.",
    image: "assets/img/dating.jpg",
    createdAt: "2025-01-16"
  }
];

/* =========================
   LOCAL STORAGE
========================= */
let userListings = [];

function loadUserListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) userListings = data;
  } catch (e) {
    console.error("LocalStorage read error", e);
  }
}

function saveUserListings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  } catch (e) {
    console.error("LocalStorage save error", e);
  }
}

/* =========================
   HELPERS
========================= */
function getDefaultImage(type) {
  if (type === "wohnung") return "assets/img/wohnung.jpg";
  if (type === "job") return "assets/img/job.jpg";
  if (type === "dating") return "assets/img/dating.jpg";
  return "assets/img/placeholder.jpg";
}

function getAllListings() {
  return [...defaultListings, ...userListings];
}

function getListingsByType(type) {
  return getAllListings().filter(item => item.type === type);
}

/* =========================
   RENDER
========================= */
function renderListings(type) {
  renderCustomListings(getListingsByType(type), type);
}

function renderCustomListings(items, type) {
  const container = document.getElementById("listing-container");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items.map(item => {
    const imgSrc = item.image || getDefaultImage(type);

    let meta = "";
    if (type === "wohnung") {
      meta = `${item.city} • ${item.price || "-"} € / Monat`;
    } else if (type === "job") {
      meta = `${item.city} • ab ${item.salary || "-"} € / Stunde`;
    } else if (type === "dating") {
      meta = `${item.city} • ${item.age || ""} Jahre`;
    }

    return `
      <article class="listing-card">
        <img src="${imgSrc}" class="listing-img" alt="${item.title}">
        <div class="listing-content">
          <h3>${item.title}</h3>
          <p class="listing-meta">${meta}</p>
          <p class="listing-desc">${item.description}</p>
        </div>
      </article>
    `;
  }).join("");
}

/* =========================
   FILTER: WOHNUNG
========================= */
function initWohnungFilters() {
  const form = document.getElementById("wohnungFilter");
  if (!form) return;

  const cityInput = document.getElementById("filterCity");
  const priceInput = document.getElementById("filterMaxPrice");
  const resetBtn = document.getElementById("filterReset");

  form.addEventListener("submit", e => {
    e.preventDefault();

    let items = getListingsByType("wohnung");

    const city = cityInput.value.trim().toLowerCase();
    const maxPrice = Number(priceInput.value);

    if (city) {
      items = items.filter(i =>
        i.city && i.city.toLowerCase().includes(city)
      );
    }

    if (!Number.isNaN(maxPrice) && maxPrice > 0) {
      items = items.filter(i => i.price <= maxPrice);
    }

    renderCustomListings(items, "wohnung");
  });

  resetBtn.addEventListener("click", () => {
    cityInput.value = "";
    priceInput.value = "";
    renderListings("wohnung");
  });
}

/* =========================
   FILTER: JOB
========================= */
function initJobFilters() {
  const form = document.getElementById("jobFilter");
  if (!form) return;

  const cityInput = document.getElementById("jobCity");
  const salaryInput = document.getElementById("jobMinSalary");
  const resetBtn = document.getElementById("jobFilterReset");

  form.addEventListener("submit", e => {
    e.preventDefault();

    let items = getListingsByType("job");

    const city = cityInput.value.trim().toLowerCase();
    const minSalary = Number(salaryInput.value);

    if (city) {
      items = items.filter(i =>
        i.city && i.city.toLowerCase().includes(city)
      );
    }

    if (!Number.isNaN(minSalary) && minSalary > 0) {
      items = items.filter(i => i.salary >= minSalary);
    }

    renderCustomListings(items, "job");
  });

  resetBtn.addEventListener("click", () => {
    cityInput.value = "";
    salaryInput.value = "";
    renderListings("job");
  });
}

/* =========================
   POST FORM
========================= */
function initPostForm() {
  const form = document.getElementById("adForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const title = document.getElementById("title").value.trim();
    const city = document.getElementById("city").value.trim();
    const description = document.getElementById("desc").value.trim();

    if (!title || !city || !description) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    userListings.push({
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
    });

    saveUserListings();
    alert("Anzeige gespeichert!");
    window.location.href = `${type}.html`;
  });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadUserListings();

  const page = document.body.dataset.page;
  if (!page) return;

  if (page === "wohnung") {
    renderListings("wohnung");
    initWohnungFilters();
  }

  if (page === "job") {
    renderListings("job");
    initJobFilters();
  }

  if (page === "dating") {
    renderListings("dating");
  }

  if (page === "post") {
    initPostForm();
  }
});
