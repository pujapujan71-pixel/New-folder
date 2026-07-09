const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const cards = document.querySelectorAll('#book-list .card, .best-sellers .card'); // Don't filter best-sellers away on search, but allow cart click
const popularCards = document.querySelectorAll('#book-list .card');
const sectionTitle = document.getElementById('section-title');
const categoryButtons = document.querySelectorAll('.category');

// --- A. Cart System Logic ---
let cartCount = 0;

// Header ma vako cart icon bhitra pointer/badge thpne logic
const cartLink = document.querySelector('.header-icons a[href="cart.html"]');
cartLink.style.position = 'relative';
cartLink.innerHTML += `<span id="cart-badge" style="
    position: absolute;
    top: -8px;
    right: -10px;
    background: #ff6b6b;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 50%;
    font-weight: bold;
    display: none;
">0</span>`;

const cartBadge = document.getElementById('cart-badge');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Cart count badhane
        cartCount++;
        cartBadge.innerText = cartCount;
        cartBadge.style.display = 'block'; // Badge dekhane

        // Get Book Details for feedback
        const card = e.target.closest('.card');
        const bookTitle = card.querySelector('h3').innerText;

        // Button transient visual response
        const originalText = button.innerText;
        button.innerText = "✓ Added";
        button.style.background = "#2ecc71";
        button.style.color = "white";

        // 1 second pachi button normal parne
        setTimeout(() => {
            button.innerText = originalText;
            button.style.background = ""; // Reset to CSS style
            button.style.color = "";
        }, 1000);
    });
});

// --- B. Search Bar Logic ---
function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    let foundCount = 0;

    popularCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const author = card.querySelector('p').innerText.toLowerCase();

        if (title.includes(query) || author.includes(query)) {
            card.style.display = "block";
            foundCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (query !== "") {
        sectionTitle.innerText = `Search Results (${foundCount} found)`;
        document.getElementById('popular-section').scrollIntoView({ behavior: 'smooth' });
    } else {
        sectionTitle.innerText = "Popular Nepali Books";
    }
}

searchInput.addEventListener('input', performSearch);
searchBtn.addEventListener('click', performSearch);

// --- C. Category Filter Logic ---
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedCategory = button.getAttribute('data-category');
        
        popularCards.forEach(card => {
            const bookCategory = card.getAttribute('data-book-category');
            
            if (selectedCategory === 'all' || selectedCategory === bookCategory) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        if(selectedCategory === 'all') {
            sectionTitle.innerText = "Popular Nepali Books";
        } else {
            sectionTitle.innerText = `${button.querySelector('h3').innerText} Books`;
        }
        
        document.getElementById('popular-section').scrollIntoView({ behavior: 'smooth' });
    });
});