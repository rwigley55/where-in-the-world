const regionFilter = document.querySelector("#region-filter");

regionFilter.addEventListener("change", () => {
  const selectedRegion = regionFilter.value.toLowerCase();

  cards.forEach((card) => {
    const countryRegion = card
      .querySelector(".country-region")
      .textContent.toLowerCase();

    const isRegionVisible =
      selectedRegion === "" || countryRegion.includes(selectedRegion);

    card.classList.toggle("hide", !isRegionVisible);
  });
});
