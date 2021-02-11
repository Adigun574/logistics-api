require('dotenv').config()

var mysql = require('mysql');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database:process.env.DB_DATABASE
    });

//REGISTER USER
const register = (req,res) => {
    let newUser = {
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        referral_code:req.body.referral_code,
        points:10
    }
      
    if(newUser.password.length<6){
        res.status(400).json({success:false,message:"password must be at least six character long"})
        return
    }
    if(newUser.phone.length<11){
        res.status(400).json({success:false,message:"invalid phone number"})
        return
    }
    if(!newUser.email.includes('@')){
        res.status(400).json({success:false,message:"invalid email"})
        return
    }

    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash
        // console.log(newUser)
        con.connect(function(err) {
            if (err) throw err;
            // console.log("Connected!");
            //CHECK FOR EXISTING EMAIL
            //CHECK FOR EXISTING PHONE NUMBER
            con.query(`SELECT * FROM users WHERE email = '${newUser.email}' OR phone = '${newUser.phone}'`, (err,rows) => {
                if(err) throw err;          
                console.log(rows);
                if(rows.length == 0){
                    console.log("Save User")
                    con.query(
                        `
                            INSERT INTO users (name, email, phone, password, address, referral_code, points )
                            VALUES ("${newUser.name}", "${newUser.email}", "${newUser.phone}", "${newUser.password}", "${newUser.address}", "${newUser.referral_code}", ${newUser.points});
                         `
                    ,(err,data) => {
                        if(err) throw err
                        console.log(data)
                        res.status(201).json({success:true,message:"user has been created"})
                    })
                    
                }
                else{
                    console.log("User exists")
                    res.status(400).json({success:false,message:"user already exists"})
                }
            })
        });
    });

}


//AUTHENTICATE USER
const authenticate = (req, res) => {

    con.query(`SELECT * FROM users where email = '${req.body.email}'`, (err,data)=>{
        if(err) throw err
        // console.log(data)
        if(data.length == 0){
            res.status(400).json({success:false,message:"user does not exist"})
        }
        else{
            bcrypt.compare(req.body.password, data[0].password, function(err, result) {
                // result == true
                if(result){
                    res.status(200).json({success:true,message:data[0]})
                }
                else{
                    res.status(400).json({success:false,message:"invalid credentials"})
                }
            });
        }
    })
}

module.exports = {
    register,
    authenticate
}


// CREATE TABLE `sql2392263`.`users` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `name` VARCHAR(45) NOT NULL,
//     `email` VARCHAR(45) NOT NULL,
//     `phone` VARCHAR(45) NOT NULL,
//     `password` VARCHAR(45) NOT NULL,
//     `address` VARCHAR(45) NOT NULL,
//     `referral_code` VARCHAR(45) NULL,
//     `points` INT NULL,
//     PRIMARY KEY (`id`));

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "000000",
//     database:"logistics"
//     });

// var con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database:"logistics"
//     });

// var con = mysql.createConnection({
//     host: 'sql2.freemysqlhosting.net',
//     user: 'sql2392263',
//     password: 'xK2%fJ2%',
//     database:"sql2392263"
//     });