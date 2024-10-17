let items = JSON.parse(localStorage.getItem('items')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalSalesCount = parseInt(localStorage.getItem('totalSalesCount')) || 0;
let totalSalesAmount = parseFloat(localStorage.getItem('totalSalesAmount')) || 0;

function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemFullPrice = parseFloat(document.getElementById('itemFullPrice').value);
    const itemHalfPrice = parseFloat(document.getElementById('itemHalfPrice').value);

    if (itemName && itemFullPrice && itemHalfPrice) {
        const item = { name: itemName, fullPrice: itemFullPrice, halfPrice: itemHalfPrice };
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
        displayItems();
        clearInputFields();
    }
}

function clearInputFields() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemFullPrice').value = '';
    document.getElementById('itemHalfPrice').value = '';
}

function displayItems() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} - Full: Rs.${item.fullPrice} | Half: Rs.${item.halfPrice}</span>
            <div>
                <button onclick="addToCart(${index}, true)">Add Full</button>
                <button onclick="addToCart(${index}, false)">Add Half</button>
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        itemList.appendChild(li);
    });
}

function addToCart(index, isFullPrice) {
    const item = items[index];
    const cartItem = {
        name: item.name,
        price: isFullPrice ? item.fullPrice : item.halfPrice
    };
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';
    
    let totalAmount = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} - Rs.${item.price}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(li);
        totalAmount += item.price;
    });
    
    document.getElementById('totalAmount').textContent = `Total: Rs.${totalAmount}`;
    document.getElementById('totalItems').textContent = `Items: ${cart.length}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function checkout() {
    totalSalesCount += cart.length;
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    totalSalesAmount += totalAmount;

    localStorage.setItem('totalSalesCount', totalSalesCount);
    localStorage.setItem('totalSalesAmount', totalSalesAmount);

    alert('Transaction successful!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateSalesSummary();
}

function updateSalesSummary() {
    document.getElementById('finalCount').textContent = `Total Sales: ${totalSalesCount}`;
    document.getElementById('finalAmount').textContent = `Total Revenue: Rs.${totalSalesAmount}`;
}

function editItem(index) {
    const item = items[index];
    const newName = prompt("Enter new item name", item.name);
    const newFullPrice = parseFloat(prompt("Enter new full price", item.fullPrice));
    const newHalfPrice = parseFloat(prompt("Enter new half price", item.halfPrice));

    if (newName && !isNaN(newFullPrice) && !isNaN(newHalfPrice)) {
        items[index] = { name: newName, fullPrice: newFullPrice, halfPrice: newHalfPrice };
        localStorage.setItem('items', JSON.stringify(items));
        displayItems();
    }
}

function deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        items.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(items));
        displayItems();
    }
}

function clearSalesSummary() {
    if (confirm("Are you sure you want to clear the Sales Summary? This action cannot be undone.")) {
        totalSalesCount = 0;
        totalSalesAmount = 0;
        localStorage.setItem('totalSalesCount', totalSalesCount);
        localStorage.setItem('totalSalesAmount', totalSalesAmount);
        updateSalesSummary();
        alert('Sales Summary has been cleared.');
    }
}

// Initial load
displayItems();
displayCart();
updateSalesSummary();

document.addEventListener('DOMContentLoaded', function() {
    displayItems();
    displayCart();
    updateSalesSummary();
    document.getElementById('clearSalesSummary').addEventListener('click', clearSalesSummary);
});