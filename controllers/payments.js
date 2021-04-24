var mysql = require('mysql');
var request = require('request');



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
        amount:req.body.amount,
        user_id:req.body.user_id
    }
    console.log(paymentDetails)
    con.query(
        `
            UPDATE payments SET amount_paid = amount_paid + ${paymentDetails.amount}, 
                balance = total_amount - amount_paid, payment_status = true
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
            con.query(
                `
                    UPDATE balance SET balance = balance - ${paymentDetails.amount} 
                    WHERE userid = ${paymentDetails.user_id}
                `,
                (err, result) => {
                    if(err){
                        console.log('wallet not updated')
                        return
                    }
                    console.log('wallet balance updated')
                }
            )
            con.query(
                `
                    INSERT INTO wallet (userid, transaction_type, amount )
                    VALUES ("${paymentDetails.user_id}", "debit", "${paymentDetails.amount}");
                `,
                (err, result) => {
                    if(err){
                        console.log('payment not inserted into table')
                        return
                    }
                    console.log('payment inserted into table')
                }
            )
            con.query(
                `
                    UPDATE orders SET delivery_status = 'Enroute'
                    WHERE id = ${paymentDetails.order_id}
                `,
                (err, result) => {
                    if(err){
                        console.log('wallet not updated')
                        return
                    }
                    console.log('wallet balance updated')
                }
            )
        }
    )
}

const verifyPayment = (req, res) => {
    // console.log(req.body)
    var options = {
    'method': 'GET',
    'url': `https://api.flutterwave.com/v3/transactions/${req.body.transaction_id}/verify`,
    'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer FLWSECK_TEST-c9b9b3a648bbce712c86c49fa77fdb2e-X'
    }
    };
    request(options, function (error, response) { 
        
        if(error){
            res.status(500).json({success:false,message:'payment could not be verified'})
            return
        } 
        ///////
        let flutterwaveResponse = JSON.parse(response.body)
        // console.log(flutterwaveResponse)
        
        if(flutterwaveResponse.status == 'success' && flutterwaveResponse.data.amount >= req.body.amount){
            res.status(200).json({succes:true,message:'payment has been verified'})
            con.query(
                `
                    INSERT INTO wallet (userid, transaction_type, amount )
                    VALUES ("${req.body.user_id}", "credit", "${req.body.amount}");
                `,
                (err, result) => {
                    if(err){
                        // res.status(500).json({success:false, message:'something went wrong'})
                        return
                    }
                    // res.status(200).json({success:true, message:'payment has been updated'})
                    /////UPDATE BALANCE STARTS
                    con.query(
                        `
                            UPDATE balance SET balance = balance + ${req.body.amount}
                            WHERE userid = ${req.body.user_id}
                        `,
                        (err, result) => {
                            // console.log(err)
                            // console.log(result)
                            if(err){
                                // res.status(500).json({success:false, message:'something went wrong'})
                                return
                            }
                            // res.status(200).json({success:true, message:'payment has been updated'})
                        }
                    )
                    //UPDATE BALANCE ENDS
                }
            )
        }
        //////////
        else{
            res.status(500).json({success:false,message:'payment could not be verified!'})
        }
    });
}

const getPaymentsByUserID = (req,res) => {
    con.query(
        `SELECT * FROM wallet WHERE userid = ${req.params.id}`,
        (err,response) => {
            if(err){
                // console.log(err)
                res.status(500).json({success:false,message:'no data'})
                return 
            }
            else{
                // console.log(response)
                res.status(200).json({success:true,message:response})
            }
        }
    )
}

const getUserWalletBalance = (req, res) => {
    con.query(
        `SElect * FROM balance WHERE userid = ${req.params.id}`,
        (err, response) => {
            if(err){
                // console.log(err)
                res.status(500).json({success:false,message:'wallet not found'})
                return
            }
            else{
                res.status(200).json({success:true,message:response[0]})
                // console.log(response)
            }
        }
    )
}


module.exports = {
    makePayment,
    verifyPayment,
    getPaymentsByUserID,
    getUserWalletBalance,
}