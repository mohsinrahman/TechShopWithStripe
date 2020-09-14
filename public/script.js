let stripe;
window.addEventListener("load", main);

function main() {
  stripe = Stripe(
    "pk_test_51HMqSzB979vlbHgipDCCEbRksJjH513MddC8fw21FjfEy8DuJXosMnVFVTIZugCBKPgVwoy59rqRfmr2lrn0G8I100oKXpFnx8"
  );
  products();
}
console.log("div1");
async function products() {
  let div1 = document.getElementById("products");

  console.log("div1");
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

    /* let li = document.createElement("li");
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
    AddtoCart.onclick = function () {
      addProductCart(product.name);
    };
    li.appendChild(AddtoCart); */
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