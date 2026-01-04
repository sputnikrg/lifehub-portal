// =========================
// FAVORITES STORE
// =========================

const FAVORITES_KEY = "lifehub_favorites_v1";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}
