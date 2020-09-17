let stripe;
window.addEventListener("load", main);

function main() {



  stripe = Stripe(
    "pk_test_51HMqSzB979vlbHgipDCCEbRksJjH513MddC8fw21FjfEy8DuJXosMnVFVTIZugCBKPgVwoy59rqRfmr2lrn0G8I100oKXpFnx8"
  );

  products();
  const toCheckout = document.getElementById('toCheckout')
  toCheckout.addEventListener('click', proceedToCheckout)
}

async function proceedToCheckout() {
  try {
    const response = await fetch('/api/checkout-session', {
      method: 'POST'
    })
    const session = await response.json()
    // Proceed to open the checkout page
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
  } catch (error) {

  }
}

async function products() {
  let cartArray = [];
  let div1 = document.getElementById("products");
  const response = await fetch("/api/products", {
    method: "GET"
  });
  const productList = await response.json();

  for (let i = 0; i < productList.data.length; i++) {
    console.log(productList);
    const product = productList.data[i];
    let div2 = document.createElement("div");
    console.log(div1);
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
      cartArray.push(product)
      addProductCart(product.name, cartArray);

    };
    div6.appendChild(btn);
  }

  function addProductCart(name, cartArray) {
    console.log(cartArray)

    let productToAdd = name;
    for (let i = 0; i < cartArray.length; i++) {
      let push = true
      if (productToAdd == cartArray.name) {
        if (cartArray.length > 0) {
          cartArray.map((value, key) => {
            if (value.name == cartArray[i].name) {
              let object = cartArray[i]
              object.count ? object['count'] = object.count + 1 : object['count'] = 2
              push = false;
            }
            // if(cartArray.length == key){
            // }
          })
          /*   if (push)
              cartArray.push(productList.data[i]); */
        }
        /* else
                 cartArray.push(productList.data[i]); */

      }
    }
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
  console.log(list)
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

  console.log({
    cartItems
  })

  for (let i = 0; i < cartItems.length; i++) {
    let tr = document.createElement('tr')
    let item = cartItems[i];

    console.log({
      item
    })

    totalPrice = totalPrice + (item.price * (item.count ? item.count : 1));
    tr.innerHTML = '<td><img src="' + item.images[0] + '" width="auto" height="40"></td><td>' + item.name + '</td><td>' + item.price + 'kr</td><td id="count_' + i + '">' + (item.count ? item.count : 1) + '</td><td><button onclick="addProduct(' + i + ')" class="btn btn-primary" id="plus">+</button><button class="btn btn-danger" onclick="removeProduct(' + i + ')">-</button></td>'
    tr.className = 'product-tr'
    table.appendChild(tr)
    if (localStorage.length - 1 == i) {
      let tr = document.createElement('tr')
      tr.innerHTML = '<th>Total Price</th><th id="totalPrice" style="text-align: center" colspan="4">' + totalPrice + '</th>'
      tr.className = 'bg-primary';
      table.appendChild(tr)
      table.className = 'table mt-5';
    }
  }

  list.appendChild(table)
}


function addProduct(id) {
  let item = JSON.parse(localStorage.getItem(id))
  if (item.count)
    item['count'] = item.count + 1
  else
    item['count'] = 2
  localStorage.setItem(id, JSON.stringify(item))
  document.getElementById('count_' + id).innerText = item.count
  let price = document.getElementById('totalPrice')
  price.innerHTML = parseInt(price.innerText) + item.price
}

function removeProduct(id) {
  let item = JSON.parse(localStorage.getItem(id))
  if (item.count && item.count > 1) {
    item['count'] = item.count - 1
    localStorage.setItem(id, JSON.stringify(item))
    document.getElementById('count_' + id).innerText = item.count
  } else if (item.count == undefined || item.count == 1) {
    localStorage.removeItem(id)
    document.getElementsByClassName('product-tr')[id].style.display = 'none'
  }
  let price = document.getElementById('totalPrice')
  price.innerHTML = parseInt(price.innerText) - item.price
}

// function for returning to homepage from cartpage
function backToHomepage() {
  window.location = "index.html"
}