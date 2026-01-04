import { isFavorite } from "../store.js";

// =========================
// ListingDetail component
// =========================
export function ListingDetail(item) {
  let meta = "";
  if (item.type === "wohnung") meta = `${item.city} • ${item.price} € / Monat`;
  if (item.type === "job") meta = `${item.city} • ab ${item.salary} € / Stunde`;
  if (item.type === "dating") meta = `${item.city} • ${item.age} Jahre`;

  return `
    <article class="listing-detail">
      <img src="${item.image || "assets/img/placeholder.jpg"}">
      <h1>${item.title}</h1>
      <p class="listing-meta">${meta}</p>
      <p>${item.description}</p>

      <button
        class="fav-btn big ${isFavorite(item.id) ? "active" : ""}"
        data-action="toggle-favorite"
        data-id="${item.id}"
      >
        ❤ Zu Favoriten
      </button>
    </article>
  `;
}
