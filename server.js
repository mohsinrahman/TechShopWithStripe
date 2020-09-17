const express = require('express')
require('dotenv').config('.env')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const fs = require('fs')

const orders = require(__dirname+'/orders.json');

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
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
})

app.post('/api/verify-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.body.sessionId)
        if(session) {
            if(session.payment_status==='paid') {
                res.json({ isVerified: true })
                // creating a new file
                fs.writeFile('orders.json', JSON.stringify(orders), function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                  });
            } else {
                throw new Error('not paid')
            }
        } else {
            throw new Error('no session')
        }
    } catch (error) {
        console.error(error)
        res.send({ isVerified: false });        
    }     
    
});

app.get('/api/products', async (req, res) => {

    const products = await stripe.products.list({});
    const prices = await stripe.prices.list({});
    products.data.forEach(product => {
        prices.data.forEach(price => {
            if(price.product == product.id) {
                product.price = price.unit_amount
                product.priceId = price.id
            }
        });
    });
    res.json(products)
});


app.listen(3000, () => console.log('Server is running on port 3000'))
