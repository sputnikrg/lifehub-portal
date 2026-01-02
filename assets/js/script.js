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
    images: [
      "assets/img/wohnung.jpg",
      "assets/img/wohnung.jpg",
      "assets/img/wohnung.jpg"
    ],
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
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) userListings = data;
  } catch (e) {
    console.error(e);
  }
}

function saveUserListings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
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
  return getAllListings().filter(i => i.type === type);
}

function getListingImages(item) {
  if (Array.isArray(item.images) && item.images.length) {
    return item.images;
  }
  if (item.image) return [item.image];
  return [getDefaultImage(item.type)];
}

/* =========================
   RENDER LIST
========================= */
function renderListings(type) {
  renderCustomListings(getListingsByType(type), type);
}

function renderCustomListings(items, type) {
  const container = document.getElementById("listing-container");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items.map(item => {
    let meta = "";
    if (type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
    if (type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
    if (type === "dating") meta = `${item.city} • ${item.age} Jahre`;

    return `
      <article class="listing-card" onclick="openListing('${type}', ${item.id})">
        <img src="${getListingImages(item)[0]}" class="listing-img">
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
   SEARCH
========================= */
function initSearch(type) {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  if (!form || !input) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.toLowerCase();
    const items = getListingsByType(type).filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
    renderCustomListings(items, type);
  });
}

/* =========================
   DETAIL PAGE
========================= */
function openListing(type, id) {
  window.location.href = `listing.html?type=${type}&id=${id}`;
}

function getListingFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const id = Number(p.get("id"));
  const type = p.get("type");
  return getAllListings().find(i => i.id === id && i.type === type);
}

function setGalleryImage(src, el) {
  document.getElementById("galleryMain").src = src;
  document.querySelectorAll(".gallery-thumb").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function renderListingDetail() {
  const c = document.getElementById("listing-detail");
  if (!c) return;

  const item = getListingFromUrl();
  if (!item) {
    c.innerHTML = "<p>Anzeige nicht gefunden.</p>";
    return;
  }

  const images = getListingImages(item);

  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
  if (item.type === "dating") meta = `${item.city} • ${item.age} Jahre`;

  c.innerHTML = `
    <article class="listing-detail">
      <div class="gallery">
        <img src="${images[0]}" id="galleryMain" class="gallery-main">
        <div class="gallery-thumbs">
          ${images.map((img, i) => `
            <img src="${img}" class="gallery-thumb ${i === 0 ? "active" : ""}"
                 onclick="setGalleryImage('${img}', this)">
          `).join("")}
        </div>
      </div>
      <h1>${item.title}</h1>
      <p class="listing-meta">${meta}</p>
      <p class="listing-desc">${item.description}</p>
    </article>
  `;
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadUserListings();
  const page = document.body.dataset.page;

  if (page === "wohnung") {
    renderListings("wohnung");
    initSearch("wohnung");
  }

  if (page === "job") {
    renderListings("job");
    initSearch("job");
  }

  if (page === "dating") {
    renderListings("dating");
    initSearch("dating");
  }

  if (page === "listing") {
    renderListingDetail();
  }
});
