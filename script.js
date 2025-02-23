/* script.js */

document.addEventListener('DOMContentLoaded', () => {
  const dessertListContainer = document.getElementById('dessert-list');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartItemCountSpan = document.getElementById('cart-item-count');
  const totalPriceSpan = document.getElementById('total-price');
  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  const startNewOrderBtn = document.getElementById('start-new-order-btn');
  const orderConfirmationModal = document.getElementById('order-confirmation-modal');
  const modalCloseButton = orderConfirmationModal.querySelector('.close-button');
  const modalCartItemsContainer = document.getElementById('modal-cart-items');
  const modalTotalPriceSpan = document.getElementById('modal-total-price');
  const modalStartNewOrderBtn = document.getElementById('modal-start-new-order-btn');
  const emptyCartMessage = document.getElementById('empty-cart-message');

  let dessertData = [];
  let cartItems = [];

  // Function to fetch dessert data from data.json
  const fetchDessertData = async () => {
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      dessertData = await response.json();
      renderDessertList(dessertData);
    } catch (error) {
      console.error('Could not fetch dessert data:', error);
      dessertListContainer.innerHTML = '<p>Error loading desserts.</p>'; // Display error message in UI
    }
  };

  // Function to render the dessert list dynamically
  const renderDessertList = (desserts) => {
    dessertListContainer.innerHTML = ''; // Clear any existing content
    desserts.forEach(dessert => {
      const dessertItem = document.createElement('article');
      dessertItem.classList.add('dessert-item');
      dessertItem.dataset.dessertId = dessert.name; // Store dessert ID for easy access later

      const image = document.createElement('img');
      image.src = dessert.image.thumbnail; // Use thumbnail for now, will handle responsive images later
      image.alt = dessert.name;

      const name = document.createElement('h3');
      name.textContent = dessert.name;

      const category = document.createElement('p');
      category.classList.add('category');
      category.textContent = dessert.category;

      const price = document.createElement('p');
      price.classList.add('price');
      price.textContent = `$${dessert.price.toFixed(2)}`;

      const addToCartBtn = document.createElement('button');
      addToCartBtn.classList.add('add-to-cart-btn');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.addEventListener('click', () => {
        addToCart(dessert);
      });

      dessertItem.appendChild(image);
      dessertItem.appendChild(name);
      dessertItem.appendChild(category);
      dessertItem.appendChild(price);
      dessertItem.appendChild(addToCartBtn);

      dessertListContainer.appendChild(dessertItem);
    });
  };

  // Function to add item to cart
  const addToCart = (dessert) => {
    const existingCartItem = cartItems.find(item => item.name === dessert.name);

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      cartItems.push({
        ...dessert,
        quantity: 1
      });
    }
    updateCartDisplay();
    console.log('Cart Items:', cartItems); // For debugging and verification
  };
  
  // Function to display the order confirmation modal and populate it
  const displayOrderConfirmationModal = () => {
    orderConfirmationModal.style.display = 'flex'; // Show the modal
    renderModalCartItems(); // Populate cart items in modal
    modalTotalPriceSpan.textContent = totalPriceSpan.textContent; // Copy total price
  };



  
  // Function to render cart items in the order confirmation modal
  const renderModalCartItems = () => {
    modalCartItemsContainer.innerHTML = ''; // Clear previous modal cart items
    cartItems.forEach(item => {
      const modalItem = document.createElement('div');
      modalItem.classList.add('modal-cart-item'); // Add class for styling if needed

      const itemImage = document.createElement('img');
      itemImage.src = item.image.thumbnail; // Use thumbnail for modal
      itemImage.alt = item.name;
      itemImage.classList.add('modal-item-image'); // Add class for styling if needed

      const itemDetails = document.createElement('div');
      itemDetails.classList.add('modal-item-details'); // Add class for styling

      const itemName = document.createElement('p');
      itemName.textContent = item.name;
      itemName.classList.add('modal-item-name');

      const itemPriceQty = document.createElement('p');
      itemPriceQty.textContent = `${item.quantity}x @ $${item.price.toFixed(2)}`;
      itemPriceQty.classList.add('modal-item-price-qty');

      itemDetails.appendChild(itemName);
      itemDetails.appendChild(itemPriceQty);

      modalItem.appendChild(itemImage);
      modalItem.appendChild(itemDetails);

      modalCartItemsContainer.appendChild(modalItem);
    });
  };

  // Function to start a new order (clear cart and reset display)
  const startNewOrder = () => {
    cartItems = []; // Clear cart items array
    updateCartDisplay(); // Update cart display in main cart area
    orderConfirmationModal.style.display = 'none'; // Hide the modal if it's open
    modalCartItemsContainer.innerHTML = ''; // Clear modal cart items
    modalTotalPriceSpan.textContent = '0.00'; // Reset modal total price
  };
  
    // Function to remove item from cart
  const removeItemFromCart = (itemName) => {
    cartItems = cartItems.filter(item => item.name !== itemName); // Filter out item to remove
    updateCartDisplay(); // Re-render cart display
    console.log('Item removed. Cart Items:', cartItems); // For debugging
  };

  // Event listeners for buttons
  confirmOrderBtn.addEventListener('click', displayOrderConfirmationModal);
  startNewOrderBtn.addEventListener('click', startNewOrder);
  modalStartNewOrderBtn.addEventListener('click', startNewOrder);
  modalCloseButton.addEventListener('click', () => {
    orderConfirmationModal.style.display = 'none'; // Hide modal on close button click
  });
  
  // Function to update the cart display (renders cart items and adds remove functionality)
    const updateCartDisplay = () => {
        cartItemsContainer.innerHTML = ''; // Clear existing cart items in the display
        let cartQuantity = 0;
        let cartTotalPrice = 0;
  
        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block'; // Show empty cart message
        } else {
            emptyCartMessage.style.display = 'none'; // Hide empty cart message
  
            cartItems.forEach(item => {
                cartQuantity += item.quantity;
                cartTotalPrice += item.price * item.quantity;
  
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item'); // Add class for styling
  
                const itemNameElement = document.createElement('p');
                itemNameElement.classList.add('cart-item-name');
                itemNameElement.textContent = item.name;
  
                const itemPriceElement = document.createElement('p');
                itemPriceElement.classList.add('cart-item-price');
                itemPriceElement.textContent = `$${item.price.toFixed(2)}`;
  
                const itemQuantityElement = document.createElement('p');
                itemQuantityElement.classList.add('cart-item-quantity');
                itemQuantityElement.textContent = `Quantity: ${item.quantity}`; // For now, just display quantity
  
                const removeItemButton = document.createElement('button');
                removeItemButton.classList.add('remove-item-button');
                removeItemButton.textContent = 'X'; // Changed to "X" icon
                removeItemButton.addEventListener('click', () => {
                    removeItemFromCart(item.name); // Pass item name to remove function
                });
  
                cartItemElement.appendChild(itemNameElement);
                cartItemElement.appendChild(itemPriceElement);
                cartItemElement.appendChild(itemQuantityElement);
                cartItemElement.appendChild(removeItemButton);
  
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
  
        cartItemCountSpan.textContent = cartQuantity;
        totalPriceSpan.textContent = cartTotalPrice.toFixed(2);
  
        renderModalCartItems(); // Keep modal cart items in sync with main cart
    };


  // Initial data fetch and render
  fetchDessertData();
});