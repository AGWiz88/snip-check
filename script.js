//element references
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const emptyMessage = document.getElementById("empty-message");
const stylistGrid = document.getElementById("stylist-grid");
const searchInput = document.getElementById("search-input");

const directoryView = document.getElementById("directory-view");
const detailView = document.getElementById("detail-view");
const backButton = document.getElementById("back-button");

const detailPhoto = document.getElementById("detail-photo");
const detailHeading = document.getElementById("detail-heading");
const detailSalon = document.getElementById("detail-salon");
const detailSpecialty = document.getElementById("detail-specialty");
const reviewList = document.getElementById("review-list");
const reviewForm = document.getElementById("review-form");

//app state
let allStylists = [];
let currentStylistId = null;

//placeholder avatar intitials generator
function avatarFor(name) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="100%" height="100%" fill="#91CDFF"/>
      <text x="50%" y="54%" font-size="72" font-family="sans-serif"
            fill="#DCE6EB" text-anchor="middle" dominant-baseline="middle">
        ${initials}
      </text>
    </svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

//adding items to a local list
//localStorage helpers for user-submitted reviews
function getStoredReviews() {
  try {
    const raw = localStorage.getItem("snipCheckReviews");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Could not read stored reviews:", err);
    return {};
  }
}

function saveStoredReview(stylistId, review) {
  const stored = getStoredReviews();
  if (!stored[stylistId]) stored[stylistId] = [];
  stored[stylistId].push(review);
  try {
    localStorage.setItem("snipCheckReviews", JSON.stringify(stored));
  } catch (err) {
    console.error("Could not save review:", err);
  }
}

function getAllReviewsFor(stylist) {
  const stored = getStoredReviews()[stylist.id] || [];
  return [...stylist.reviews, ...stored];
}

//async data feature, fetch
async function loadStylists() {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;
  stylistGrid.hidden = true;

  try {
    const response = await fetch("stylists.json");

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    allStylists = data;

    loadingMessage.hidden = true;
    stylistGrid.hidden = false;
    renderGrid(allStylists);
  } catch (err) {
    console.error("Failed to load stylists:", err);
    loadingMessage.hidden = true;
    errorMessage.hidden = false;
  }
}

function averageRating(stylist) {
  const reviews = getAllReviewsFor(stylist);
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
  return (total / reviews.length).toFixed(1);
}

//render, directory grid
function renderGrid(stylists) {
  stylistGrid.innerHTML = "";

  if (stylists.length === 0) {
    emptyMessage.hidden = false;
    return;
  }
  emptyMessage.hidden = true;

  stylists.forEach((stylist) => {
    const card = document.createElement("article");
    card.className = "stylist-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View profile for ${stylist.name}`);

    const avg = averageRating(stylist);
    const ratingText = avg ? `★ ${avg} (${getAllReviewsFor(stylist).length} reviews)` : "No reviews yet";

    card.innerHTML = `
      <img src="${avatarFor(stylist.name)}" alt="Portrait placeholder for ${stylist.name}" />
      <h3>${stylist.name}</h3>
      <p class="salon-line">${stylist.salon} — ${stylist.city}</p>
      <p class="specialty-line">${stylist.specialty}</p>
      <p class="rating-summary">${ratingText}</p>
    `;

    card.addEventListener("click", () => openDetailView(stylist.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetailView(stylist.id);
      }
    });

    stylistGrid.appendChild(card);
  });
}

//search filter 
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = allStylists.filter((stylist) => {
    return (
      stylist.name.toLowerCase().includes(query) ||
      stylist.salon.toLowerCase().includes(query) ||
      stylist.city.toLowerCase().includes(query)
    );
  });

  renderGrid(filtered);
});

//detail view
function openDetailView(stylistId) {
  const stylist = allStylists.find((s) => s.id === stylistId);
  if (!stylist) return;

  currentStylistId = stylistId;

  detailPhoto.src = avatarFor(stylist.name);
  detailPhoto.alt = `Portrait placeholder for ${stylist.name}`;
  detailHeading.textContent = stylist.name;
  detailSalon.textContent = `${stylist.salon} — ${stylist.city}`;
  detailSpecialty.textContent = stylist.specialty;

  renderReviews(stylist);

  directoryView.hidden = true;
  detailView.hidden = false;
  detailView.scrollIntoView({ behavior: "smooth", block: "start" });
}

//function that builds the review list inside the detail view
function renderReviews(stylist) {
  const reviews = getAllReviewsFor(stylist);
  reviewList.innerHTML = "";

  if (reviews.length === 0) {
    reviewList.innerHTML = "<li>No reviews yet — be the first to leave one!</li>";
    return;
  }

  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="review-meta">
        <span>${review.reviewer}</span>
        <span class="review-rating">★ ${review.rating}</span>
      </div>
      <p>${review.comment}</p>
    `;
    reviewList.appendChild(li);
  });
}

//back button so users can go back
backButton.addEventListener("click", () => {
  detailView.hidden = true;
  directoryView.hidden = false;
  renderGrid(allStylists.filter((s) => {
    const query = searchInput.value.trim().toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.salon.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query)
    );
  }));
});

//save new review when form is filled
//add to local storage
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("reviewer-name").value.trim();
  const rating = document.getElementById("reviewer-rating").value;
  const comment = document.getElementById("reviewer-comment").value.trim();

  if (!name || !rating || !comment) return;

  const newReview = { reviewer: name, rating: Number(rating), comment };
  saveStoredReview(currentStylistId, newReview);

  const stylist = allStylists.find((s) => s.id === currentStylistId);
  renderReviews(stylist);

  reviewForm.reset();
});

//call file that loads whole app
loadStylists();