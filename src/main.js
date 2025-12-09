import COURSES from "../assets/courses.json";
import { CATEGORIES_COLORS } from "./settings";

const main = document.getElementById("root");
const searchInput = document.getElementById("search-input");
const search = document.getElementById("search");

const ACTIVE_CATEGORY_CLASS = "ghost-active";
const ALL_VALUE = "All";

let products, selectedCategoryElement;

function renderCards(collection) {
  main.innerHTML = "";
  collection.forEach((product) => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="card-info">
        <span class="card-tag badge badge--${CATEGORIES_COLORS[product.category?.toLowerCase()] ?? "orange"}">${product.category}</span>
        <h2 class="card-title head2">${product.title}</h2>
        <div>
          <span class="card-price">$${product.price}</span><span class="card-author">by ${product.author}</span>
        </div>
      </div>`;
    main.appendChild(card);
  });
}

function createTagElement(key, value) {
  const span = document.createElement("span");
  span.className = "ghost";
  span.innerHTML = `${key}${" "}<sup>${value}</sup>`;
  span.dataset.category = key;
  search.insertAdjacentElement("beforebegin", span);

  span.addEventListener("click", () => {
    span.classList.add(ACTIVE_CATEGORY_CLASS);
    selectedCategoryElement?.classList.remove(ACTIVE_CATEGORY_CLASS);
    selectedCategoryElement = span;
    filterCards();
  });
  return span;
}

function renderCategories(tags) {
  const categories = tags.reduce((result, tag) => {
    result[tag] = tag in result ? result[tag] + 1 : 1;
    return result;
  }, {});

  const allCategoryElement = createTagElement(
    ALL_VALUE,
    Object.keys(categories).length,
  );
  allCategoryElement.click();

  for (const [key, value] of Object.entries(categories)) {
    createTagElement(key, value);
  }
}

function filterCards() {
  const searchTerm = searchInput.value.toLowerCase();

  const selectedCategory = selectedCategoryElement.dataset.category;

  const filteredCards = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory && selectedCategory !== ALL_VALUE ?
        product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  renderCards(filteredCards);
}

searchInput.addEventListener("input", filterCards);
const { collection } = COURSES;

if (Array.isArray(collection)) {
  products = collection;
  renderCategories(collection.map((item) => item.category));
  renderCards(collection);
} else {
  console.log("Data is not an array, but an object:", collection);
}
