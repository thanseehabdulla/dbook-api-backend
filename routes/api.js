var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var squel = require("squel");
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'namoideen',
    database: 'invoice'
});


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


/* register user */
router.post('/register', function (req, res, next) {
    var datas = req.body;
    var name = datas['name'];
    var username = datas['username'];
    var password = datas['password'];
    var email = datas['email'];
    var phone = datas['phone'];
var level = datas['level'];

    var address = datas['address'] ? datas['address'] : 'nil';

    // connection.connect()

    bcrypt.hash(password, 10, function (err, hash) {
    var queryUser = squel.insert()
        .into("user")
        .set("name", name)
        .set("email", email)
         .set("level", level)
        .set("phone", phone)
        .set("username", username)
        .set("password", hash)
        .set("address", address)
        .toString();

        connection.query(queryUser, function (err, rows, fields) {
            if (err) throw err

            console.log(rows);
            res.send({status:'success'})
            // Store hash in database
        })

    });

});




/* register vender */
router.post('/registervender', function (req, res, next) {
    var datas = req.body;
    var vendername = datas['vendername'];
    var trn_no = datas['trn_no'];
   
    // connection.connect()

     var queryUser = squel.insert()
        .into("vender")
        .set("name",vendername)
        .set("trn_no", trn_no)
         .toString();

        connection.query(queryUser, function (err, rows, fields) {
            if (err) throw err

            console.log(rows);
            res.send({status:'success'})
            // Store hash in database
        })

   
});






/* login authentication */
router.post('/login', function (req, res, next) {
    var datas = req.body;
    var username = datas['username'];
    var password = datas['password'];

    var queryLogin = "select * from user where username='" + username + "'";


    connection.query(queryLogin, function (err, rows, fields) {
        if (err)  throw err;
        if(rows.length > 0) {
            // console.log(rows[0].password);
            bcrypt.compare(password, rows[0].password, function (err, ress) {
                if (ress) {
                    res.send({status:'success',userid:rows[0].id,level:rows[0].level});
                } else {
                    res.send({status:'invalid'});
                    // Passwords don't match
                }
            });
        }else{
            res.send({status:'invalid'});
        }

        // connection.end()
    })


});

/* add purchase */
router.post('/purchase', function (req, res, next) {
    var datas = req.body;
    var vendername = datas['vendername'];
    var trn_no = datas['trn_no'];
    var invoice_date = datas['date_invoice'];
    var amount = datas['amount'];
    var vat = datas['vat'];
    var total = datas['total'];
    var invoice_number = datas['invoice_number'];
    var userid = datas['userid'];



    var queryDashboard = squel.insert()
        .into("purchase")
        .set("vendername", vendername)
        .set("trn_no", trn_no)
        .set("date_invoice", invoice_date)
        .set("amount", amount)
        .set("vat", vat)
        .set("total", total)
        .set("userid",userid)
        .set("invoice_number", invoice_number)
        .toString();

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('purchase insert successful');
        res.send({status:'success',
        desc:'purchase entry successful'});
        // connection.end()
    })


});


/* get all user */
router.get('/user', function (req, res, next) {
    var queryDashboard = "select * from user";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('purchase get successful');
        res.send({data:rows});
        // connection.end()
    })

});

/* get all purchase */
router.get('/purchase', function (req, res, next) {

    var queryDashboard = "select * from purchase";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('purchase get successful');
        res.send({data:rows});
        // connection.end()
    })

});


/* get all vender */
router.get('/vender', function (req, res, next) {

    var queryDashboard = "select * from vender";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('vender get successful');
        res.send({data:rows});
        // connection.end()
    })

});




/* get all purchase with id */
router.get('/purchase/:userid', function (req, res, next) {
    var userid = req.params.userid; 
    var queryDashboard = "select * from purchase where userid='"+userid+"'";

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('purchase get successful');
        res.send({data:rows});
        // connection.end()
    })

});


/* get purchase with vendername*/
router.get('/purchase/:vendername', function (req, res, next) {
    // res.send('repond with dashboard page');
    var vendername = req.params.vendername;
  

    var queryDashboard = "select * from purchase where vendername='"+vendername+"'";

    connection.query(queryDashboard, function (err, rows, fields) {

        if (err) res.send({status:'invalid'});

        console.log('purchase get successful');
        // var result = rows.map(data => data.name);
        res.send({data:rows});

        // connection.end()
    })

});


/* add sales */
router.post('/sales', function (req, res, next) {
    var datas = req.body;
    var date = datas['date'];
    var net_total = datas['net_total'];
    var tax = datas['tax'];
    var net_sales = datas['net_sales'];
    var userid = datas['userid'];
 

    var queryDashboard = squel.insert()
        .into("sales")
        .set("date", date)
        .set("net_total", net_total)
        .set("tax", tax)
        .set("userid",userid)
        .set("net_sales", net_sales)
        .toString();

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('sales insert successful');
        res.send({status:'success',
        desc:'sales entry successful'});
        // connection.end()
    })


});


/* get all sales*/
router.get('/sales', function (req, res, next){

var queryDashboard = "select * from sales";
    
    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('sales get successful');
        res.send({data:rows});
        // connection.end()
    })

});




/* get all sales with id*/
router.get('/sales/:userid', function (req, res, next) {
var userid = req.params.userid; 
    
var queryDashboard = "select * from sales where userid='"+userid+"'";
    
    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('sales get successful');
        res.send({data:rows});
        // connection.end()
    })

});


/* get purchase with vendername*/
router.get('/sales/:date', function (req, res, next) {
    // res.send('repond with dashboard page');
    var date = req.params.date;
    var userid = req.params.userid; 


    var queryDashboard = "select * from sales where date='"+date+"'";

    connection.query(queryDashboard, function (err, rows, fields) {

        if (err) res.send({status:'invalid'});

        console.log('sales get successful');
        // var result = rows.map(data => data.name);
        res.send({data:rows});

        // connection.end()
    })

});




module.exports = router;
