    document.addEventListener("DOMContentLoaded", () => {
      emailjs.init("TghekllL5hZiZEKWi");

      const cartHolder = document.getElementById("cartHolder");
      const cartBtn = document.getElementById("cartBtn");
      const totalPriceEl = document.getElementById("totalPrice");
      const cartItemHolder = cartHolder.querySelector(".cartItemHolder");

      const toggleCart = () => {
        const isHidden =
          cartHolder.style.visibility === "hidden" || cartHolder.style.visibility === "";
        cartHolder.style.visibility = isHidden ? "visible" : "hidden";
      };

      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleCart();
      });

      const updateTotalPrice = () => {
        const items = cartItemHolder.querySelectorAll(".cartItem");
        let total = 0;
        items.forEach((item) => {
          const qty = parseInt(item.querySelector(".commonP").textContent);
          const price = parseFloat(item.getAttribute("data-price"));
          total += qty * price;
        });
        totalPriceEl.textContent = `Total Price: ${total.toFixed(2)}/=`;
      };

      const attachCartItemListeners = (cartItem) => {
        const plusBtn = cartItem.querySelector(".plus");
        const minusBtn = cartItem.querySelector(".minus");
        const removeBtn = cartItem.querySelector(".removeItem");
        const qtyEl = cartItem.querySelector(".commonP");

        plusBtn.addEventListener("click", () => {
          qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
          updateTotalPrice();
        });

        minusBtn.addEventListener("click", () => {
          let currentQty = parseInt(qtyEl.textContent);
          if (currentQty > 1) {
            qtyEl.textContent = currentQty - 1;
          } else {
            cartItem.remove();
          }
          updateTotalPrice();
        });

        removeBtn.addEventListener("click", () => {
          cartItem.remove();
          updateTotalPrice();
        });
      };

      // Handle all products
      document.querySelectorAll(".product").forEach((product) => {
        let count = 0;
        const plusBtn = product.querySelector(".pb");
        const minusBtn = product.querySelector(".nb");
        const qtyDisplay = product.querySelector(".pnResult");
        const addCartBtn = product.querySelector(".addCart");
        const buyBtn = product.querySelector(".buyCart");
        const productName = product.querySelector(".productName").textContent.trim();
        const productPrice = parseFloat(product.getAttribute("data-price"));
        const productImg = product.querySelector("img").src;

        qtyDisplay.textContent = "0";

        plusBtn.addEventListener("click", () => {
          count++;
          qtyDisplay.textContent = count;
        });

        minusBtn.addEventListener("click", () => {
          count = Math.max(0, count - 1);
          qtyDisplay.textContent = count;
        });

        addCartBtn.addEventListener("click", () => {
          if (count === 0) {
            alert("Please select quantity before adding to cart.");
            return;
          }

          // Check if product already in cart
          let existingItem = Array.from(cartItemHolder.children).find(
            (item) =>
              item.querySelector(".cartImgName").textContent.trim() === productName
          );

          if (existingItem) {
            const qtyEl = existingItem.querySelector(".commonP");
            qtyEl.textContent = parseInt(qtyEl.textContent) + count;
          } else {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cartItem");
            cartItemDiv.setAttribute("data-price", productPrice);

            cartItemDiv.innerHTML = `
              <div class="cartImg">
                <img src="${productImg}" alt="${productName}" />
                <p class="cartImgName">${productName}</p>
              </div>
              <div class="gun">
                <p class="removeItem">✖</p>
              </div>
              <div class="commonP pnResult">${count}</div>
              <div class="pmCart">
                <button class="plus pb">➕</button>
                <button class="minus nb">➖</button>
              </div>
            `;

            cartItemHolder.appendChild(cartItemDiv);
            attachCartItemListeners(cartItemDiv);
          }

          updateTotalPrice();
          count = 0;
          qtyDisplay.textContent = "0";
          toggleCart();
        });

        buyBtn.addEventListener("click", () => {
          if (count === 0) {
            alert("Please select quantity before buying.");
            return;
          }

          const user = {
            name: prompt("Enter your name:").trim() || "Unknown",
            address: prompt("Enter your address:").trim() || "Unknown",
            phone: prompt("Enter your phone number:").trim() || "Unknown",
          };

          const total = (count * productPrice).toFixed(2);

          const message = `🛒 Direct Purchase
Name: ${user.name}
Address: ${user.address}
Phone: ${user.phone}
Item: ${productName}
Quantity: ${count}
Price: ${productPrice}/= each
Total: ${total}/=
📩 Sent on: ${new Date().toLocaleString()}`;

          emailjs
            .send("service_sf01pgf", "template_wnbbw2k", {
              cart_details: message,
            })
            .then(() => alert("✅ Purchase details sent!"))
            .catch(() => alert("❌ Failed to send email."));

          count = 0;
          qtyDisplay.textContent = "0";
        });
      });

      // Send entire cart via email
      const sendBtn = document.getElementById("sendCartBtn");
      sendBtn.addEventListener("click", () => {
        const items = cartItemHolder.querySelectorAll(".cartItem");

        if (items.length === 0) {
          alert("🛒 Cart is empty!");
          return;
        }

        let message = "";
        let totalPrice = 0;

        items.forEach((item, idx) => {
          const name = item.querySelector(".cartImgName").textContent.trim();
          const qty = parseInt(item.querySelector(".commonP").textContent);
          const price = parseFloat(item.getAttribute("data-price"));
          const itemTotal = qty * price;
          totalPrice += itemTotal;

          message += `${idx + 1}. ${name} - Quantity: ${qty} - Price: ${price}/= - Total: ${itemTotal}/=\n`;
        });

        const user = {
          name: prompt("Enter your name:").trim() || "Unknown",
          address: prompt("Enter your address:").trim() || "Unknown",
          phone: prompt("Enter your phone number:").trim() || "Unknown",
        };

        message = `🛒 Cart Order
Name: ${user.name}
Address: ${user.address}
Phone: ${user.phone}
Cart Items:
${message}
Total Price: ${totalPrice.toFixed(2)}/=
📩 Sent on: ${new Date().toLocaleString()}`;

        emailjs
          .send("service_sf01pgf", "template_wnbbw2k", {
            cart_details: message,
          })
          .then(() => {
            alert("✅ Cart sent to your email!");
            cartItemHolder.innerHTML = "";
            updateTotalPrice();
          })
          .catch(() => alert("❌ Failed to send email."));
      });
    });
 

    // js for mode change

      const toggleBtn = document.getElementById("toggleModeBtn");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    toggleBtn.textContent = document.body.classList.contains("dark-mode")
      ? "☀️ Light"
      : "🌙 Dark";
  })