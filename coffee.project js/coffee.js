document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();

    updateCartCount();

    setupAddToCart();

    setupCoffeeFilter();

    setupNewsletter();

    setupEvents();

    setupSubscriptions();

    setupCartPage();

});

function setupMobileMenu() {

    const button = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    if (!button || !nav) {
        return;
    }

    button.addEventListener("click", function () {

        nav.classList.toggle("show");

    });

}

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("beanBoutiqueCart")
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        "beanBoutiqueCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(function (total, item) {

        return total + item.quantity;

    }, 0);


    document.querySelectorAll(".cart-count").forEach(
        function (element) {

            element.textContent = count;

        }
    );

}

function setupAddToCart() {

    document.querySelectorAll(".add-to-cart").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const product = {

                        id: button.dataset.id,

                        name: button.dataset.name,

                        price: Number(
                            button.dataset.price
                        ),

                        quantity: 1

                    };


                    addProductToCart(product);

                }
            );

        }
    );

}


function addProductToCart(product) {

    const cart = getCart();


    const existing = cart.find(
        function (item) {

            return item.id === product.id;

        }
    );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push(product);

    }


    saveCart(cart);


    alert(
        product.name + " added to cart."
    );

}

function setupCoffeeFilter() {

    const search =
        document.getElementById("coffeeSearch");

    const cards =
        document.querySelectorAll(".coffee-card");

    const buttons =
        document.querySelectorAll(".filter-btn");

    const status =
        document.getElementById("coffeeStatus");


    if (!search || !cards.length) {

        return;

    }


    let activeFilter = "all";


    function filterCoffee() {

        const term =
            search.value
                .trim()
                .toLowerCase();


        let visible = 0;


        cards.forEach(function (card) {

            const category =
                card.dataset.category;

            const searchableText =
                card.dataset.search.toLowerCase();


            const categoryMatch =
                activeFilter === "all" ||
                category === activeFilter;


            const searchMatch =
                searchableText.includes(term);


            const show =
                categoryMatch &&
                searchMatch;


            card.style.display =
                show ? "" : "none";


            if (show) {

                visible++;

            }

        });


        if (status) {

            status.textContent =
                "Showing " +
                visible +
                " coffee" +
                (visible === 1 ? "" : "s") +
                ".";

        }

    }


    search.addEventListener(
        "input",
        filterCoffee
    );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                activeFilter =
                    button.dataset.filter;


                filterCoffee();

            }
        );

    });


    filterCoffee();

}

function setupNewsletter() {

    const form =
        document.getElementById(
            "newsletterForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "newsletterEmail"
                ).value;


            if (!email) {

                return;

            }


            alert(
                "Thank you! Your 10% welcome offer is ready."
            );


            form.reset();

        }
    );

}

function setupEvents() {

    const select =
        document.getElementById("eventName");


    document.querySelectorAll(
        ".event-select"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                if (select) {

                    select.value =
                        button.dataset.event;

                    select.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    });


    const form =
        document.getElementById("eventForm");


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const eventName =
                document.getElementById(
                    "eventName"
                ).value;


            const date =
                document.getElementById(
                    "eventDate"
                ).value;


            const email =
                document.getElementById(
                    "eventEmail"
                ).value;


            if (
                !eventName ||
                !date ||
                !email
            ) {

                alert(
                    "Please complete all fields."
                );

                return;

            }


            alert(
                "Registration prepared for " +
                eventName +
                "."
            );


            form.reset();

        }
    );

}

function setupSubscriptions() {

    document.querySelectorAll(
        ".choose-plan"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const plan =
                    button.dataset.plan;


                localStorage.setItem(
                    "beanBoutiquePlan",
                    plan
                );


                alert(
                    plan +
                    " subscription selected."
                );

            }
        );

    });

}

function setupCartPage() {

    const cartItems =
        document.getElementById("cartItems");


    if (!cartItems) {

        return;

    }


    renderCart();


    const clearButton =
        document.getElementById(
            "clearCart"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "beanBoutiqueCart"
                );

                renderCart();

                updateCartCount();

            }
        );

    }


    const checkoutButton =
        document.getElementById(
            "checkoutBtn"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function () {

                const cart = getCart();


                if (!cart.length) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                alert(
                    "Checkout is a prototype only."
                );

            }
        );

    }

}

function renderCart() {

    const cart =
        getCart();


    const container =
        document.getElementById(
            "cartItems"
        );


    const empty =
        document.getElementById(
            "emptyCart"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!cart.length) {

        if (empty) {

            empty.style.display = "block";

        }


        subtotalElement.textContent =
            "$0.00";

        deliveryElement.textContent =
            "$0.00";

        totalElement.textContent =
            "$0.00";


        return;

    }


    if (empty) {

        empty.style.display = "none";

    }


    let subtotal = 0;


    cart.forEach(function (item, index) {

        subtotal +=
            item.price *
            item.quantity;


        const article =
            document.createElement(
                "article"
            );


        article.className =
            "cart-item";


        article.innerHTML = `

            <div>

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    $${item.price.toFixed(2)}
                    each
                </p>

            </div>


            <div class="cart-controls">

                <button
                    class="quantity-btn"
                    data-index="${index}"
                    data-action="decrease"
                >
                    −
                </button>


                <strong>
                    ${item.quantity}
                </strong>


                <button
                    class="quantity-btn"
                    data-index="${index}"
                    data-action="increase"
                >
                    +
                </button>


                <strong>
                    $${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}
                </strong>

            </div>

        `;


        container.appendChild(article);

    });


    const delivery =
        subtotal >= 40 || subtotal === 0
            ? 0
            : 5;


    const total =
        subtotal + delivery;


    subtotalElement.textContent =
        "$" + subtotal.toFixed(2);


    deliveryElement.textContent =
        "$" + delivery.toFixed(2);


    totalElement.textContent =
        "$" + total.toFixed(2);


    container
        .querySelectorAll(".quantity-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    const action =
                        button.dataset.action;


                    if (
                        action ===
                        "increase"
                    ) {

                        cart[index].quantity++;

                    }


                    if (
                        action ===
                        "decrease"
                    ) {

                        cart[index].quantity--;

                    }


                    if (
                        cart[index].quantity <= 0
                    ) {

                        cart.splice(index, 1);

                    }


                    saveCart(cart);

                    renderCart();

                }
            );

        });

} 

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}