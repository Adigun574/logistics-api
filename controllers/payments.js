var mysql = require('mysql');


// var con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database:"logistics"
//     });
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.DB_DATABASE
    });

const makePayment = (req, res) => {
    let paymentDetails = {
        order_id:req.body.order_id,
        amount:req.body.amount
    }
    con.query(
        `
            UPDATE payments SET amount_paid = amount_paid + ${paymentDetails.amount}, 
                balance = total_amount - amount_paid
                WHERE order_id = ${paymentDetails.order_id}
        `,
        (err, result) => {
            // console.log(err)
            // console.log(result)
            if(err){
                res.status(500).json({success:false, message:'something went wrong'})
                return
            }
            res.status(200).json({success:true, message:'payment has been updated'})
        }
    )
}

module.exports = {
    makePayment
}