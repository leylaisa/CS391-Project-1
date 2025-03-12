document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
  
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
  
    // fetch product details from API
    async function fetchProduct() {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        product = await response.json();
        displayProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
  
    // show product details
    function displayProduct(product) {
      productImage.src = product.images && product.images.length > 0 ? product.images[0] : product.thumbnail;
      productTitle.textContent = product.title;
      productDescription.textContent = product.description;
      productPrice.textContent = `$${product.price.toFixed(2)}`;
    }
  
    // update the total
    function updateTotal() {
      const qty = parseInt(quantityInput.value, 10) || 0;
      const total = qty * product.price;
      totalAmountDiv.textContent = `Total: $${total.toFixed(2)}`;
    }
  
    // add an item to the cart
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
  
    fetchProduct();
  });