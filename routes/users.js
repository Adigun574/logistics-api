const express = require('express')
const router = express.Router()
const Users = require('../controllers/users')

router.get('/', (req,res) => {
    res.send("Welcome to Users Route")
})

router.post('/register', (req,res) => {
    Users.register(req, res)
})

router.post('/authenticate', (req,res)=>{
    Users.authenticate(req,res)
})

module.exports = router