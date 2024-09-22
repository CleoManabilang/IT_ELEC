
const groceryList = document.getElementById('grocery-list');
const groceryForm = document.getElementById('grocery-form');
const categoryFilter = document.getElementById('category-filter');
const searchBar = document.getElementById('search_bar');
let editingItem = null;

//existing items local storage
function loadItems() {
    groceryList.innerHTML = ''; // Clear existing items
    const items = JSON.parse(localStorage.getItem('groceryItems')) || [];
    const filteredItems = filterItems(items);
    const searchedItems = searchItems(filteredItems);
    searchedItems.forEach(item => displayItem(item));
}

// FILTERING selected category
function filterItems(items) {
    const selectedCategory = categoryFilter.value;
    return selectedCategory === 'all' ? items : items.filter(item => item.category.toLowerCase() === selectedCategory);
}

// Search bar
function searchItems(items) {
    const searchTerm = searchBar.value.toLowerCase();
    return items.filter(item => item.productName.toLowerCase().includes(searchTerm));
}

// CART FUNCTIONS

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <img src="${item.image}" style="width: 50px; height: auto;"/> 
            ${item.productName} - Quantity: ${item.quantity}
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
}

// Floating my other page to my main page
document.getElementById('open-overlay').addEventListener('click', function() {
    displayCartItems(); // Call to display items
    document.getElementById('overlay').style.display = 'flex';
});

// Close cart overlay
document.querySelector('.close-overlay').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none';
});

// Clear cart items
document.getElementById('clear-cart').addEventListener('click', function() {
    localStorage.removeItem('cartItems'); // Clear items from local storage
    updateCartCount(); // Update the cart count
    displayCartItems(); // Refresh displayed cart items
    alert("Your cart has been cleared.");
});

//displaying an item
function displayItem(item) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-name', item.productName.toLowerCase());
    listItem.classList.add('grocery-item');

    const img = document.createElement('img');
    img.src = item.image || 'placeholder.png'; // Use placeholder if no image
    img.alt = item.productName;
    img.style.width = '100px';

    const itemDetails = document.createElement('div');
    itemDetails.classList.add('item-details');
    itemDetails.innerHTML = `
        <h3>${item.productName} (${item.category})</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Brand: ${item.brand}</p>
        <p>Price: ₱${item.price.toFixed(2)} per item</p>
        <p>Total Cost: ₱${(item.price * item.quantity).toFixed(2)}</p>
        <p>Weight/Volume: ${item.weightVolume || 'N/A'}</p>
        <p>Store: ${item.store}</p>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.onclick = function() {
        listItem.remove();
        removeItemFromStorage(item.productName);
    };

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.onclick = function() {
        editItem(item);
    };

    const addToCartButton = document.createElement('button');
    addToCartButton.innerHTML = '<i class="fas fa-cart-plus"></i>';
    addToCartButton.onclick = function() {
        addToCart(item);
    };

    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(addToCartButton);

    listItem.appendChild(img);
    listItem.appendChild(itemDetails);
    listItem.appendChild(buttonContainer);

    groceryList.appendChild(listItem);
}

// Function to add item to cart
function addToCart(item) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingCartItem = cartItems.find(cartItem => cartItem.productName === item.productName);

    if (existingCartItem) {
        existingCartItem.quantity += item.quantity; //quantity
    } else {
        cartItems.push({ ...item, quantity: item.quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    alert(`${item.productName} has been added to your cart!`);
}

//cart count display
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    document.getElementById('cart-count').innerText = cartItems.reduce((total, item) => total + item.quantity, 0);
}

//edit an item
function editItem(item) {
    groceryForm.querySelector('#product-name').value = item.productName;
    groceryForm.querySelector('#quantity').value = item.quantity;
    groceryForm.querySelector('#brand').value = item.brand;
    groceryForm.querySelector('#price').value = item.price;
    groceryForm.querySelector('#weight-volume').value = item.weightVolume;
    groceryForm.querySelector('#store').value = item.store;
    groceryForm.querySelector('#category').value = item.category; // Populate category

    groceryForm.style.display = 'block';
    editingItem = item.productName; // Store the original item name for updates
}

//remove item from local storage
function removeItemFromStorage(productName) {
    const items = JSON.parse(localStorage.getItem('groceryItems')) || [];
    const updatedItems = items.filter(item => item.productName !== productName);
    localStorage.setItem('groceryItems', JSON.stringify(updatedItems));
}

//form submission
groceryForm.onsubmit = function(event) {
    event.preventDefault();

    const newItem = {
        productName: groceryForm.querySelector('#product-name').value,
        quantity: parseInt(groceryForm.querySelector('#quantity').value),
        brand: groceryForm.querySelector('#brand').value,
        price: parseFloat(groceryForm.querySelector('#price').value),
        weightVolume: groceryForm.querySelector('#weight-volume').value,
        store: groceryForm.querySelector('#store').value,
        category: groceryForm.querySelector('#category').value, // Capture category
        image: '' // Initialize as empty; will be set by FileReader
    };

    
    const imageFile = groceryForm.querySelector('#product-image').files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        newItem.image = reader.result; 
        saveItem(newItem);
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile); // Read the image file
    } else {
        newItem.image = ''; // No image file
        saveItem(newItem);
    }

    groceryForm.reset();
    groceryForm.style.display = 'none';
    editingItem = null;
};

//save the item (add or update)
function saveItem(item) {
    const items = JSON.parse(localStorage.getItem('groceryItems')) || [];
    
    if (editingItem) {
        const index = items.findIndex(existingItem => existingItem.productName === editingItem);
        if (index > -1) {
            items[index] = { ...items[index], ...item }; // Update the existing item
            localStorage.setItem('groceryItems', JSON.stringify(items));
            groceryList.innerHTML = ''; // Clear list
            loadItems(); // Reload items to reflect updates
        }
    } else {
        items.push(item); // Add new item
        localStorage.setItem('groceryItems', JSON.stringify(items));
        displayItem(item);
    }
}

// reloding items
window.onload = loadItems;

// Add event listener for category filter
categoryFilter.addEventListener('change', loadItems);

// Add event listener for search bar input
searchBar.addEventListener('input', loadItems);

// Clear cart button functionality
document.getElementById('clear-cart').addEventListener('click', function() {
    localStorage.removeItem('cartItems'); // Clear items from local storage
    updateCartCount(); // Update the cart count
    alert("Your cart has been cleared.");
});
