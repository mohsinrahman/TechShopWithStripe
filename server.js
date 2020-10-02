const express = require('express')
require('dotenv').config('.env')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const fs = require('fs')

const app = express();

app.use('/api', express.json())

app.use(express.static('public'))

app.post('/api/checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: req.body,
            mode: "payment",
            success_url: "http://localhost:3000/confirmation.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000",
        });
        res.json({ id: session.id })
        console.log(session.id)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

app.post('/api/verify-checkout-session', async (req, res) => {
    try {
        const ordersInJson = await fs.readFileSync('./orders.json', "utf8")

        let existingOrders = [];
        if (ordersInJson.length) {
            existingOrders = JSON.parse(ordersInJson)
            const oldOrder = existingOrders.find(order => order.sessionId == req.body.sessionId)
            if (oldOrder) {
                res.json({ isVerified: false })
                return;
            }
        }

        const session = await stripe.checkout.sessions.retrieve(req.body.sessionId)
        if (session.payment_status == "paid") {
            const verifiedOrder = await stripe.checkout.sessions.listLineItems(session.sessionId)
            verifiedOrder.sessionId = req.body.sessionId
            existingOrders.push(verifiedOrder)
            await fs.writeFileSync('/orders.json', JSON.stringify(existingOrders, null, 2))
            res.json({ isVerified: true })
        } else {
            res.json({ isVerified: false })
        }
    } catch (error) {
        console.error(error)
        res.json({ isVerified: false })
    }
});

app.get('/api/products', async (req, res) => {

    const products = await stripe.products.list({});
    const prices = await stripe.prices.list({});
    products.data.forEach(product => {
        prices.data.forEach(price => {
            if (price.product == product.id) {
                product.price = price.unit_amount
                product.priceId = price.id
            }
        });
    });
    res.json(products)
});


app.listen(3000, () => console.log('Server is running on port 3000'))
