var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var squel = require("squel");
const bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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


/* register user */
router.put('/user', function (req, res, next) {
    var datas = req.body;
    var name = datas['name'];
    var username = datas['username'];
    var password = datas['password'];
    var email = datas['email'];
    var phone = datas['phone'];
    var level = datas['level'];
    var id = datas['id'];

    var address = datas['address'] ? datas['address'] : 'nil';

    // connection.connect()

    bcrypt.hash(password, 10, function (err, hash) {
    var queryUser = squel.update()
        .table("user")
        .set("name", name)
        .set("email", email)
         .set("level", level)
        .set("phone", phone)
        .set("username", username)
        .set("password", hash)
        .set("address", address)
        .where("id="+id)
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


/* update vender */
router.put('/vender', function (req, res, next) {
    var datas = req.body;
    var vendername = datas['vendername'];
    var trn_no = datas['trn_no'];
    var id = datas['id'];
   
    // connection.connect()

     var queryUser = squel.update()
        .table("vender")
        .set("name",vendername)
        .set("trn_no", trn_no)
         .where("id ="+id)
         .toString();

        connection.query(queryUser, function (err, rows, fields) {
            if (err) throw err

            console.log(rows);
            res.send({status:'success'})
            // Store hash in database
        })

   
});


/* update purchase */
router.put('/purchase', function (req, res, next) {
    var datas = req.body;
    var vendername = datas['vendername'];
    var trn_no = datas['trn_no'];
    var invoice_date = datas['date_invoice'];
    var amount = datas['amount'];
    var vat = datas['vat'];
    var total = datas['total'];
    var invoice_number = datas['invoice_number'];
    var userid = datas['userid'];
    var id = datas['id'];


    var queryDashboard = squel.update()
        .table("purchase")
        .set("vendername", vendername)
        .set("trn_no", trn_no)
        .set("date_invoice", invoice_date)
        .set("amount", amount)
        .set("vat", vat)
        .set("total", total)
        .set("userid",userid)
        .set("invoice_number", invoice_number)
         .where("id ="+id)
        .toString();

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('purchase update successful');
        res.send({status:'success',
        desc:'purchase entry successful'});
        // connection.end()
    })


});


/* update sales */
router.put('/sales', function (req, res, next) {
    var datas = req.body;
    var date = datas['date'];
    var net_total = datas['net_total'];
    var tax = datas['tax'];
    var net_sales = datas['net_sales'];
    var userid = datas['userid'];
    var id = datas['id'];
 

    var queryDashboard = squel.update()
        .table("sales")
        .set("date", date)
        .set("net_total", net_total)
        .set("tax", tax)
        .set("userid",userid)
        .set("net_sales", net_sales)
         .where("id ="+id)
        .toString();

        console.log(queryDashboard);

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('sales update successful');
        res.send({status:'success',
        desc:'sales entry successful'});
        // connection.end()
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
    var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = mm + '/' + dd + '/' + yyyy;



    var queryDashboard = squel.insert()
        .into("purchase")
        .set("vendername", vendername)
        .set("trn_no", trn_no)
        .set("date_invoice", invoice_date)
        .set("amount", amount)
        .set("vat", vat)
        .set("total", total)
        .set("userid",userid)
        .set("created_at",today)
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


/* delete vender */
router.delete('/vender/:rowid', function (req, res, next) {
    var rowid = req.params.rowid;
    var queryDashboard = "DELETE FROM vender where id="+rowid;

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('vender delete successful');
        res.send({status:'success'});
        // connection.end()
    })

});

/* delete sales */
router.delete('/sales/:rowid', function (req, res, next) {
    var rowid = req.params.rowid;
    var queryDashboard = "DELETE FROM sales where id="+rowid;

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('sales delete successful');
        res.send({status:'success'});
        // connection.end()
    })

});


/* delete purchase */
router.delete('/purchase/:rowid', function (req, res, next) {
    var rowid = req.params.rowid;
    var queryDashboard = "DELETE FROM purchase where id="+rowid;

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('purchase delete successful');
        res.send({status:'success'});
        // connection.end()
    })

});

/* delete user */
router.delete('/user/:userid', function (req, res, next) {
    var userid = req.params.userid;
    var queryDashboard = "DELETE FROM user where id="+userid;

    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid',err:err});

        console.log('vender delete successful');
        res.send({status:'success'});
        // connection.end()
    })

});



/* get all purchase with id mobile */
router.get('/purchasem/:userid', function (req, res, next) {
    var userid = req.params.userid; 
    var queryDashboard = "select * from purchase where userid='"+userid+"' ORDER BY id DESC LIMIT 20";
 
    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});
 
        console.log('purchase get successful');
        res.send({data:rows});
        // connection.end()
    })

});




/* get all purchase with id */
router.get('/purchase/:userid', function (req, res, next) {
    var userid = req.params.userid; 
    var queryDashboard = "select * from purchase where userid='"+userid+"' ORDER BY id DESC";

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

/* get purchase with daterange*/
router.get('/purchase/:startdate/:enddate/:userid/:option', function (req, res, next) {
    // res.send('repond with dashboard page');
    var startdate = req.params.startdate;
    var enddate = req.params.enddate;
     var userid = req.params.userid;
      var option = req.params.option;
  startdate = startdate.split('-')[0]+"/"+startdate.split('-')[1]+"/"+startdate.split('-')[2]
   enddate = enddate.split('-')[0]+"/"+enddate.split('-')[1]+"/"+enddate.split('-')[2]
 if(option === "purchase"){
 if(userid !== 'default')
    var queryDashboard = "select * from purchase WHERE userid='"+userid+"' and STR_TO_DATE(date_invoice,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";
   else
    var queryDashboard = "select * from purchase WHERE STR_TO_DATE(date_invoice,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";
    }else{
        if(userid !== 'default')
    var queryDashboard = "select * from purchase WHERE userid='"+userid+"' and STR_TO_DATE(created_at,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";
   else
    var queryDashboard = "select * from purchase WHERE STR_TO_DATE(created_at,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";
    }
    console.log(queryDashboard);
    connection.query(queryDashboard, function (err, rows, fields) {

        if (err) res.send({status:'invalid'});

        console.log('purchase get successful');
        // var result = rows.map(data => data.name);
        res.send({data:rows});

        // connection.end()
    })

});


/* get sales with daterange*/
router.get('/sales/:startdate/:enddate/:userid', function (req, res, next) {
    // res.send('repond with dashboard page');
    var startdate = req.params.startdate;
    var enddate = req.params.enddate;
var userid = req.params.userid;
    startdate = startdate.split('-')[0]+"/"+startdate.split('-')[1]+"/"+startdate.split('-')[2]
    enddate = enddate.split('-')[0]+"/"+enddate.split('-')[1]+"/"+enddate.split('-')[2]
  
    if(userid !== 'default')
    var queryDashboard = "select * from sales WHERE userid='"+userid+"' and STR_TO_DATE(date,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";
    else
var queryDashboard = "select * from sales WHERE STR_TO_DATE(date,'%m/%d/%Y') BETWEEN str_to_date('"+startdate+"','%m/%d/%Y') AND str_to_date('"+enddate+"','%m/%d/%Y')";        
    console.log(queryDashboard);
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
    
var queryDashboard = "select * from sales where userid='"+userid+"' ORDER BY id DESC";
    
    connection.query(queryDashboard, function (err, rows, fields) {
        if (err) res.send({status:'invalid'});

        console.log('sales get successful');
        res.send({data:rows});
        // connection.end()
    })

});


/* get all sales with id mobile*/
router.get('/salesm/:userid', function (req, res, next) {
var userid = req.params.userid; 
    
var queryDashboard = "select * from sales where userid='"+userid+"' ORDER BY id DESC LIMIT 20";
    
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
