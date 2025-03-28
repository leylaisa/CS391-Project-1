document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dummyjson.com/products";
    // get the elements
    const productList = document.getElementById("productList");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const sortBy = document.getElementById("sortBy");
    const seeMoreBtn = document.getElementById("seeMoreBtn");
  
    let products = []; // to store all products fetched form the api 
    let itemsToShow = 20; // initial num of items to displau 
  
    // fetch products from the api
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data.products; 
        applyFilters();
        getCategories();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  
    // display products
    function displayProducts(filteredProducts) {
      productList.innerHTML = ""; // clear at first 
      filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col"); // bootstrap grid class for responsiveness 
        productCard.innerHTML = `
          <div class="card h-100 shadow-sm">
            <a href="product-detail.html?id=${product.id}"> // goes to the product detail page
              <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
              <div class="card-body text-center">
                <h6 class="card-title">${product.title}</h6>
                <p class="text-danger fw-bold">$${product.price.toFixed(2)}</p>
              </div>
            </a>
          </div>
        `;
        productList.appendChild(productCard); // add the new card to the product list
      });
    }
  
    function getCategories() {
      const uniqueCategories = [...new Set(products.map(p => p.category))]; // map to get the category of each product; Set (no repetition); back to arr
      uniqueCategories.forEach(category => {
        if (category) {
          const option = document.createElement("option"); // create a new element
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option); // add the new opttion to the dropdown with categories
        }
      });
    }
  
    // filtering
    function applyFilters() {
      let filtered = products; // all products
      const category = categoryFilter.value; // get the curr. category
      const keyword = searchInput.value.toLowerCase(); // get the search from the input (case insensitive)
      const sort = sortBy.value; // get the curr. sorting option
  
      // if a cat. is selected
      if (category) {
        filtered = filtered.filter(p => p.category === category); // filter products by matching category
      }
      // if there is a keyword input
      if (keyword) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword)); // include only products with the keyword in the title 
      }
      // sorting
      if (sort === "low-high") {
        filtered.sort((a, b) => a.price - b.price); // artan fiyatla siralama
      } else if (sort === "high-low") {
        filtered.sort((a, b) => b.price - a.price); // azalan fiyatla siralama
      }
  
      // no cat. is selected
      if (!category) {
        const totalFiltered = filtered.length; // num of filtered products 
        filtered = filtered.slice(0, itemsToShow); // show only the first items
        // show the button if there are more items to display
        if (totalFiltered > itemsToShow) { // if there are more items to dispkay
          seeMoreBtn.style.display = "block"; // show the btn
        } else { // if no more items to display
          seeMoreBtn.style.display = "none";  // hide the btn
        }
      } else {
        // hide the button
        seeMoreBtn.style.display = "none";
      }
      displayProducts(filtered); // display the filtered products
    }
  
    // event listeners
  
    // when a new category is selected, the other filters are reset
    categoryFilter.addEventListener("change", () => {
      searchInput.value = ""; // reset searcg
      sortBy.value = ""; // reset sorting
      itemsToShow = 20; // reset the num of items to display
      applyFilters(); // apply the filters
    });
  
    // searching won't reseet the other filters 
    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  
    // sorting won't reset the other filters
    sortBy.addEventListener("change", () => {
      applyFilters();
    });
  
    // button to load more items 
    seeMoreBtn.addEventListener("click", () => {
      itemsToShow += 20; // increase the num of items to show
      applyFilters();
    });
  
    fetchProducts();
  });