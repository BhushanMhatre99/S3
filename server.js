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

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "s3"
});

//////////////////////////////
//views
app.get('/home', function(req, res){
   res.render('home');
});

app.get('/login',function(req,res){
    res.render('login',{login_failed:false});
});

app.get('/finger',function(req,res){
  res.render('finger');
});

app.get('/register', function(req, res){
   res.render('register');
});

app.get('/attendence',function(req,res){
    con.query('select student_id ,date,Is_leave,Is_holiday,reason,is_present from attendence', function (err, recordset) {
            console.log(recordset);
                       if (err){
                        console.log(err)
                        }
                         else{
                         res.render('attendence', { attendence: recordset });
                         }
    });

  });
app.get('/report',function(req,res){
  con.query('select name,class,email,rollno from student', function (err, recordset) {
            console.log(recordset);
            if (err){
                console.log(err)
                }
            else{
             res.render('report', { report: recordset });
             }
    });

});

app.get('/register_finger', function(req, res){
   res.render('register_finger');
});


app.get('/test', function(req, res){
   res.sendFile(__dirname+('/html_backup/finger.html'))
});
//////////////////////////////




//-------------------API---------------------------//

app.post('/APP_login', function(req, res){
    console.log(req.body.username);
    username=req.body.username;
    console.log(req.body.password);
    password=req.body.password;
    // DB login check
    res.setHeader('Content-Type', 'application/json');
    con.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields)
        {
                if (error) {
                    console.log("error occurred",error);
                  }
                else{
                  console.log('The solution is: ', results);
                  if(results.length >0){
                    if(results[0].password == password){
                        res.send(JSON.stringify({ "is_login": true,"student_id":1 }, null, 3));
                    }
                    else
                        {
                            res.send(JSON.stringify({ "is_login": false,"student_id":1 }, null, 3));
                        }
                    }
                    else{
                    res.send(JSON.stringify({ "is_login": false,"student_id":1 }, null, 3));
                    }

                  }
                }

    );
});

app.post('/APP_report', function(req,res){
    var student_id=(req.body.student_id);
    con.query('SELECT * FROM attendence WHERE student_id  = ?',[student_id], function (error, results, fields) {

        if (error) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "Result": [] }, null, 3));
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "Result": [results] }, null, 3));
        }


    });
});

app.post('/APP_leave', function(req,res){
var student_id=req.body.student_id;
var reason=req.body.reason;
var date=req.body.date;
console.log(req.body.date)
console.log(req.body.reason)


var sql = "insert into attendence (student_id,reason,date) values ('"+student_id+"','"+reason+"','"+date+"')";
 con.query(sql, function (err, result) {
            if (err) throw err;
                console.log("1 row inserted")
    });
 res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({ "Result": true }, null, 3));
});

//---------------CONTROLLER-----------------------//


app.post('/register_finger_0', function(req, res){
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            student_id_inserted=fields.student_id_inserted_str;

            var child = require('child_process').execFile('java', [
                            '-jar','s3_thumb_register.jar' ]);
                        // use event hooks to provide a callback to execute when data are available:
            child.stdout.on('data', function(data) {

                            if(data.indexOf("MFS100AutoCapture Quality =") > -1) {
                                console.log(`stdout: ${data}`);
                                var arr = data.split("=");
                                console.log(parseInt(arr[1]));
                                if(parseInt(arr[1])>50){

                                    // copy file in register thumb
                                    fs.readFile('thumb_AnsiTemplate.ansi', function (err, data) {
                                        fs.writeFile("Register_thumb/"+student_id_inserted+'_thumb_AnsiTemplate.ansi', data, function (err) {
                                            newpath="Register_thumb/"+student_id_inserted+'_thumb_AnsiTemplate.ansi';
                                           // update finger print in DB
                                            var sql = "UPDATE student SET finger = '"+newpath+"' WHERE student_id = '"+student_id_inserted+"'";
                                            con.query(sql, function (err, result) {
                                                if (err) {
                                                    console.log("error");
                                                    }
                                             });

                                           res.render('register',{register_successful:true});
                                        });
                                    });

                                }else{
                                    res.render('register_finger',{student_id_inserted_str:student_id_inserted});
                                }
                            }
                            //res.render('register');
            });
            child.stderr.on('data', (data) => {
              //console.log(`stderr: ${data}`);

            });

            child.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
        });
});

app.post('/validate_login',function(req,res){

var username= req.body.username;
var password = req.body.password;

con.query('SELECT * FROM user WHERE username = ?',[username], function (error, results, fields) {
console.log("Running at Port 3000");
if (error) {
  console.log("error occurred",error);

  }else{
  console.log('The solution is: ', results);

      if(results.length >0){
      if(results[0].password == password){
          res.render('register');
      }
      }
      else{
    console.log("error");

    res.render('login',{login_failed:true});

  }

}
});
});



app.post('/attendance', function(req, res){


            var child = require('child_process').execFile('java', [
                            '-jar','s3_thumb_register.jar' ]);
                        // use event hooks to provide a callback to execute when data are available:
            child.stdout.on('data', function(data) {
                            is_matched_flag=false;
                            if(data.indexOf("MFS100AutoCapture Quality =") > -1) {
                                console.log(`stdout: ${data}`);
                                var arr = data.split("=");
                                console.log(parseInt(arr[1]));
                                if(parseInt(arr[1])>50){
                                    // copy file in register thumb
                                    fs.readFile('thumb_AnsiTemplate.ansi', function (err, data) {
                                        fs.writeFile("thumb/thumb_AnsiTemplate.ansi", data, function (err) {
                                              // get all student ansi files
                                                con.query('SELECT name,student_id,finger FROM student where finger is not NULL', function(err, rows, fields) {
                                                if (err) throw err;

                                                  for (var i = 0; i < rows.length; i++) {
                                                        console.log(rows[i].name);

                                                        var child_compare_ansi = require('child_process').execSync('java -jar s3_match.jar '+rows[i].finger+' thumb/thumb_AnsiTemplate.ansi').toString();
                                                                    // use event hooks to provide a callback to execute when data are available:
                                                        child_compare_ansi_arr=child_compare_ansi.split('\n')
                                                        for(var i_output=0;i_output<child_compare_ansi_arr.length;i_output++)
                                                        {
                                                            if (child_compare_ansi_arr[i_output].indexOf("SUCCESS") > -1)
                                                            {
                                                                        is_matched_flag=true
                                                                        console.log('user matched')

                                                                        //store in DB
                                                                        var sql = "INSERT INTO `attendence`(`student_id`,`name`,`date`,`Is_leave`,`Is_holiday`,`is_delete`,`update`,`add`,`reason`,`finger`,`is_present`) VALUES ('"+rows[i].student_id+"','"+rows[i].name+"',NOW(),'0','0','0',NOW(),NOW(),'','','1')";
                                                                        con.query(sql, function (err, result) {
                                                                            if (err) throw err;
                                                                            res.render('finger',{is_matched_flag:true})
                                                                        });



                                                                        break;
                                                            }
                                                        }
                                                        if(is_matched_flag==true)
                                                        {
                                                            break
                                                        }


                                                    }
                                                    if(is_matched_flag==false)
                                                        {
                                                            res.render('finger',{is_matched_flag:false})
                                                        }
                                                });


                                             // res.render('finger')
                                         });
                                    });
                                }
                                else{
                                    //res.render('finger',{is_matched_flag_bol:is_matched_flag})
                                }
                            }
                            else{
                                //res.render('finger',{is_matched_flag_bol:is_matched_flag})
                            }
            });
            child.stderr.on('data', (data) => {
              //console.log(`stderr: ${data}`);

            });

            child.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
});


app.post('/register_0', function(req, res){

        var name=req.body.name;
        var email=req.body.email;
        var cls=req.body.cls;
        var rno=req.body.rno;
        var student_id_inserted=null;
        var sql = "INSERT INTO student (name , email,class ,rollno) VALUES ('"+name+"', '"+email+"','"+cls+"','"+rno+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            student_id_inserted=result.insertId;
            console.log(student_id_inserted);
            res.render('register_finger',{student_id_inserted_str:student_id_inserted});
        });

});

app.post('/report_0',function(req,res){
    con.query('select * from attendence', function (err, recordset) {
            console.log(recordset);
            if (err){
                console.log(err)
                }
            else{
             res.render('report', { report: recordset });
             }
    });
});







app.listen(3000,'0.0.0.0');

