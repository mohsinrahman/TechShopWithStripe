let stripe;
window.addEventListener("load", main);

function main() {

    const toCheckout = document.getElementById('toCheckout')
    toCheckout.addEventListener('click', proceedToCheckout)

  stripe = Stripe(
    "pk_test_51HMqSzB979vlbHgipDCCEbRksJjH513MddC8fw21FjfEy8DuJXosMnVFVTIZugCBKPgVwoy59rqRfmr2lrn0G8I100oKXpFnx8"
  );
  products();
}

async function proceedToCheckout() {
    try {
        const response = await fetch('/api/checkout-session', { method: 'POST'})
        const session = await response.json()

        // Proceed to open the checkout page
        const result = await stripe.redirectToCheckout({ sessionId: session.id});

    } catch (error) {
       
    }
}

async function products() {
  let ul = document.getElementById("products");

  const response = await fetch("/api/products", {
    method: "GET"
  });
  const productList = await response.json();
  let cartArray = [];
  for (let i = 0; i < productList.data.length; i++) {
    console.log(productList);
    const product = productList.data[i];
    let id = product.id;
    console.log(id);
    let li = document.createElement("li");
    li.className = "listPhone";
    let img = document.createElement("img");
    img.src = product.images;
    img.setAttribute("alt", "phone");
    img.className = "phone";
    img.setAttribute("height", "200px");
    img.setAttribute("width", "150px");

    ul.appendChild(li);

    li.innerHTML = product.name;
    li.appendChild(img);
    var AddtoCart = document.createElement("button");
    AddtoCart.className = " finishShoping";
    AddtoCart.setAttribute("type", "button");
    AddtoCart.innerText = "Add to Cart";
    AddtoCart.onclick = function() {
      addProductCart(product.name);
    };
    li.appendChild(AddtoCart);
  }

  function addProductCart(name) {
    let productToAdd = name;
    for (let i = 0; i < productList.data.length; i++) {
      if (productToAdd == productList.data[i].name) {
        cartArray.push(productList.data[i]);
      }
    }

    console.log(cartArray);
  }

  if (response.status > 400) {
    console.log(productList.error);
  }
}

// function for returning to homepage from cartpage
function backToHomepage() {
    window.location = "index.html"
}