# CS391-Project-1
This is the implementation of the first project assignment for the CS391 - Web Application Development course

Structure:
Products.html displays a list of products that are fetched from the JSON API. I implemented category filtering, keyword search and price sorting. Additionally, for convenience, I included a 'see more' button to load more products. *Changed default 30 item limit so all products are fetched.

Product-detail.html shows product info. On the left column, there is a product image. And the right column has the other product detaisl as well as the allowing selecting a qty and adding the item to the cart/going to cart. 

Shopping-cart.html shows the cart info and allows deleting, updating items and checking out which will clear the cart.

In Script.js I implemented product fetching, filtering, soeting & 'see more' logics.

The product detail and shopping cart logics are handled in productDetails.js.

Updating, deleting and checking out in cart is handled in shoppingCart.js.


Responsiveness:
I used bootstrap's responsive classes to adjust the num of products displayed based on the screen size. On xtra large screen there are 5 products in a row, and xtra small, 1 product in a row.

Filtering:
Changing category resets othre filters. When there is no category selected, sorting & searching will work independently. Reset btn clears all filters (added for convenience to prevent reloading)

Shopping cart:
Uses local storage to store data.

TO RUN:
- open Products.html in the browser
- select any filters if needed
- click any product to it's details (opens Product-detail.html)
- select a qty and add the product to the cart
- press go to cart btn to view the cart, delete or update items there, or checkout