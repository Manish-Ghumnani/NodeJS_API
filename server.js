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
    database: 'test'
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
        return res.status(400).send({ error: true, message: "Invalid Request"});
    }

    var data;

    for(var i = 0; i< students.length; i++) {
    
        data = {
            stud_email: students[i],
            teach_email: teacher
        }

        mc.query("insert into student set ?", data , function (error, results, fields) {
            if (error) throw error;
            return res.status(204).send({error: false, message: "Students successfully added!"});
        });
    }
    
})
 
app.get('/api/commonstudents', function(req,res) {
    var teach_email = req.query.teacher;

    if (!teach_email) {
        return res.status(400).send({ error: true, message: 'Invalid Request!' });
    }
    //console.log(teach_email);
    
    mc.query("select distinct stud_email from student where teach_email=?", teach_email, function(error, results, fields) {
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
        res.status(204);
        return res.send({error: false, message: "Student suspended!"});
    });
});

app.post('/api/retrievefornotifications', function(req, res) {
    let teacher = req.body.teacher;
    let notification = req.body.notification;

    let students = notification.split(" ");
    console.log(students[2].substring(1,students[2].length));
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});