document.addEventListener("DOMContentLoaded", () => {
  // get the elements
  const cartContainer = document.getElementById("cartContainer");
  const cartTotalElem = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // get the cart items from local storage
  let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || []; // either parse json into array or empty arr

  // get the item details
  async function fetchCartProducts() {
    if (shoppingCart.length === 0) { // if the cart's empt 
      cartContainer.innerHTML = "<p>Your shopping cart is empty.</p>"; // displays a msg 
      cartTotalElem.textContent = "0.00"; // set total to 0.00
      return;
    }

    // map each cart item to a fetch promise for its product details
    const productPromises = shoppingCart.map(item =>
      fetch(`https://dummyjson.com/products/${item.productId}`).then(res => res.json()) // fetches the product details; convert to json 
    );

    // fetch all 
    const products = await Promise.all(productPromises);

    const cartItems = products.map(product => { // map each product to a cart item
      const cartItem = shoppingCart.find(item => item.productId === product.id); // find the cart item
      return { ...product, quantity: cartItem.quantity }; // return the new obj with product det-s and qty
    });

    displayCartItems(cartItems);
  }

  function displayCartItems(cartItems) {
    // for table representation
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
      // add a row for each item 
      html += `
          <tr data-product-id="${item.id}"> <!-- data = product id (so that it;s easier to find the row for updates/deletions) -->
            <td>
              <img src="${item.thumbnail}" alt="${item.title}" style="width: 80px; height: auto;">
            </td>
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" style="width: 80px;"> <!-- input for qty -->
            </td>
            <td class="item-total">$${(item.price * item.quantity).toFixed(2)}</td> <!-- total price -->
            <td>
              <button class="btn btn-sm btn-danger delete-btn">Delete</button> <!-- delete btn -->
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
      input.addEventListener("change", onQtyChange);
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", onDeleteItem);
    });

    updateCartTotal();
  }

  function onQtyChange(event) {
    const input = event.target;
    const newQty = parseInt(input.value, 10); // convert input qty to int 
    // if qty is less than 1, reeset it to 1
    if (newQty < 1) {
      input.value = 1;
      return;
    }
    const row = input.closest("tr"); // find the closest row with the input 
    const productId = parseInt(row.getAttribute("data-product-id"), 10); // get the prod. id from the row; convert to int

    // updates item qty
    const cartItem = shoppingCart.find(item => item.productId === productId); // find the cart item with the prod id
    if (cartItem) {
      cartItem.quantity = newQty; //update to new value if exists
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart)); // update the local storage

    // price for the row
    const priceText = row.children[2].textContent.replace('$', ''); // get the price text from the row
    const price = parseFloat(priceText);
    const itemTotalCell = row.querySelector(".item-total"); // get the item total cell
    itemTotalCell.textContent = `$${(price * newQty).toFixed(2)}`; // set the new total price

    updateCartTotal();
  }

  // deletes an item from the cart
  function onDeleteItem(event) {
    const row = event.target.closest("tr"); // find the row w the delete btn
    const productId = parseInt(row.getAttribute("data-product-id"), 10); // get the prod id from the row
    shoppingCart = shoppingCart.filter(item => item.productId !== productId); // filter out the item with the prod id
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart)); // update the local storage
    fetchCartProducts();
  }

  // calculates the total price 
  function updateCartTotal() {
    const rows = document.querySelectorAll("tbody tr"); // get all the rows
    let total = 0; // for total price
    rows.forEach(row => {
      const itemTotalText = row.querySelector(".item-total").textContent.replace('$', ''); // get the total price text
      total += parseFloat(itemTotalText); // convert & add to total
    });
    cartTotalElem.textContent = total.toFixed(2); // set the total price
  }

  // clears the cart after checkout 
  checkoutBtn.addEventListener("click", () => {
    if (confirm("Proceed to checkout? This will clear your shopping cart.")) {
      localStorage.removeItem("shoppingCart"); // remove the cart from local storage
      shoppingCart = []; // reset the cart
      alert("Checkout complete!");
      fetchCartProducts();
    }
  });

  fetchCartProducts();
});