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

// ///FLUTTERWAVE PAYMENT VERIFICATION METHOD
// var request = require('request');
// var options = {
//   'method': 'GET',
//   'url': 'https://api.flutterwave.com/v3/transactions/2043679/verify',
//   'headers': {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer FLWSECK_TEST-c9b9b3a648bbce712c86c49fa77fdb2e-X'
//   }
// };
// request(options, function (error, response) { 
//   if (error) throw new Error(error);
//   console.log(response.body); 
// });
