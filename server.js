const express = require("express");
require("dotenv").config(".env");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const HandyStorage = require("handy-storage");
const storage = new HandyStorage({
    beautify: true
});
storage.connect("./order.json");

var localStorage = require("localStorage");
localStorage.getItem("totalPrice");
console.log(localStorage);
const app = express();

app.use("/api", express.json());

app.use(express.static("public"));
/* const totalamount = require(JSON.parse(localStorage.getItem("totalPrice"))); */


/* storage.setState({
  name: "Alireza",
  visited: storage.state.visited || 0
}); */

app.post("/api/checkout-session", async (req, res) => {
    console.log(res);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "sek",
                    product_data: {
                        name: "Total Amount"
                    },
                    unit_amount: "myValue"
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000"
        });
        res.json({
            id: session.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error
        });
    }
});

app.get("/api/products", async (req, res) => {
    const products = await stripe.products.list({});
    const prices = await stripe.prices.list({});
    products.data.forEach(product => {
        prices.data.forEach(price => {
            if (price.product == product.id) {
                product.price = price.unit_amount;
                product.priceId = price.id;
            }
        });
    });
    res.json(products);
});

app.listen(3000, () => console.log("Server is running on port 3000"));