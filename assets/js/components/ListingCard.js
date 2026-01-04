import { isFavorite } from "../store.js";

// =========================
// ListingCard component
// =========================
export function ListingCard(item) {
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
        <img src="${item.image || "assets/img/placeholder.jpg"}" class="listing-img">
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
