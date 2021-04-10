const express = require('express')
const app = express()
var cors = require('cors')
const UsersRoutes = require('./routes/users')
const OrdersRoute = require('./routes/orders')
const PaymentRoute = require('./routes/payments')

const port = process.env.PORT || 3000

app.use(cors())

var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', (req,res)=>res.send("Logistics API"))

app.use('/users', UsersRoutes)

app.use('/orders', OrdersRoute)

app.use('/payments', PaymentRoute)

app.listen(port, ()=>console.log("server running on port 3000"))
