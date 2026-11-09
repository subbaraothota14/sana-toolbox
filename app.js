document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("search");
  var resultCount = document.getElementById("result-count");
  var emptyState = document.getElementById("empty-state");
  var clearButton = document.getElementById("clear-filters");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".tool-card"));

  function checkedValues(name) {
    return Array.prototype.slice
      .call(document.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (box) { return box.value; });
  }

  function applyFilters() {
    var query = searchInput.value.trim().toLowerCase();
    var pricing = checkedValues("pricing");
    var platforms = checkedValues("platform");
    var categories = checkedValues("category");
    var visible = 0;

    cards.forEach(function (card) {
      var searchText = (card.getAttribute("data-search") || "").toLowerCase();
      var cardPricing = card.getAttribute("data-pricing") || "";
      var cardPlatforms = (card.getAttribute("data-platforms") || "").split(" ").filter(Boolean);
      var cardCategory = card.getAttribute("data-category") || "";

      var matchSearch = !query || searchText.indexOf(query) !== -1;
      var matchPricing = pricing.length === 0 || pricing.indexOf(cardPricing) !== -1;
      var matchPlatform =
        platforms.length === 0 ||
        platforms.some(function (p) { return cardPlatforms.indexOf(p) !== -1; });
      var matchCategory = categories.length === 0 || categories.indexOf(cardCategory) !== -1;

      var show = matchSearch && matchPricing && matchPlatform && matchCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });

    resultCount.textContent = "Showing " + visible + " of " + cards.length + " tools";
    emptyState.hidden = visible !== 0;
  }

  searchInput.addEventListener("input", applyFilters);
  document.querySelectorAll(".filters input").forEach(function (box) {
    box.addEventListener("change", applyFilters);
  });


  // Category hub cards: filter to one category and jump to the grid.
  document.querySelectorAll(".category-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var value = card.getAttribute("data-filter-category");
      document.querySelectorAll('input[name="category"]').forEach(function (box) {
        box.checked = box.value === value;
      });
      applyFilters();
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("browse").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    document.querySelectorAll(".filters input").forEach(function (box) {
      box.checked = false;
    });
    applyFilters();
    searchInput.focus();
  });
});
