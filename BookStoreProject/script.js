script.js
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const cards = document.querySelectorAll('#book-list .card, .best-sellers .card'); // Don't filter best-sellers away on search, but allow cart click
const popularCards = document.querySelectorAll('#book-list .card');
const sectionTitle = document.getElementById('section-title');
const categoryButtons = document.querySelectorAll('.category');

// --- A. Cart System Logic (LocalStorage Integration) ---

// LocalStorage बाट पुरानो कार्ट डेटा लोड गर्ने (डेटा छैन भने खाली एरे [] राख्ने)
let cart = JSON.parse(localStorage.getItem('bookCart')) || [];

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

// पेज लोड हुँदा पहिले थपिएका आइटमहरूको संख्या ब्याजलगायत देखाउने फङ्सन
function updateCartBadge() {
    // कार्टमा भएका सबै सामानको Quantity (संख्या) जोड्ने
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.innerText = totalItems;
        cartBadge.style.display = 'block';
    } else {
        cartBadge.style.display = 'none';
    }
}

// सुरुमै ब्याज अपडेट गर्ने
updateCartBadge();

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // १. कार्टमा सेभ गर्ने लोजिक
        const card = e.target.closest('.card');
        const title = card.querySelector('h3').innerText;
        
        // Author र Price निकाल्ने (यदि Author छैन भने 'Unknown Author' राख्ने)
        const authorElement = card.querySelector('p');
        const author = authorElement ? authorElement.innerText.replace('Author : ', '') : 'Unknown Author';
        
        const priceText = card.querySelector('h4').innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, '')); // 'Rs.650' बाट '650' मात्र निकाल्ने
        
        const img = card.querySelector('img').src;

        const bookItem = {
            title: title,
            author: author,
            price: price,
            img: img,
            quantity: 1
        };

        // यदि कार्टमा यो पुस्तक पहिले नै छ भने त्यसको संख्या (Quantity) मात्र १ ले बढाउने
        const existingItemIndex = cart.findIndex(item => item.title === title);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(bookItem);
        }

        // LocalStorage मा कार्ट सेभ गर्ने
        localStorage.setItem('bookCart', JSON.stringify(cart));

        // २. ब्याज र एनिमेसन अपडेट गर्ने
        updateCartBadge();

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
