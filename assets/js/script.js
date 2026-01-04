import { getFavorites, isFavorite, toggleFavorite } from "./store.js";
import { listings } from "./data.js";
import { ListingCard } from "./components/ListingCard.js";
import { ListingDetail } from "./components/ListingDetail.js";

console.log("SCRIPT LOADED");


// =========================
// HELPERS
// =========================
function getAllListings() {
  return listings;
}

function getListingImage(item) {
  return item.image || "assets/img/placeholder.jpg";
}

// =========================
// RENDER LISTINGS
// =========================
function renderListings(type) {
  const container = document.getElementById("listing-container");
  if (!container) return;

  const items = getAllListings().filter(item => item.type === type);

  if (!items.length) {
    container.innerHTML = "<p>Keine Einträge gefunden.</p>";
    return;
  }

  container.innerHTML = items.map(item => ListingCard(item)).join("");
}

// =========================
// FAVORITES PAGE
// =========================
function renderFavorites() {
  const container = document.getElementById("listing-container");
  if (!container) return;

  const favIds = getFavorites();
  const items = getAllListings().filter(item => favIds.includes(item.id));

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Keine Favoriten</h2>
        <p>Du hast noch keine Anzeigen gespeichert.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => ListingCard(item)).join("");
}

// =========================
// DETAIL PAGE
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

  const item = getAllListings().find(
    i => i.type === type && i.id === id
  );

  if (!item) {
    container.innerHTML = "<p>Anzeige nicht gefunden.</p>";
    return;
  }

  container.innerHTML = ListingDetail(item);
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "wohnung") renderListings("wohnung");
  if (page === "job") renderListings("job");
  if (page === "dating") renderListings("dating");
  if (page === "favorites") renderFavorites();
  if (page === "listing") renderListingDetail();
});

// =========================
// GLOBAL CLICK HANDLER
// =========================
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;

  const action = el.dataset.action;

  if (action === "toggle-favorite") {
    toggleFavorite(Number(el.dataset.id));

    // если мы на странице Favorites — перерисовываем список
    if (document.body.dataset.page === "favorites") {
      renderFavorites();
      return;
    }

    // на остальных страницах просто переключаем сердечко
    el.classList.toggle("active");
  }

  if (action === "open-listing") {
    openListing(el.dataset.type, el.dataset.id);
  }
});
