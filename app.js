const express = require('express')
const app = express()
const UsersRoutes = require('./routes/users')
const OrdersRoute = require('./routes/orders')
const PaymentRoute = require('./routes/payments')

var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', (req,res)=>res.send("Logistics API"))

app.use('/users', UsersRoutes)

app.use('/orders', OrdersRoute)

app.use('/payments', PaymentRoute)

app.listen(3000, ()=>console.log("server running on port 3000"))
