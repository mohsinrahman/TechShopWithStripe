const express = require('express')
require('dotenv').config('.env')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express();

app.use('/api', express.json())

app.use(express.static('public'))

app.post('/api/checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                description: 'iphone x',
                price_data: {
                    currency: "sek",
                    product_data: {
                        name: "phone",
                    },
                    unit_amount: 1200,
                },
                quantity: 1,
            }, ],
            mode: "payment",
            success_url: "http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000",
        });
        res.json({
            id: session.id
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            error
        })
    }
})

app.get('/api/products', async (req, res) => {

    const products = await stripe.products.list({

    });
    console.log(products)
    res.json(products)
});

app.listen(3000, () => console.log('Server is running on port 3000'))