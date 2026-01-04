console.log("SCRIPT LOADED");

// =========================
// STORAGE KEYS
// =========================
const STORAGE_KEY = "lifehub_user_ads_v1";
const FAVORITES_KEY = "lifehub_favorites_v1";

// =========================
// FAVORITES HELPERS
// =========================
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

// ✅ ВАЖНО: отдельная функция, БЕЗ inline-логики
function removeFavoriteWithAnimation(btn, id) {
  toggleFavorite(id);

  const card = btn.closest(".listing-card");
  if (!card) return;

  card.classList.add("removing");

  setTimeout(() => {
    card.remove();
  }, 200);
}

function handleOpenListing(el) {
  const type = el.dataset.type;
  const id = el.dataset.id;

  openListing(type, id);
}

function handleToggleFavorite(btn) {
  const id = Number(btn.dataset.id);

  toggleFavorite(id);
  btn.classList.toggle("active");
}

// =========================
// BASE LISTINGS
// =========================
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
    ]
  },
  {
    id: 2,
    type: "wohnung",
    title: "1-Zimmer Apartment in Weinstadt",
    city: "Weinstadt",
    price: 620,
    description: "Ideal für Singles, moderne Küche.",
    image: "assets/img/wohnung.jpg"
  },
  {
    id: 3,
    type: "job",
    title: "Teilzeitjob im Supermarkt",
    city: "Weinstadt",
    salary: 14,
    description: "Flexible Zeiten, freundliches Team.",
    image: "assets/img/job.jpg"
  },
  {
    id: 4,
    type: "dating",
    title: "Suche Freunde für Spaziergänge",
    city: "Stuttgart",
    age: 35,
    description: "Neu in Deutschland, offen für Kontakte.",
    image: "assets/img/dating.jpg"
  }
];

// =========================
// HELPERS
// =========================
function getDefaultImage(type) {
  if (type === "wohnung") return "assets/img/wohnung.jpg";
  if (type === "job") return "assets/img/job.jpg";
  if (type === "dating") return "assets/img/dating.jpg";
  return "assets/img/placeholder.jpg";
}

function getAllListings() {
  return defaultListings;
}

function getListingImages(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images;
  if (item.image) return [item.image];
  return [getDefaultImage(item.type)];
}

function ListingCard(item, options = {}) {
  const { showRemove = false } = options;

  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
  if (item.type === "dating") meta = `${item.city} • ${item.age} Jahre`;

  return `
    <article class="listing-card">

      <div
        class="listing-click-area"
        data-action="open-listing"
        data-type="${item.type}"
        data-id="${item.id}"
      >
        <img src="${getListingImages(item)[0]}" class="listing-img">
        <div class="listing-content">
          <h3>${item.title}</h3>
          <p class="listing-meta">${meta}</p>
          <p class="listing-desc">${item.description}</p>
        </div>
      </div>

      <button
        class="fav-btn ${isFavorite(item.id) ? "active" : ""}"
        data-action="toggle-favorite"
        data-id="${item.id}"
      >
        ❤
      </button>

    </article>
  `;
}

// =========================
// RENDER LISTINGS
// =========================
function renderCustomListings(items, type) {

  const container = document.getElementById("listing-container");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items
    .map(item => ListingCard(item))
    .join("");

}

function renderListings(type) {
  const items = getAllListings().filter(item => item.type === type);
  renderCustomListings(items, type);
}

// =========================
// FAVORITES PAGE
// =========================
function renderFavorites() {
  const container = document.getElementById("listing-container");
  if (!container) return;

  const favIds = getFavorites();

  if (!favIds.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Keine Favoriten</h2>
        <p>Du hast noch keine Anzeigen gespeichert.</p>
        <a href="wohnung.html">Wohnungen ansehen</a>
      </div>
    `;
    return;
  }

  const items = getAllListings().filter(i => favIds.includes(i.id));

  container.innerHTML = items.map(item => {
    let meta = "";
    if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
    if (item.type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
    if (item.type === "dating") meta = `${item.city} • ${item.age} Jahre`;

    return `
      <article class="listing-card">
        <button class="fav-btn active"
          onclick="event.stopPropagation(); removeFavoriteWithAnimation(this, ${item.id})">
          ❤
        </button>

        <div onclick="openListing('${item.type}', ${item.id})">
          <img src="${getListingImages(item)[0]}" class="listing-img">
          <div class="listing-content">
            <h3>${item.title}</h3>
            <p class="listing-meta">${meta}</p>
            <p class="listing-desc">${item.description}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// =========================
// NAV / DETAIL
// =========================
function openListing(type, id) {
  window.location.href = `listing.html?type=${type}&id=${id}`;
}

function renderListingDetail() {
  const container = document.getElementById("listing-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const id = Number(params.get("id"));

  if (!type || !id) {
    container.innerHTML = "<p>Anzeige nicht gefunden.</p>";
    return;
  }

  const item = getAllListings().find(
    listing => listing.type === type && listing.id === id
  );

  if (!item) {
    container.innerHTML = "<p>Anzeige nicht gefunden.</p>";
    return;
  }

  let meta = "";
  if (type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
  if (type === "dating") meta = `${item.city} • ${item.age} Jahre`;

  container.innerHTML = `
    <article class="listing-detail">
      <img src="${getListingImages(item)[0]}" alt="">
      <h1>${item.title}</h1>
      <p class="listing-meta">${meta}</p>
      <p class="listing-desc">${item.description}</p>

      <button
        class="fav-btn big ${isFavorite(item.id) ? "active" : ""}"
        data-action="toggle-favorite"
        data-type="${item.type}"
        data-id="${item.id}"
      >
        ❤ Zu Favoriten
      </button>

    </article>
  `;
}

function markActiveFilters(form) {
  if (!form) return;

  let hasActive = false;

  form.querySelectorAll("input").forEach(input => {
    if (input.value.trim() !== "") {
      input.classList.add("active");
      hasActive = true;
    } else {
      input.classList.remove("active");
    }
  });

  form.classList.toggle("active", hasActive);
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "wohnung") {
    renderListings("wohnung");
    initSearch("wohnung");

    const wohnungFilter = document.getElementById("wohnungFilter");
    if (wohnungFilter) {
      wohnungFilter.addEventListener("input", () => {
        markActiveFilters(wohnungFilter);
      });

      wohnungFilter.addEventListener("reset", () => {
        setTimeout(() => markActiveFilters(wohnungFilter));
      });
    }
  }
  if (page === "job") {
    renderListings("job");
    initSearch("job");

    const jobFilter = document.getElementById("jobFilter");
    if (jobFilter) {
      jobFilter.addEventListener("input", () => {
        markActiveFilters(jobFilter);
      });

      jobFilter.addEventListener("reset", () => {
        setTimeout(() => markActiveFilters(jobFilter));
      });
    }
  }

  if (page === "dating") renderListings("dating");
  if (page === "favorites") renderFavorites();
  if (page === "listing") renderListingDetail();
});

document.addEventListener("click", function (event) {
  const el = event.target.closest("[data-action]");
  if (!el) return;

  const action = el.dataset.action;

  if (action === "toggle-favorite") {
    handleToggleFavorite(el);
  }

  if (action === "open-listing") {
    handleOpenListing(el);
  }

});

