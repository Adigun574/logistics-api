const { Router } = require('express')
const express = require('express')
const Payment = require('../controllers/payments')

const router = express.Router()

router.post('/makepayment', (req, res) => {
    Payment.makePayment(req, res)
})

router.post('/verifypayment', (req, res) => {
    Payment.verifyPayment(req, res)
})

router.get('/getpaymentsbyuserid/:id', (req, res) => {
    Payment.getPaymentsByUserID(req, res)
})

router.get('/getuserwalletbalance/:id', (req, res) => {
    Payment.getUserWalletBalance(req, res)
})

module.exports = router