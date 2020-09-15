let stripe;
window.addEventListener("load", main);

function main() {
  /*
      const toCheckout = document.getElementById('toCheckout')
      toCheckout.addEventListener('click', proceedToCheckout) */

  stripe = Stripe(
    "pk_test_51HMqSzB979vlbHgipDCCEbRksJjH513MddC8fw21FjfEy8DuJXosMnVFVTIZugCBKPgVwoy59rqRfmr2lrn0G8I100oKXpFnx8"
  );
  products();
}

/* async function proceedToCheckout() {
    try {
        const response = await fetch('/api/checkout-session', { method: 'POST'})
        const session = await response.json()
        // Proceed to open the checkout page
        const result = await stripe.redirectToCheckout({ sessionId: session.id});
    } catch (error) {

    }
} */

async function products() {
  let div1 = document.getElementById("products");
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
    div3.appendChild(divImg);


    let div4 = document.createElement("div");
    div4.className = "card-body";
    div3.appendChild(div4);
    let p = document.createElement("p");
    p.className = "card-text";
    p.innerText = "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.";
    div4.appendChild(p);
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
      addProductCart(product.name);
    };
    div6.appendChild(btn);
  }

  function addProductCart(name) {
    let productToAdd = name;
    for (let i = 0; i < productList.data.length; i++) {
      if (productToAdd == productList.data[i].name) {
        console.log(productList.data[i]);
        cartArray.push(productList.data[i]);
        console.log('clear', localStorage.length)

      }
    }


    console.log(cartArray);
    cartArray.map((value, key) => {
      localStorage.setItem(
        key,
        JSON.stringify(
          value
        )
      )
    })
    var itemCount = document.getElementById('itemCount');
    if (cartArray.length == 1) itemCount.style.opacity = 1
    itemCount.innerText = cartArray.length
  }

  if (response.status > 400) {
    console.log(productList.error);
  }
}

function shopBasket() {
  var list = document.getElementById('productList')
  var table = document.createElement('table')

  var tr = document.createElement('tr')
  tr.innerHTML = '<th>Image</th><th>Name</th><th>Price</th>'
  table.appendChild(tr)
  for (var i = 0; i <= localStorage.length; i++) {
    var tr = document.createElement('tr')
    tr.innerHTML = '<td><img src="' + JSON.parse(localStorage.getItem(i)).images[0] + '" width="auto" height="40"></td><td>' + JSON.parse(localStorage.getItem(i)).name + '</td><td>99$</td>'
    table.appendChild(tr)
    console.log(i, table)
    if (localStorage.length - 1 == i) {
      console.log('test', table)
      list.appendChild(table)
    }
  }



  // var values = [],
  //     keys = Object.keys(localStorage),
  //     i = keys.length;
  //   console.log()
  // while (i--) {
  //   values.push(localStorage.getItem(keys[i]));
  //   console.log(localStorage.getItem(keys[i]));
  // }
  // console.log(values);
  // return values;
}

// function for returning to homepage from cartpage
function backToHomepage() {
  window.location = "index.html"
}