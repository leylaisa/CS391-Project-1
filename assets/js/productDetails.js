document.addEventListener("DOMContentLoaded", () => {
    // Parse the product ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
    // Get DOM elements
    const productImage = document.getElementById("productImage");
    const productTitle = document.getElementById("productTitle");
    const productDescription = document.getElementById("productDescription");
    const productPrice = document.getElementById("productPrice");
    const productDetail = document.getElementById("productDetail");
    const quantityInput = document.getElementById("quantityInput");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const goToCartBtn = document.getElementById("goToCartBtn");
    const totalAmountDiv = document.getElementById("totalAmount");
  
    let product = null;
  
    // Fetch product details from DummyJSON API
    async function fetchProduct() {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        product = await response.json();
        displayProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
  
    // Display product details on the page
    function displayProduct(product) {
      // Use first image from images array if available; otherwise fallback to thumbnail.
      productImage.src = product.images && product.images.length > 0 ? product.images[0] : product.thumbnail;
      productTitle.textContent = product.title;
      productDescription.textContent = product.description;
      productPrice.textContent = `$${product.price.toFixed(2)}`;
      // Do not update total here; keep it at $0.00 until quantity input is provided.
    }
  
    // Update total amount based on the selected quantity
    function updateTotal() {
      const qty = parseInt(quantityInput.value, 10) || 0;
      const total = qty * product.price;
      totalAmountDiv.textContent = `Total: $${total.toFixed(2)}`;
    }
  
    // Add product to shopping cart (stored in localStorage)
    function addToCart() {
      const qty = parseInt(quantityInput.value, 10);
      if (!qty || qty <= 0) {
        alert("Please select a valid quantity.");
        return;
      }
      let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
      const existingProductIndex = shoppingCart.findIndex(item => item.productId === product.id);
      if (existingProductIndex !== -1) {
        shoppingCart[existingProductIndex].quantity += qty;
      } else {
        shoppingCart.push({ productId: product.id, quantity: qty });
      }
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      alert("Product added to cart!");
    }
  
    // Event listeners
    quantityInput.addEventListener("input", updateTotal);
    addToCartBtn.addEventListener("click", addToCart);
    goToCartBtn.addEventListener("click", () => {
      window.location.href = "shopping-cart.html";
    });
  
    // Initialize the page by fetching the product details
    fetchProduct();
  });