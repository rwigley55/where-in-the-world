const searchInput = document.querySelector("[data-search]");
const cards = document.querySelectorAll(".country-box");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  cards.forEach((card) => {
    const countryName = card
      .querySelector(".card-title")
      .textContent.toLowerCase();

    const isVisible = countryName.includes(value);
    card.classList.toggle("hide", !isVisible);
  });
});
