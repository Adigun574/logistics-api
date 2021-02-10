const express = require('express')

const Orders = require('../controllers/orders')


const router = express.Router()


router.post('/create', (req, res) => {
    Orders.createOrder(req,res)
})

router.get('/getall', (req, res) => {
    Orders.getAllOrders(req, res)
})

router.get('/getordersbyuserid/:id', (req, res) => {
    Orders.getOrdersByUserID(req,res)
})

router.post('/quickquote', (req,res) => {
    Orders.getQuickQuote(req,res)
})

//UPDATE ORDER

module.exports = router

//Order Received, In Transit, Delivered