let stripe;
window.addEventListener("load", main);

function main() {

  stripe = Stripe("pk_test_51HMqSzB979vlbHgipDCCEbRksJjH513MddC8fw21FjfEy8DuJXosMnVFVTIZugCBKPgVwoy59rqRfmr2lrn0G8I100oKXpFnx8");

  const toCheckout = document.getElementById('toCheckout')
  toCheckout.addEventListener('click', proceedToCheckout)

  verifyCheckoutSession();
}

async function proceedToCheckout() {
  const cartTotal = JSON.parse(localStorage.getItem('cartItems'))
  const showInCheckout = cartTotal.map((product) => {
    return {
      price_data: {
        currency: "sek",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price + "00"
      },
      quantity: product.count,
    }
  })

  const response = await fetch("/api/checkout-session", {
    method: 'POST',
    body: JSON.stringify(showInCheckout),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const session = await response.json();
  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  });

  if (result.error) {

  }
}

async function verifyCheckoutSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  if (sessionId) {
    console.log(sessionId);
    const response = await fetch('/api/verify-checkout-session', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        sessionId
      })
    })
    const session = await response.json()
    console.log(session.isVerified)
    if (session.isVerified) {
      window.location.pathname = "confirmation"
    } else {
      alert('Beställningen misslyckades')
    }
  }
}

async function products() {
  let cartArray = []
  let div1 = document.getElementById("products");
  const response = await fetch("/api/products", {
    method: "GET"
  });
  const productList = await response.json();
  for (let i = 0; i < productList.data.length; i++) {
    const product = productList.data[i];
    let div2 = document.createElement("div");
    div2.className = "col-md-4";
    div1.appendChild(div2);
    let div3 = document.createElement("div");
    div3.className = "card mb-4 shadow-sm ";
    div2.appendChild(div3);
    let divImg = document.createElement("div");
    divImg.className = "text-center";
    let img = document.createElement("img");
    img.className = "img-fluid phone text-center";
    img.src = product.images;
    img.setAttribute("height", "200px");
    img.setAttribute("width", "150px");
    img.setAttribute("alt", "Responsive image");
    divImg.appendChild(img);

    let productName = document.createElement("p")
    productName.innerText = product.name
    productName.classList = "productName"
    div3.appendChild(productName)
    div3.appendChild(divImg);

    let div4 = document.createElement("div");
    div4.className = "card-body";
    div3.appendChild(div4);
    let p = document.createElement("p");
    p.className = "card-text";
    p.innerText = product.description
    div4.appendChild(p);
    let price = document.createElement("p")
    price.innerHTML = product.price + " kr"
    div4.appendChild(price)
    let div5 = document.createElement("div");
    div5.className = "d-flex justify-content-between align-items-center";
    div4.appendChild(div5);
    let div6 = document.createElement("div");
    div6.className = "btn-group";
    div5.appendChild(div6);
    let btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-secondary";
    btn.setAttribute("type", "button");
    btn.innerText = "Köp";

    btn.onclick = function () {
      let oldCartItems = JSON.parse(localStorage.getItem('cartItems'))
      if (oldCartItems)
        cartArray = oldCartItems;
      let uniq = cartArray.map(function (value) {
        return value.name
      });
      let index = uniq.indexOf(product.name)
      if (index == -1)
        cartArray.push(product)
      else {
        let object = cartArray[index]
        object.count ? object['count'] = object.count + 1 : object['count'] = 2
      }
      addProductCart(cartArray);
    };
    div6.appendChild(btn);
  }

  function addProductCart(cartArray) {
    localStorage.setItem("cartItems", JSON.stringify(cartArray))
    var itemCount = document.getElementById('itemCount');
    if (cartArray.length == 1) itemCount.style.opacity = 1
    itemCount.innerText = cartArray.length
  }

  if (response.status > 400) {
    console.log(productList.error);
  }
}

function shopBasket() {
  var list = document.getElementById('cartList')
  list.innerHTML = ''
  var table = document.createElement('table')
  table.id = 'shop-basket-table'
  var tr = document.createElement('tr')
  tr.innerHTML = '<th>Image</th><th>Name</th><th>Price</th><th>Count</th><th>Actions</th>'
  let thead = document.createElement('thead')
  thead.className = "thead-dark"
  thead.appendChild(tr)
  table.appendChild(thead)
  let totalPrice = 0;
  const cartItemsString = localStorage.getItem("cartItems")
  const cartItems = JSON.parse(cartItemsString || "[]");

  for (let i = 0; i < cartItems.length; i++) {
    let tr = document.createElement('tr')
    let item = cartItems[i];

    totalPrice = totalPrice + (item.price * (item.count ? item.count : 1));
    tr.innerHTML = '<td><img src="' + item.images[0] + '" width="auto" height="40"></td><td>' + item.name + '</td><td>' + item.price + 'kr</td><td id="count_' + i + '">' + (item.count ? item.count : 1) + '</td><td><button onclick="addProduct(' + i + ')" class="btn btn-primary" id="plus">+</button><button class="btn btn-danger" onclick="removeProduct(' + i + ')">-</button></td>'
    tr.className = 'product-tr'
    table.appendChild(tr)
    if (cartItems.length - 1 == i) {
      let tr = document.createElement('tr')
      tr.innerHTML = '<th>Total Price</th><th id="totalPrice" style="text-align: center" colspan="4">' + totalPrice + '</th>'
      tr.className = 'bg-primary';
      table.appendChild(tr)
      table.className = 'table mt-4';
      localStorage.setItem("totalPrice", JSON.stringify(totalPrice))
    }
  }
  list.appendChild(table)
}


function addProduct(id) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems'))
  if (cartItems[id].count != undefined) {
    cartItems[id].count++
  } else {
    cartItems[id].count = 2
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  document.getElementById('count_' + id).innerText = cartItems[id].count
  let price = document.getElementById('totalPrice')
  price.innerHTML = parseInt(price.innerText) + cartItems[id].price
  this.shopBasket()
}

function removeProduct(id) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems'))
  if (cartItems[id].count != undefined && cartItems[id].count > 1) {
    cartItems[id].count--;
    document.getElementById('count_' + id).innerText = cartItems[id].count
  } else if (cartItems[id].count == undefined || cartItems[id].count == 1) {
    cartItems.splice(id, 1)
    document.getElementsByClassName('product-tr')[id].style.display = 'none'
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  let price = document.getElementById('totalPrice')
  if (cartItems[id] && cartItems.length > 0)
    price.innerHTML = parseInt(price.innerText) - cartItems[id].price
  this.shopBasket()
}

function backToHomepage() {
  window.location = "index.html"
}