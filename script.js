function getCart(){
    return JSON.parse(localStorage.getItem("bakeryCart")) || [];
}

function saveCart(cart){
    localStorage.setItem("bakeryCart", JSON.stringify(cart));
}

function updateCartCount(){
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll("#cart-count");

    countElements.forEach(el => {
        el.textContent = count;
    });
}

function addToCart(name, price){
    let cart = getCart();
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showCutePopup(name);
   
    function showCutePopup(itemName){
        const popup = document.getElementById("cute-popup");
        const text = document.getElementById("popup-text");
    
        text.textContent = `✨ ${itemName} added to your cart 🧁💖`;
    
        popup.classList.add("show");
    
        setTimeout(() => {
            popup.classList.remove("show");
        }, 2500);
    }
}

function renderCheckoutCart(){
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if(!cartContainer || !totalElement){
        return;
    }

    const cart = getCart();

    if(cart.length === 0){
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.textContent = "$0";
        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price} each</p>
            </div>

            <div class="cart-controls">
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;

        cartContainer.appendChild(div);
    });

    totalElement.textContent = `$${total}`;
}

function changeQuantity(index, change){
    let cart = getCart();

    cart[index].quantity += change;

    if(cart[index].quantity <= 0){
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCartCount();
    renderCheckoutCart();
}

function removeItem(index){
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCheckoutCart();
}

function placeOrder(event){
    event.preventDefault();

    const cart = getCart();
    const message = document.getElementById("order-message");
    const form = document.querySelector(".checkout-form");
    const name = document.getElementById("name").value;

    if(cart.length === 0){
        message.textContent = "Your cart is empty. Add items before placing an order.";
        return;
    }

    message.textContent = `Thank you, ${name}! Your sweet order is on its way ✨🧁💖`;

    localStorage.removeItem("bakeryCart");
    updateCartCount();
    renderCheckoutCart();
    form.reset();
}

updateCartCount();
renderCheckoutCart();
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if(menuToggle && navMenu){
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
    });
}