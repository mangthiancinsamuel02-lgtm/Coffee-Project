document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupHomeSlider();
    setupCart();
    setupCoffeeFilter();
    setupEvents();
    setupSubscriptions();
    setupOfferRegistration();
    setupHomeDiscount();
    setupNewsletter();
    setupFlatpickr();
    setupEmailJS();
    updateCartCount();
});


/* =========================
   CONFIGURATION
========================= */

const CART_KEY = "beanBoutiqueCart";

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";


/* =========================
   TOASTIFY
========================= */

function showToast(message, type = "success") {
    if (typeof Toastify !== "function") return;

    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        stopOnFocus: true,
        style: {
            background: type === "error" ? "#b23b3b" : "#6b3f2a",
            borderRadius: "8px",
            padding: "14px 18px"
        }
    }).showToast();
}


/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {
    const button = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {
        nav.classList.toggle("show");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("show");
        });
    });
}


/* =========================
   HOME SLIDER
========================= */

function setupHomeSlider() {
    const slider = document.getElementById("homeSlider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".home-slide");
    const dots = slider.querySelectorAll(".slider-dot");
    const next = document.getElementById("sliderNext");
    const prev = document.getElementById("sliderPrev");

    if (!slides.length) return;

    let current = 0;
    let timer;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === current);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(() => showSlide(current + 1), 4000);
    }

    next?.addEventListener("click", () => {
        showSlide(current + 1);
        restart();
    });

    prev?.addEventListener("click", () => {
        showSlide(current - 1);
        restart();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            restart();
        });
    });

    showSlide(0);
    restart();
}


/* =========================
   CART
========================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {
    const count = getCart().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}


function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);

    showToast(
        `✓ ${product.name} has been added to your cart.`
    );
}


function setupCart() {

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {

            addToCart({
                id: button.dataset.id,
                name: button.dataset.name,
                price: Number(button.dataset.price)
            });

        });
    });


    const cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    renderCart();


    document.getElementById("clearCart")?.addEventListener("click", () => {

        const cart = getCart();

        if (!cart.length) {
            showToast("Your cart is already empty.", "error");
            return;
        }

        localStorage.removeItem(CART_KEY);

        renderCart();
        updateCartCount();

        showToast("✓ Your cart has been cleared.");
    });


    document.getElementById("checkoutBtn")?.addEventListener("click", () => {

        if (!getCart().length) {
            showToast("Your cart is empty.", "error");
            return;
        }

        showToast(
            "✓ Your order has been checked out successfully!"
        );
    });
}


function renderCart() {

    const container = document.getElementById("cartItems");
    if (!container) return;

    const empty = document.getElementById("emptyCart");
    const subtotalElement = document.getElementById("cartSubtotal");
    const deliveryElement = document.getElementById("cartDelivery");
    const totalElement = document.getElementById("cartTotal");

    const cart = getCart();

    container.innerHTML = "";


    if (!cart.length) {

        if (empty) empty.style.display = "block";

        if (subtotalElement) subtotalElement.textContent = "$0.00";
        if (deliveryElement) deliveryElement.textContent = "$0.00";
        if (totalElement) totalElement.textContent = "$0.00";

        return;
    }


    if (empty) empty.style.display = "none";

    let subtotal = 0;


    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        subtotal += price * quantity;


        const article = document.createElement("article");

        article.className = "cart-item";

        article.innerHTML = `
            <div>
                <h3>${escapeHTML(item.name)}</h3>
                <p>$${price.toFixed(2)} each</p>
            </div>

            <div class="cart-controls">

                <button
                    class="quantity-btn"
                    data-index="${index}"
                    data-action="decrease"
                    type="button">
                    −
                </button>

                <strong>${quantity}</strong>

                <button
                    class="quantity-btn"
                    data-index="${index}"
                    data-action="increase"
                    type="button">
                    +
                </button>

                <strong>
                    $${(price * quantity).toFixed(2)}
                </strong>

            </div>
        `;

        container.appendChild(article);
    });


    const delivery = subtotal >= 40 ? 0 : 5;
    const total = subtotal + delivery;


    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (deliveryElement) {
        deliveryElement.textContent = `$${delivery.toFixed(2)}`;
    }

    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }


    container.querySelectorAll(".quantity-btn").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);
            const action = button.dataset.action;
            const cart = getCart();

            if (!cart[index]) return;

            if (action === "increase") {
                cart[index].quantity++;
            }

            if (action === "decrease") {
                cart[index].quantity--;
            }

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            saveCart(cart);
            renderCart();
        });

    });
}


/* =========================
   COFFEE FILTER
========================= */

function setupCoffeeFilter() {

    const search = document.getElementById("coffeeSearch");
    const cards = document.querySelectorAll(".coffee-card");
    const buttons = document.querySelectorAll(".filter-btn");
    const status = document.getElementById("coffeeStatus");

    if (!search || !cards.length) return;

    let activeFilter = "all";


    function filterCoffee() {

        const term = search.value.trim().toLowerCase();
        let visible = 0;


        cards.forEach(card => {

            const category = card.dataset.category || "";

            const text = (
                card.dataset.search ||
                card.textContent
            ).toLowerCase();

            const categoryMatch =
                activeFilter === "all" ||
                category === activeFilter;

            const searchMatch = text.includes(term);

            const show = categoryMatch && searchMatch;

            card.style.display = show ? "" : "none";

            if (show) visible++;
        });


        if (status) {
            status.textContent =
                `Showing ${visible} coffee${visible === 1 ? "" : "s"}.`;
        }
    }


    search.addEventListener("input", filterCoffee);


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            activeFilter = button.dataset.filter || "all";

            filterCoffee();
        });

    });


    filterCoffee();
}


/* =========================
   FLATPICKR
========================= */

function setupFlatpickr() {

    const dateInput = document.getElementById("eventDate");

    if (!dateInput || typeof flatpickr !== "function") return;

    flatpickr(dateInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        disableMobile: true
    });
}


/* =========================
   EMAILJS
========================= */

function setupEmailJS() {

    if (
        typeof emailjs === "undefined" ||
        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"
    ) {
        return;
    }

    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
    });
}


async function sendEventEmail(data) {

    if (
        typeof emailjs === "undefined" ||
        EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
        EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
        EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
    ) {
        showToast(
            "Please configure your EmailJS details.",
            "error"
        );

        return false;
    }


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                first_name: data.firstName,
                last_name: data.lastName,
                event_name: data.eventName,
                event_date: data.date,
                email: data.email
            }
        );

        return true;

    } catch (error) {

        console.error("EmailJS Error:", error);

        showToast(
            "Registration could not be sent. Please try again.",
            "error"
        );

        return false;
    }
}


/* =========================
   EVENT REGISTRATION
========================= */

function setupEvents() {

    const select = document.getElementById("eventName");


    document.querySelectorAll(".event-select").forEach(button => {

        button.addEventListener("click", () => {

            if (!select) return;

            select.value = button.dataset.event || "";

            select.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });

    });


    const form = document.getElementById("eventForm");

    if (!form) return;


    form.addEventListener("submit", async event => {

        event.preventDefault();


        const firstName =
            document.getElementById("firstName")?.value.trim() || "";

        const lastName =
            document.getElementById("lastName")?.value.trim() || "";

        const eventName =
            document.getElementById("eventName")?.value.trim() || "";

        const date =
            document.getElementById("eventDate")?.value.trim() || "";

        const email =
            document.getElementById("eventEmail")?.value.trim() || "";


        if (!firstName || !lastName || !eventName || !date || !email) {

            showToast(
                "Please complete all required fields.",
                "error"
            );

            return;
        }


        const sent = await sendEventEmail({
            firstName,
            lastName,
            eventName,
            date,
            email
        });


        if (!sent) return;


        showToast(
            "✓ Your event registration was successful!"
        );


        form.reset();
    });
}


/* =========================
   OFFERS / SUBSCRIPTIONS
========================= */

function setupSubscriptions() {

    document.querySelectorAll(".choose-plan").forEach(button => {

        button.addEventListener("click", () => {

            const plan = button.dataset.plan || "Selected plan";

            localStorage.setItem(
                "beanBoutiquePlan",
                plan
            );

            showToast(
                `✓ ${plan} subscription has been selected.`
            );
        });

    });
}


/* =========================
   OFFER REGISTRATION
========================= */

function setupOfferRegistration() {

    const form = document.getElementById(
        "offerRegistrationForm"
    );

    if (!form) return;


    form.addEventListener("submit", event => {

        event.preventDefault();


        const firstName =
            document.getElementById("offerFirstName")
                ?.value.trim() || "";

        const lastName =
            document.getElementById("offerLastName")
                ?.value.trim() || "";

        const email =
            document.getElementById("offerEmail")
                ?.value.trim() || "";


        if (!firstName || !lastName || !email) {

            showToast(
                "Please complete all registration fields.",
                "error"
            );

            return;
        }


        localStorage.setItem(
            "beanBoutiqueOfferRegistration",
            JSON.stringify({
                firstName,
                lastName,
                email
            })
        );


        showToast(
            "✓ You have successfully registered for our offers!"
        );


        form.reset();
    });
}


/* =========================
   HOME DISCOUNT POPUP
========================= */

function setupHomeDiscount() {

    if (!document.getElementById("homeSlider")) return;

    if (document.getElementById("discountPopup")) return;


    const popup = document.createElement("div");

    popup.id = "discountPopup";


    popup.innerHTML = `
        <div class="discount-box">

            <button
                class="discount-close"
                type="button"
                aria-label="Close">
                &times;
            </button>

            <p class="eyebrow">
                WELCOME TO BEAN BOUTIQUE
            </p>

            <h2>Get 10% OFF</h2>

            <p>
                Enjoy 10% off your first order
                and discover your next favourite coffee.
            </p>

            <a
                href="coffeeSelection.html"
                class="btn btn-primary">
                Shop Coffee
            </a>

        </div>
    `;


    document.body.appendChild(popup);


    popup.querySelector(".discount-close")
        .addEventListener("click", () => {
            popup.remove();
        });


    popup.addEventListener("click", event => {

        if (event.target === popup) {
            popup.remove();
        }

    });


    const style = document.createElement("style");

    style.textContent = `
        #discountPopup {
            position: fixed;
            inset: 0;
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0,0,0,.55);
        }

        .discount-box {
            position: relative;
            width: min(450px, 100%);
            padding: 40px 30px;
            background: #fff;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,.3);
            animation: discountPop .3s ease;
        }

        .discount-box h2 {
            color: #6b3f2a;
            margin-bottom: 12px;
            font-family: "Playfair Display", serif;
            font-size: 32px;
        }

        .discount-box p:not(.eyebrow) {
            color: #76675d;
            margin-bottom: 22px;
        }

        .discount-close {
            position: absolute;
            top: 10px;
            right: 15px;
            border: 0;
            background: none;
            color: #6b3f2a;
            font-size: 28px;
        }

        @keyframes discountPop {
            from {
                opacity: 0;
                transform: scale(.85);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================
   NEWSLETTER
========================= */

function setupNewsletter() {

    const form = document.getElementById("newsletterForm");

    if (!form) return;


    form.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            document.getElementById("newsletterEmail")
                ?.value.trim() || "";


        if (!email) {

            showToast(
                "Please enter your email address.",
                "error"
            );

            return;
        }


        showToast(
            "✓ Thank you! Your 10% welcome offer is ready."
        );


        form.reset();
    });
}


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}