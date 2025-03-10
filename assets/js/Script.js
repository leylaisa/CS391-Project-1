document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dummyjson.com/products";
    const productList = document.getElementById("productList");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const sortBy = document.getElementById("sortBy");
    const seeMoreBtn = document.getElementById("seeMoreBtn");
  
    let products = [];
    let itemsToShow = 20; // Initial number of items to display
  
    // Fetch products from API
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data.products; // Store all products from API
        applyFilters();
        populateCategories();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  
    // Display products in the grid
    function displayProducts(filteredProducts) {
      productList.innerHTML = "";
      filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col");
        productCard.innerHTML = `
          <div class="card h-100 shadow-sm">
            <a href="product-detail.html?id=${product.id}">
              <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
              <div class="card-body text-center">
                <h6 class="card-title">${product.title}</h6>
                <p class="text-danger fw-bold">$${product.price.toFixed(2)}</p>
              </div>
            </a>
          </div>
        `;
        productList.appendChild(productCard);
      });
    }
  
    // Populate category dropdown
    function populateCategories() {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      uniqueCategories.forEach(category => {
        if (category) {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
        }
      });
    }
  
    // Apply filters and sorting; limit items shown if no category is selected.
    function applyFilters() {
      let filtered = products;
      const category = categoryFilter.value;
      const keyword = searchInput.value.toLowerCase();
      const sort = sortBy.value;
  
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }
      if (keyword) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword));
      }
      if (sort === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
      }
  
      // If no category is selected, limit the number of items displayed.
      if (!category) {
        const totalFiltered = filtered.length;
        filtered = filtered.slice(0, itemsToShow);
        // Show "See More" if there are more items to load.
        if (totalFiltered > itemsToShow) {
          seeMoreBtn.style.display = "block";
        } else {
          seeMoreBtn.style.display = "none";
        }
      } else {
        // Hide the "See More" button when a category is active.
        seeMoreBtn.style.display = "none";
      }
      displayProducts(filtered);
    }
  
    // Event Listeners
  
    // Category filter resets keyword and sorting.
    categoryFilter.addEventListener("change", () => {
      searchInput.value = "";
      sortBy.value = "";
      itemsToShow = 20; // Reset the number of items to show
      applyFilters();
    });
  
    // Search input does not reset other filters.
    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  
    // Sorting changes do not reset the keyword.
    sortBy.addEventListener("change", () => {
      applyFilters();
    });
  
    // "See More" button loads additional items.
    seeMoreBtn.addEventListener("click", () => {
      itemsToShow += 20;
      applyFilters();
    });
  
    fetchProducts();
  });