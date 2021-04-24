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

const createOrder = (req, res) => {
    const newOrder = {
        from_location:req.body.from_location,
        from_date:req.body.from_date,
        to_location:req.body.to_location,
        to_date:req.body.to_date,        
        transport_mode:req.body.transport_mode,
        length:req.body.length,
        width:req.body.width,
        height:req.body.height || '0',
        weight:req.body.weight,
        measurement_unit:req.body.measurement_unit || 'default',
        delivery_status:'Order Received',
        user_id:req.body.user_id,
        //
        price:req.body.price,
        sname:req.body.sname,
        sphone:req.body.sphone,
        rname:req.body.rname,
        rphone:req.body.rphone
    }

    console.log(newOrder)
    // return 

    if(!newOrder.from_location || !newOrder.from_date ||  
        !newOrder.to_location || !newOrder.to_date ||
        !newOrder.transport_mode || !newOrder.length ||
        !newOrder.width || !newOrder.height ||
        !newOrder.weight || !newOrder.measurement_unit ||
        !newOrder.user_id || !newOrder.sname ||
        !newOrder.sphone || !newOrder.rname || 
        !newOrder.rphone
        ){
            res.status(400).json({success:false,message:'incomplete fields'})
        }
    else{
        con.query(
            `
                INSERT INTO orders (from_location, from_date, to_location, to_date, transport_mode,
                    length, width, height, weight, measurement_unit, delivery_status, user_id,
                    sname, sphone, rname, rphone
                    )
                VALUES ("${newOrder.from_location}", "${newOrder.from_date}", "${newOrder.to_location}",
                    "${newOrder.to_date}", "${newOrder.transport_mode}", "${newOrder.length}",
                    "${newOrder.width}", "${newOrder.height}", "${newOrder.weight}",
                    "${newOrder.measurement_unit}", "${newOrder.delivery_status}", "${newOrder.user_id}",
                    "${newOrder.sname}", "${newOrder.sphone}", "${newOrder.rname}", "${newOrder.rphone}"
                )
            `
        ,(err, result) => {
            // console.log(result)
            // console.log(err)
            if(err){
                res.status(500).json({success:false, message:'something went wrong'})
            }
            else{
                // console.log(result.insertId)
                let createdOrderID = result.insertId
                // //SET PRICE
                // const price = 1000 + Math.random()*1000 + Math.random()*500
                // console.log(price)

                res.status(201).json({success:true, message:'order created'})
                con.query(
                    `
                        INSERT INTO payments (total_amount, amount_paid, balance, payment_status, order_id)
                        VALUES (${newOrder.price}, ${0}, ${newOrder.price}, ${false}, ${createdOrderID})
                    `,
                    (err, result1) => {
                        // console.log(err)
                        // console.log(result1)
                    }
                )
            }
        })
    }}

const getAllOrders = (req, res) => {
    con.query(`SELECT * FROM orders`, (err, result) => {
        if(err){
            res.status(500).json({success:false, message:[]})
        }
        else{
            res.status(201).json({success:true, message:result})
        }
    })
}

const getOrdersByUserID = (req, res) => {
    // con.query(`SELECT * FROM orders where user_id = '${req.params.id}'`, (err, result) => {
    //     if(err){
    //         res.status(500).json({success:false, message:[]})
    //     }
    //     else{
    //         res.status(200).json({success:true,message:result})
    //     }
    // })
    // `SELECT *
    // FROM orders
    // INNER JOIN payments ON orders.id=payments.order_id where user_id = '${req.params.id}';`
    
    // con.query(`SELECT payments.total_amount, payments.payment_status, orders.delivery_status, orders.from_date, orders.id, payments.order_id, 
    //     FROM orders
    //     INNER JOIN payments ON orders.id=payments.order_id where user_id = '${req.params.id}';`, (err, result) => {
    
    con.query(`SELECT payments.total_amount, orders.user_id, payments.payment_status, orders.delivery_status, orders.from_date, orders.id, payments.order_id
    FROM orders
    INNER JOIN payments ON orders.id=payments.order_id where user_id = '${req.params.id}';`, (err, result) => {

        console.log(err)
        if(err){
            res.status(500).json({success:false, message:[]})
        }
        else{
            res.status(200).json({success:true,message:result})
        }
    })
}

const getQuickQuote = (req, res) => {
    // const price = 1000 + Math.random()*1000 + Math.random()*500
    const price = Math.floor(Math.random() * 10000)
    res.status(200).json({success:true,message:Math.floor(price)})
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUserID,
    getQuickQuote
}