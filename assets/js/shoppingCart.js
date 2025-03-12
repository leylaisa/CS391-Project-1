document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cartContainer");
    const cartTotalElem = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
  
    // get the cart items from local storage
    let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  
    // get the item details
    async function fetchCartProducts() {
      if (shoppingCart.length === 0) {
        cartContainer.innerHTML = "<p>Your shopping cart is empty.</p>";
        cartTotalElem.textContent = "0.00";
        return;
      }
  
      // Map each cart item to a fetch promise for its product details
      const productPromises = shoppingCart.map(item =>
        fetch(`https://dummyjson.com/products/${item.productId}`).then(res => res.json())
      );
  
      // fetch all 
      const products = await Promise.all(productPromises);
  
      const cartItems = products.map(product => {
        const cartItem = shoppingCart.find(item => item.productId === product.id);
        return { ...product, quantity: cartItem.quantity };
      });
  
      displayCartItems(cartItems);
    }
  
    function displayCartItems(cartItems) {
      let html = `
        <table class="table align-middle">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      cartItems.forEach(item => {
        html += `
          <tr data-product-id="${item.id}">
            <td>
              <img src="${item.thumbnail}" alt="${item.title}" style="width: 80px; height: auto;">
            </td>
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" style="width: 80px;">
            </td>
            <td class="item-total">$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
              <button class="btn btn-sm btn-danger delete-btn">Delete</button>
            </td>
          </tr>
        `;
      });
  
      html += `
          </tbody>
        </table>
      `;
  
      cartContainer.innerHTML = html;
  
      // qty change and deletion events
      document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", onQuantityChange);
      });
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", onDeleteItem);
      });
  
      updateCartTotal();
    }
  
    function onQuantityChange(event) {
      const input = event.target;
      const newQty = parseInt(input.value, 10);
      if (newQty < 1) {
        input.value = 1;
        return;
      }
      const row = input.closest("tr");
      const productId = parseInt(row.getAttribute("data-product-id"), 10);
  
      // updates item qty
      const cartItem = shoppingCart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = newQty;
      }
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  
      // price for the row
      const priceText = row.children[2].textContent.replace('$', '');
      const price = parseFloat(priceText);
      const itemTotalCell = row.querySelector(".item-total");
      itemTotalCell.textContent = `$${(price * newQty).toFixed(2)}`;
  
      updateCartTotal();
    }
  
    // deletes an item from the cart
    function onDeleteItem(event) {
      const row = event.target.closest("tr");
      const productId = parseInt(row.getAttribute("data-product-id"), 10);
      shoppingCart = shoppingCart.filter(item => item.productId !== productId);
      localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
      fetchCartProducts();
    }
  
    // calculates the total price 
    function updateCartTotal() {
      const rows = document.querySelectorAll("tbody tr");
      let total = 0;
      rows.forEach(row => {
        const itemTotalText = row.querySelector(".item-total").textContent.replace('$', '');
        total += parseFloat(itemTotalText);
      });
      cartTotalElem.textContent = total.toFixed(2);
    }
  
    // clears the cart after checkout 
    checkoutBtn.addEventListener("click", () => {
      if (confirm("Proceed to checkout? This will clear your shopping cart.")) {
        localStorage.removeItem("shoppingCart");
        shoppingCart = [];
        alert("Checkout complete!");
        fetchCartProducts();
      }
    });
  
    fetchCartProducts();
  });