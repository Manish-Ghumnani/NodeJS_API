const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
var host = 'localhost';
// connection configurations
const mc = mysql.createConnection({
    host: host,
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


//get all registered students
app.get('/students/get', function (req, res) {
    mc.query('SELECT * FROM student', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Students List.' });
    });
});

//register students 
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
    return res.status(200).send({error: false, message: "Students successfully added!"});
})
 
//retrieve common students
app.get('/api/commonstudents', function(req,res) {
    var teach_email = req.query.teacher;
    console.log(teach_email);
    var count = teach_email.length;
    if(typeof teach_email === 'string'){
        count = 1;
    }

    if (!teach_email) {
        res.status(400);
        return res.send({ error: true, message: 'Invalid Request!' });
    }
    
    
    mc.query("select stud_email from student where teach_email in (?) group by stud_email having count(distinct teach_email) = ?", [teach_email, count], function(error, results, fields) {
        if (error) throw error;
        var student_list = [];
        for(var i=0;i<results.length;i++) {
            student_list.push(results[i].stud_email)
        }
        var students  = {
           students: student_list
        }
        res.contentType('application/json');
        return res.status(200).send({error: false, data: students, message: 'Successfully retrieved!'});
    });
});

//suspend specific students
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


//retrieve students which can receive notifications
app.post('/api/retrievefornotifications', function(req, res) {
    let teacher = req.body.teacher;
    let notification = req.body.notification;

    let students = notification.split(" ");
    var subscribe_students = [];
    for(var i=2; i<students.length; i++) {
        subscribe_students.push(students[i].substring(1,students[i].length));
    }

    var recepients = [];

    mc.query("select stud_email from student where suspension is null and (teach_email = ? or stud_email in (?))",[teacher, subscribe_students], function(error, results, fields) {
        if(error) throw error;
        for(var i=0; i<results.length; i++) {
            recepients.push(results[i].stud_email);
        }

        var recepient_list = {
            recepients : recepients
        }
        res.contentType('application/json');
        return res.status(200).send({error: false, data: recepient_list, message:"Successfully retrieved!"});
    });
});

// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080);

console.log('Node app is running on port 8080');

/**
 * Export the Express app so that it can be used by Chai
 */
module.exports = app;