const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");
const destinationInput = document.querySelector("#destination");
const checkInInput = document.querySelector("#checkIn");
const checkOutInput = document.querySelector("#checkOut");
const tripTypeInput = document.querySelector("#tripType");
const hotelCards = [...document.querySelectorAll(".hotel-card")];
const emptyHotels = document.querySelector("#emptyHotels");
const quickSearchForm = document.querySelector("#quickSearchForm");
const siteSearch = document.querySelector("#siteSearch");
const hotelDialog = document.querySelector("#hotelDialog");
const accountDialog = document.querySelector("#accountDialog");
const toast = document.querySelector("#toast");
let toastTimer;
let selectedHotelLocation = "";

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function filterHotels(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  let visibleCount = 0;

  hotelCards.forEach((card) => {
    const matches = !normalizedQuery || card.dataset.search.includes(normalizedQuery);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  emptyHotels.hidden = visibleCount !== 0;
  return visibleCount;
}

function setBookingMessage(message, isError = false) {
  bookingMessage.textContent = message;
  bookingMessage.classList.toggle("is-error", isError);
}

function scrollToHotels() {
  document.querySelector("#hotels").scrollIntoView({ behavior: "smooth", block: "start" });
}

const today = localDateString(new Date());
checkInInput.min = today;
checkOutInput.min = today;

checkInInput.addEventListener("change", () => {
  checkOutInput.min = checkInInput.value || today;
  if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
    checkOutInput.value = "";
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  if (tripTypeInput.value !== "Hotel") {
    setBookingMessage("Flight and vacation searches are a visual demo. Choose Hotels to search the available stays.", true);
    return;
  }

  if (checkOutInput.value <= checkInInput.value) {
    setBookingMessage("Check-out must be at least one day after check-in.", true);
    checkOutInput.focus();
    return;
  }

  const destination = destinationInput.value.trim();
  const resultCount = filterHotels(destination);
  const checkIn = new Date(`${checkInInput.value}T00:00:00`);
  const checkOut = new Date(`${checkOutInput.value}T00:00:00`);
  const nights = Math.round((checkOut - checkIn) / 86400000);
  const guests = Number(new FormData(bookingForm).get("guests"));

  if (resultCount) {
    setBookingMessage(`${resultCount} ${resultCount === 1 ? "stay" : "stays"} for ${guests} ${guests === 1 ? "guest" : "guests"} · ${nights} ${nights === 1 ? "night" : "nights"} in ${destination}.`);
  } else {
    setBookingMessage(`No stays found for "${destination}". Try Mumbai, Zurich, or Melbourne.`);
  }
  scrollToHotels();
});

quickSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = siteSearch.value.trim();
  if (!query) {
    siteSearch.focus();
    return;
  }
  destinationInput.value = query;
  const resultCount = filterHotels(query);
  setBookingMessage(resultCount
    ? `${resultCount} ${resultCount === 1 ? "stay" : "stays"} found for "${query}". Add dates to complete your search.`
    : `No stays found for "${query}". Try Mumbai, Zurich, or Melbourne.`);
  scrollToHotels();
});

document.querySelectorAll("[data-booking-type]").forEach((link) => {
  link.addEventListener("click", () => {
    tripTypeInput.value = link.dataset.bookingType;
    setBookingMessage(`${link.dataset.bookingType} search is a visual demo. Hotel stays are available to explore below.`);
  });
});

document.querySelectorAll(".details-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = document.querySelector("#dialogImage");
    document.querySelector("#dialogTitle").textContent = button.dataset.hotel;
    document.querySelector("#dialogLocation").textContent = button.dataset.location;
    document.querySelector("#dialogPrice").textContent = `${button.dataset.price} / night`;
    image.src = button.dataset.image;
    image.alt = button.dataset.hotel;
    selectedHotelLocation = button.dataset.location.split(",")[0];
    hotelDialog.showModal();
  });
});

document.querySelector("#dialogBook").addEventListener("click", () => {
  hotelDialog.close();
  tripTypeInput.value = "Hotel";
  destinationInput.value = selectedHotelLocation;
  document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
  destinationInput.focus({ preventScroll: true });
});

document.querySelectorAll("[data-deal]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.deal;
    tripTypeInput.value = "Hotel";
    destinationInput.value = destination;
    setBookingMessage(`${destination} escape selected. Choose your dates to search available stays.`);
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
    destinationInput.focus({ preventScroll: true });
  });
});

document.querySelectorAll("[data-account]").forEach((button) => {
  button.addEventListener("click", () => {
    const isAccount = button.dataset.account === "account";
    document.querySelector("#accountTitle").textContent = isAccount
      ? "Your trips, all in one place."
      : "Your next trip is closer.";
    document.querySelector("#accountMessage").textContent = "";
    accountDialog.showModal();
  });
});

document.querySelector("#accountForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  document.querySelector("#accountMessage").textContent = "This sign-in is a frontend demo. Account services are not connected.";
});

document.querySelector("#subscribeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  document.querySelector("#subscribeMessage").textContent = "Thanks! Newsletter sign-up is a demo and your email was not sent.";
  event.currentTarget.reset();
});

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mainNav.classList.remove("is-open");
  });
});