var express = require ('express');
var app = express();
app.use(express.static('public'))
var path = require('path');

app.get('/login',function(req,res){

res.sendFile(__dirname + '/views/login.html');
});

app.get('/home',function(req,res){

res.sendFile(__dirname + '/views/home.html');
});

app.get('/register',function(req,res){

res.sendFile(__dirname + '/views/register.html');
});

app.get('/report',function(req,res){

res.sendFile(__dirname + '/views/report.html');
});

app.get('/finger',function(req,res){

res.sendFile(__dirname + '/views/finger.html');
});
app.listen(3000);