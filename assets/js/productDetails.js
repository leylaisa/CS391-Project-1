document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id"); // extracts the product id from the url

  // get the elements
  const productImage = document.getElementById("productImage");
  const productTitle = document.getElementById("productTitle");
  const productDescription = document.getElementById("productDescription");
  const productPrice = document.getElementById("productPrice");
  const productDetail = document.getElementById("productDetail");
  const quantityInput = document.getElementById("quantityInput");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const goToCartBtn = document.getElementById("goToCartBtn");
  const totalAmountDiv = document.getElementById("totalAmount");

  let product = null; // to store the product details from api

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
    // the src of the product image
    productImage.src = product.images && product.images.length > 0 ? product.images[0] : product.thumbnail; // check if image arr. exists & has at least 1 img -> if yes, use the first img
    productTitle.textContent = product.title;
    productDescription.textContent = product.description;
    productPrice.textContent = `$${product.price.toFixed(2)}`;
  }

  // update the total
  function updateTotal() {
    const qty = parseInt(quantityInput.value, 10) || 0; // parse the input as an int (0 if invalid)
    const total = qty * product.price; // calculate the total
    totalAmountDiv.textContent = `Total: $${total.toFixed(2)}`; // display the total (0.00 format)
  }

  // add an item to the cart
  function addToCart() {
    const qty = parseInt(quantityInput.value, 10); // parse the input as an int
    // check if the qty is valid
    if (!qty || qty <= 0) {
      alert("Please select a valid quantity.");
      return;
    }
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || []; // get the shopping cart from local storage; parse from json or use an empty array
    const existingProductIndex = shoppingCart.findIndex(item => item.productId === product.id); // check if the profuct is already in the cart
    if (existingProductIndex !== -1) {
      shoppingCart[existingProductIndex].quantity += qty; // if exists, add more to the qty
    } else {
      shoppingCart.push({ productId: product.id, quantity: qty }); // if doesnt exist, add a new item w the qty 
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart)); // back to json and local storage
    alert("Product added to cart!");
  }

  // Event listeners
  quantityInput.addEventListener("input", updateTotal); //call updateTotal every time the value changes 
  addToCartBtn.addEventListener("click", addToCart); // call addToCart when this button is clicked
  goToCartBtn.addEventListener("click", () => { // go to shopping cart page wheen this button is clicked
    window.location.href = "shopping-cart.html";
  });

  fetchProduct();
});