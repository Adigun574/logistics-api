const { Router } = require('express')
const express = require('express')
const Payment = require('../controllers/payments')

const router = express.Router()

router.post('/makepayment', (req, res) => {
    Payment.makePayment(req, res)
})

module.exports = router