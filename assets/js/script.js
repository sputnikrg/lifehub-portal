// assets/js/script.js

// Временные тестовые объявления
// (потом заменим на реальные данные из базы)
const listings = [
  {
    id: 1,
    type: "wohnung",          // wohnung | job | dating
    title: "2-Zimmer Wohnung in Waiblingen",
    city: "Waiblingen",
    price: 850,
    description: "Helle, möblierte Wohnung, Nähe S-Bahn.",
    createdAt: "2025-01-10",
    image: "assets/img/wohnung.jpg"    // временно одна и та же картинка
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

// Получить объявления по типу
function getListingsByType(type) {
  return listings.filter(item => item.type === type);
}

// Отрисовать карточки на странице
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
              <p class="listing-meta">${item.city} • ${item.price} € / Monat</p>
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
              <p class="listing-meta">${item.city} • ab ${item.salary} € / Stunde</p>
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
              <p class="listing-meta">${item.city} • ${item.age} Jahre</p>
              <p class="listing-desc">${item.description}</p>
            </div>
          </article>
        `;
      }

      return "";
    })
    .join("");
}

// Инициализация в зависимости от страницы
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (!page) return;

  if (page === "wohnung") renderListings("wohnung");
  if (page === "job") renderListings("job");
  if (page === "dating") renderListings("dating");
});
