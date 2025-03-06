document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dummyjson.com/products";
    const productList = document.getElementById("productList");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const sortBy = document.getElementById("sortBy");

    let products = [];

    // Fetch products from API
    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            products = data.products.slice(0, 20); // Limit to 20 products for better UI
            displayProducts(products);
            populateCategories();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Display products
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
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    // Populate category dropdown
    function populateCategories() {
        const uniqueCategories = [...new Set(products.map(p => p.category))]; // DummyJSON uses simple category strings
        uniqueCategories.forEach(category => {
            if (category) { // Ensure the category is valid
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            }
        });
    }

    // Filter by category
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        searchInput.value = ""; // Clear search
        sortBy.value = ""; // Reset sorting

        if (selectedCategory) {
            displayProducts(products.filter(p => p.category === selectedCategory));
        } else {
            displayProducts(products);
        }
    });

    // Search filter
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        sortBy.value = ""; // Reset sorting
        displayProducts(products.filter(p => p.title.toLowerCase().includes(searchTerm)));
    });

    // Sorting logic
    sortBy.addEventListener("change", () => {
        let sortedProducts = [...products];
        searchInput.value = ""; // Clear search
        categoryFilter.value = ""; // Reset category
        if (sortBy.value === "low-high") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy.value === "high-low") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        displayProducts(sortedProducts);
    });

    fetchProducts();
});
