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
var dateFormat = require('dateformat');
var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))


               //--------------Database connectivity--------------//

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "s3"
});


  //------------------views--------------------//

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
    con.query('select student_id,name ,date,Is_leave,Is_holiday,reason,is_present from attendence', function (err, recordset) {
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






//-------------------API---------------------------//

app.post('/APP_login', function(req, res){
        console.log('api_login');
    username=req.body.username;
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
                        user_id=results[0].user_id
                        con.query('SELECT * FROM parentofstudent WHERE p_user_id = ?',[user_id], function (error, parentofstudent_results, fields)
                        {
                            if (error) {
                                console.log("error occurred",error);
                            }
                            else{
                                if(parentofstudent_results.length >0){
                                    res.send(JSON.stringify({ "is_login": true,"student_id":parentofstudent_results[0].s_user_id }, null, 3));
                                }
                                else
                                {
                                    res.send(JSON.stringify({ "is_login": false,"message":'please enter correct details' }, null, 3));
                                }
                            }
                            });

                    }
                    else
                        {
                            res.send(JSON.stringify({ "is_login": false,"message":'please enter correct details' }, null, 3));
                        }
                  }
                    else{
                    res.send(JSON.stringify({  "is_login": false,"message":'please enter correct details' }, null, 3));
                    }

                }
        }

    );
});

app.post('/APP_report', function(req,res){
    console.log('test')
    var student_id=(req.body.student_id);
    con.query('SELECT * FROM attendence WHERE student_id  = ?',[student_id], function (error, results, fields) {

        if (error) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "Result": [] }, null, 3));
        }else{
            res.setHeader('Content-Type', 'application/json');

            for(var i=0;i<results.length;i++)
            {
                results[i]['date']=dateFormat(results[i]['date'], "yyyy-mm-dd");
                if(results[i]['Is_leave']==false){
                    results[i]['Is_leave']=false
                }
                else{
                    results[i]['Is_leave']=true
                }
                if(results[i]['Is_holiday']==false){
                    results[i]['Is_holiday']=false
                }
                else{
                    results[i]['Is_holiday']=true
                }
                if(results[i]['is_present']==false){
                    results[i]['is_present']=false
                }
                else{
                    results[i]['is_present']=true
                }
                if(results[i]['is_delete']==0){
                    results[i]['is_delete']=false
                }
                else{
                    results[i]['is_delete']=true
                }
                // console.log(results[i]);
            }

            console.log(JSON.stringify({ "Result": results }));

            res.send(JSON.stringify({ "Result": results }, null, 3));
            //console.log("prnait code ",JSON.stringify({ "Result": results }));
            //console.log("Mayur code ",{"Result": [{"student_id": 1,"date": "2019-01-30T18:30:00.000Z","Is_leave": "0","Is_holiday": "0","is_delete": "0","update": "2019-01-31T12:50:28.000Z","add": "2019-01-31T12:50:28.000Z","reason": "","finger": "","is_present": "1","attendence_id": 4,"name": "Bushan"}]})

            //res.send(, null, 3);
        }


    });
});

app.post('/APP_leave', function(req,res){
    var student_id=req.body.student_id;
    var reason=req.body.reason;
    var date=req.body.date;
    res.setHeader('Content-Type', 'application/json');
    result_status=true
    result_message="leave applied successfully"
        var sql = "insert into attendence (Is_leave,Is_holiday,is_present,student_id,reason,date) values (True,False,False,'"+student_id+"','"+reason+"','"+date+"')";
         con.query(sql, function (err, result) {
                    if (err) {
                    console.log('error')
                        result_status=false
                        result_message="leave applied failed!"
                        res.send(JSON.stringify({ "result": result_status,"message":result_message }, null, 3));
                    }
                    else{
                        result_status=true
                        result_message="leave applied successfully"
                        res.send(JSON.stringify({ "result": result_status,"message":result_message }, null, 3));
                    }

         });

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
                                            if (err)
                                            {
                                                 if(err.errno==1062){
                                                    res.render('finger',{is_already_attend:true,is_matched_flag:false});
                                                    }
                                                 else{
                                                    res.render('finger',{is_already_attend:false,is_matched_flag:false});
                                                 }

                                            }
                                            else{

                                            res.render('finger',{is_already_attend:false,is_matched_flag:true})

                                            }
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
                                    res.render('finger',{is_already_attend:false,is_matched_flag:false})
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
        var parent_username=req.body.username;
        var parent_password=req.body.password;
        var student_id_inserted=null;
        var sql = "INSERT INTO student (name , email,class ,rollno) VALUES ('"+name+"', '"+email+"','"+cls+"','"+rno+"')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            student_id_inserted=result.insertId;

            // user create
            var sql = "INSERT INTO user (username,password) VALUES ('"+parent_username+"', '"+parent_password+"')";
            con.query(sql, function (err, user_result) {
                if (err) throw err;
                user_id_inserted=user_result.insertId;
                console.log(user_id_inserted);

                // student parent link

                    var sql = "INSERT INTO parentofstudent (s_user_id ,p_user_id) VALUES ('"+student_id_inserted+"', '"+user_id_inserted+"')";
                    con.query(sql, function (err, user_result) {
                        if (err) throw err;
                        user_id_inserted=user_result.insertId;
                        console.log(user_id_inserted);
                            res.render('register_finger',{student_id_inserted_str:student_id_inserted});
                    });

            });

            console.log(student_id_inserted);

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

