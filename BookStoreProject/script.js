// --- 1. DEFAULT LOCAL BOOKS DATA ---
const defaultBooks = [
    { title: "Summer Love", author: "Subin Bhattarai", price: "Rs.650", category: "novel", img: "assets/image/random pic.png" },
    { title: "Saaya", author: "Subin Bhattarai", price: "Rs.700", category: "novel", img: "assets/image/random pic.png" },
    { title: "Karnali Blues", author: "Buddhisagar", price: "Rs.850", category: "novel", img: "assets/image/random pic.png" },
    { title: "Palpasa Cafe", author: "Narayan Wagle", price: "Rs.600", category: "novel", img: "assets/image/random pic.png" },
    { title: "Basain", author: "Lil Bahadur Chhetri", price: "Rs.500", category: "novel", img: "assets/image/random pic.png" },
    { title: "Shirishko Phool", author: "Parijat", price: "Rs.650", category: "novel", img: "assets/image/random pic.png" },
    { title: "Radha", author: "Krishna Dharabasi", price: "Rs.700", category: "novel", img: "assets/image/random pic.png" },
    { title: "Firfire", author: "Buddhisagar", price: "Rs.800", category: "novel", img: "assets/image/random pic.png" },
    { title: "Muglan", author: "Diamond Shumsher Rana", price: "Rs.780", category: "novel", img: "assets/image/random pic.png" },
    { title: "China Harayeko Manchhe", author: "Hari Bansha Acharya", price: "Rs.900", category: "novel", img: "assets/image/random pic.png" }
];

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const bookListContainer = document.getElementById('book-list');
const sectionTitle = document.getElementById('section-title');
const categoryButtons = document.querySelectorAll('.category');
const cartBadge = document.getElementById('cart-badge');

// Modal Elements
const cartModal = document.getElementById('cartModal');
const cartIconBtn = document.getElementById('cart-icon-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const loginIconBtn = document.getElementById('login-icon-btn');
const closeLoginBtn = document.getElementById('close-login-btn');
const signupForm = document.getElementById('signup-form');
const userSec = document.getElementById('user-sec');

// --- 2. CART SYSTEM MEMORY LOAD ---
let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

function updateCartBadge() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    if (totalCount > 0) {
        cartBadge.innerText = totalCount;
        cartBadge.style.display = 'block';
    } else {
        cartBadge.style.display = 'none';
    }
}
updateCartBadge();

// --- 3. CUSTOMER AUTHENTICATION LOGIC ---
function checkCurrentUser() {
    const user = JSON.parse(localStorage.getItem('storeUser'));
    if (user) {
        const firstName = user.name.split(' ')[0];
        userSec.innerHTML = `
            <a href="#" class="user-profile-display" id="profile-btn">
                <i class="fa-solid fa-circle-user" style="font-size: 16px;"></i> ${firstName}
            </a>
        `;

        document.getElementById('profile-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const logoutConfirm = confirm(`नमस्ते ${user.name}!\nEmail: ${user.email}\nPhone: ${user.phone}\n\nके तपाईँ अकाउन्ट लग-आउट गर्न चाहनुहुन्छ?`);
            if (logoutConfirm) {
                localStorage.removeItem('storeUser');
                location.reload();
            }
        });
    }
}
checkCurrentUser();

loginIconBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

closeLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;

    const userData = { name, email, phone };

    localStorage.setItem('storeUser', JSON.stringify(userData));
    alert("अकाउन्ट सफलतापूर्वक सिर्जना गरियो!");
    loginModal.style.display = 'none';
    checkCurrentUser();
    location.reload();
});

// --- 4. POPUP MODAL CONTROL LOGIC ---
cartIconBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderCartPopup();
    cartModal.style.display = 'flex';
});

closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// --- 5. CART POPUP RENDER FUNCTION ---
function renderCartPopup() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;">तपाईँको कार्ट खाली छ।</p>`;
        cartTotalPrice.innerText = "Rs. 0";
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" onerror="this.onerror=null; this.src='assets/image/random pic.png';">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>Rs. ${item.price}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalPrice.innerText = `Rs. ${total}`;
}

window.updateQty = function (index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('bookCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPopup();
};

window.removeItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('bookCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPopup();
};

window.checkoutAlert = function () {
    const loggedInUser = localStorage.getItem('storeUser');
    if (!loggedInUser) {
        alert("अर्डर अगाडि बढाउन कृपया पहिले मान्छेको आइकनमा क्लिक गरेर अकाउन्ट खोल्नुहोस्!");
        loginModal.style.display = 'flex';
        cartModal.style.display = 'none';
        return;
    }
    const user = JSON.parse(loggedInUser);
    alert(`धन्यवाद ${user.name}!\nतपाईँको अर्डर दर्ता भयो। बिलको कुल विवरण रु. ${cartTotalPrice.innerText} फोन नम्बर ${user.phone} मा पठाउने छौँ।`);

    cart = [];
    localStorage.setItem('bookCart', JSON.stringify(cart));
    updateCartBadge();
    cartModal.style.display = 'none';
};

// --- 6. FUNCTION TO RENDER BOOKS IN HOME PAGE ---
function displayBooks(booksArray) {
    bookListContainer.innerHTML = "";

    booksArray.forEach(book => {
        const card = document.createElement('div');
        card.className = "card";
        card.setAttribute('data-book-category', book.category || 'novel');

        card.innerHTML = `
            <img src="${book.img}" alt="${book.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400';">
            <h3>${book.title}</h3>
            <p>Author : ${book.author}</p>
            <h4>${book.price}</h4>
            <button class="add-to-cart">Add To Cart</button>
        `;
        bookListContainer.appendChild(card);
    });
}
displayBooks(defaultBooks);

// --- 7. SEARCH LOGIC ---
async function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
        sectionTitle.innerText = "Popular Nepali Books";
        displayBooks(defaultBooks);
        return;
    }

    const localResults = defaultBooks.filter(book => {
        const titleLower = book.title.toLowerCase();
        const authorLower = book.author.toLowerCase();
        return titleLower.includes(query) || authorLower.includes(query);
    });

    if (localResults.length > 0) {
        sectionTitle.innerText = `Search Results for "${searchInput.value}" (${localResults.length} found)`;
        displayBooks(localResults);
        document.getElementById('popular-section').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    sectionTitle.innerText = `Searching for "${searchInput.value}" online...`;

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const apiBooks = data.items.map(item => {
                const volumeInfo = item.volumeInfo;
                const title = volumeInfo.title;
                const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';

                let img = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400';
                if (volumeInfo.imageLinks) {
                    img = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail;
                    img = img.replace(/^http:\/\//i, 'https://');
                }

                const randomPrice = `Rs.${Math.floor(Math.random() * (900 - 450 + 1)) + 450}`;

                return {
                    title: title,
                    author: author,
                    price: randomPrice,
                    category: 'novel',
                    img: img
                };
            });

            sectionTitle.innerText = `Search Results for "${searchInput.value}" (${apiBooks.length} found)`;
            displayBooks(apiBooks);
            document.getElementById('popular-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            sectionTitle.innerText = `No books found for "${searchInput.value}"`;
            bookListContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 18px; color: red;">हामीले खोजेको पुस्तक भेट्टाउन सकेनौँ। अर्को नाम टाइप गर्नुहोस्!</p>`;
        }
    } catch (error) {
        console.error("API Error: ", error);
        sectionTitle.innerText = "Error searching books!";
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// --- 8. CATEGORY FILTER LOGIC ---
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedCategory = button.getAttribute('data-category');
        const filteredBooks = defaultBooks.filter(book => {
            return selectedCategory === 'all' || book.category === selectedCategory;
        });

        displayBooks(filteredBooks);

        if (selectedCategory === 'all') {
            sectionTitle.innerText = "Popular Nepali Books";
        } else {
            sectionTitle.innerText = `${button.querySelector('h3').innerText} Books`;
        }
        document.getElementById('popular-section').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- 9. ADD TO CART EVENT DELEGATION ---
document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const card = button.closest('.card');

        const title = card.querySelector('h3').innerText;
        const authorElement = card.querySelector('p');
        const author = authorElement ? authorElement.innerText.replace('Author : ', '') : 'Unknown Author';

        const priceText = card.querySelector('h4').innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));

        const img = card.querySelector('img').src;

        const bookItem = {
            title: title,
            author: author,
            price: price,
            img: img,
            quantity: 1
        };

        const existingItemIndex = cart.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(bookItem);
        }

        localStorage.setItem('bookCart', JSON.stringify(cart));
        updateCartBadge();

        const originalText = button.innerText;
        button.innerText = "✓ Added";
        button.style.background = "#2ecc71";
        button.style.color = "white";

        setTimeout(() => {
            button.innerText = originalText;
            button.style.background = "";
            button.style.color = "";
        }, 1000);
    }
});