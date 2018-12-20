var express = require('express');
var app = require('express')();
var path = require('path');
var router = express.Router();
var multer  =   require('multer');
var upload = multer({dest:'/public'})

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
app.use(express.static(__dirname + "/public"));
app.set("view engine","jade")
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "s3"
});



app.get('/home', function(req, res){

   res.sendFile(__dirname + '/views/home.html');
});
/*
app.get('/login', function(req, res){
con.query("SELECT * FROM info", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.sendFile(__dirname + '/views/login.html');
});
  });*/

app.get('/login',function(req,res){


   res.sendFile(__dirname + '/views/login.html');
});
/*app.get('/finger',function(req,res){


   res.sendFile(__dirname + '/views/finger.html');
});

app.get('/register',function(req,res){


   res.sendFile(__dirname + '/views/register.html');
});*/

app.post('/validate_login', function(req, res){
var username= req.body.username;
var password = req.body.password;
console.log(username);
console.log(password);

con.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
console.log("Running at Port 3000");
if (error) {
  console.log("error ocurred",error);

  }else{
  console.log('The solution is: ', results);

      if(results.length >0){
      if(results[0].password == password){
       res.sendFile(__dirname + '/views/register.html');
      }
      else{
    console.log("erroror");

     res.sendFile(__dirname + '/views/login.html')
    }
  }

}
});
});




app.get('/register', function(req, res){

res.sendFile(__dirname + '/views/register.html')

});

app.get('/report', function(req, res){
/*var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
      var oldpath = files.finger.path;
      var newpath = 'Register_thumb/' + files.finger.name;
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
      });*/
            con.query('select* from student', function(err,recordset){
        if(err)
        console.log(err).

        else
        res.render('report',{report:recordset});

});
 res.sendFile(__dirname + '/views/report.jade');
});





app.post('/validate_registration', function(req, res){
var name=req.body.name;
  var email=req.body.email;
  var cls=req.body.cls;
  var rno=req.body.rno;
  var finger=req.body.finger;

console.log(req.body);

  console.log('You sent the name "' + name+'".\n');


  var sql = "INSERT INTO student (name , email,class ,rollno, finger) VALUES ('"+name+"', '"+email+"','"+cls+"','"+rno+"','"+finger+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });

    var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
      var oldpath = files.finger.path;
      var newpath = 'thumb/' + files.finger.name;
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
      });

res.sendFile(__dirname + '/views/finger.html');
});




app.get('/finger', function(req, res){

/*var name=req.body.name;
  var email=req.body.email;
  var cls=req.body.cls;
  var rno=req.body.rno;
  var finger=req.body.finger;

console.log(req.body);

  console.log('You sent the name "' + name+'".\n');


  var sql = "INSERT INTO student (name , email,class ,rollno, finger) VALUES ('"+name+"', '"+email+"','"+cls+"','"+rno+"','"+finger+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    });

    var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
      var oldpath = files.finger.path;
      var newpath = 'thumb/' + files.finger.name;
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
      });*/

res.sendFile(__dirname + '/views/finger.html');
});

app.post('/validate_report', function(req, res){
var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
      var oldpath = files.finger.path;
      var newpath = 'Register_thumb/' + files.finger.name;
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
      });
            con.query('select* from student', function(err,recordset){
        if(err)
        console.log(err)
        else
        res.render('report',{report:recordset});

});
   res.sendFile(__dirname + '/views/report.jade');
});


app.listen(3000);

