const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manish',
    database: 'test',
    charset: 'utf8'
});
 
// connect to database
mc.connect(); 
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'some error occured!' })
});

app.get('/students/get', function (req, res) {
    mc.query('SELECT * FROM student', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Students List.' });
    });
});

app.post('/api/register', function(req, res) {
    console.log(req.body);
    let teacher = req.body.teacher;
    let students = req.body.students;

    if(!teacher || !students) {
        res.status(400).send({ error: true, message: "Invalid Request"});
    }

    var data;
    for(var i = 0; i< students.length; i++) {
    
        data = {
            stud_email: students[i],
            teach_email: teacher
        }

        mc.query("insert into student set ?", data , function (error, results, fields) {
            if (error)
            {
                flag = 0;
                console.log(error.stack);
                console.log(error.code);
                throw error;
            }
            return 0;
        });
    }
    res.status(200).send({error: false, message: "Students successfully added!"});
})
 
app.get('/api/commonstudents', function(req,res) {
    var teach_email = req.query.teacher;
    console.log(teach_email);
    //teacher_list = [];
    var count = teach_email.length;
    if(typeof teach_email === 'string'){
        count = 1;
    }

    if (!teach_email) {
        res.status(400);
        return res.send({ error: true, message: 'Invalid Request!' });
    }
    //console.log(teach_email);
    
    mc.query("select stud_email from student where teach_email in (?) group by stud_email having count(distinct teach_email) = ?", [teach_email, count], function(error, results, fields) {
        if (error) throw error;
        var student_list = [];
        //console.log(fields)
        for(var i=0;i<results.length;i++) {
            student_list.push(results[i].stud_email)
        }
        var students  = {
           students: student_list
        }
        res.contentType('application/json');
        return res.send({error: false, data: students, message: 'Successfully retrieved!'});
    });
});

app.post('/api/suspend', function(req, res) {
    let student = req.body.student;
    console.log(student);
    mc.query("update student set suspension = 1 where stud_email=?", student, function(error, results, fields) {
        if(error) throw error;
        console.log(results);
        res.status(200);
        return res.send({error: false, message: "Student suspended!"});
    });
});

app.post('/api/retrievefornotifications', function(req, res) {
    let teacher = req.body.teacher;
    let notification = req.body.notification;

    let students = notification.split(" ");
    var subscribe_students = [];
    for(var i=2; i<students.length; i++) {
        subscribe_students.push(students[i].substring(1,students[i].length));
    }
    //console.log(subscribe_students);
    //console.log(students[2].substring(1,students[2].length));
    var recepients = [];

    mc.query("select distinct stud_email from student where suspension is null and (teach_email = ? or stud_email in (?))",[teacher, subscribe_students], function(error, results, fields) {
        if(error) throw error;
        console.log(results);
        for(var i=0; i<results.length; i++) {
            recepients.push(results[i].stud_email);
	    console.log(results[i].stud_email);
        }
        var recepient_list = {
            recepients : recepients
        }
        res.contentType('application/json');
        return res.send({error: false, data: recepient_list, message:"Successfully retrieved!"});
    });
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});
