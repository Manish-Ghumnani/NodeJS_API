// connection configurations
const mysql = require('mysql');
var host = 'localhost';
const mc = mysql.createConnection({
    host: host,
    user: 'root',
    password: 'manish', 
    database: 'test',
    charset: 'utf8'
});
// connect to database
mc.connect(); 

exports.retreive_notifications = function(req, res) {
    let teacher = req.body.teacher;
    let notification = req.body.notification;
    //if null return invalid respone
    if (!teacher || !notification) {
        res.status(400);
        return res.send({ error: true, message: 'Invalid Request!' });
    }
    let students = notification.split(" ");
    var subscribe_students = [];
    for(var i=2; i<students.length; i++) {
        subscribe_students.push(students[i].substring(1,students[i].length));
    }

    var recepients = [];

    mc.query("select distinct stud_email from student where suspension is null and (teach_email = ? or stud_email in (?))",[teacher, subscribe_students], function(error, results, fields) {
        if(error) throw error;
        for(var i=0; i<results.length; i++) {
            recepients.push(results[i].stud_email);
        }

        var recepient_list = {
            recepients : recepients
        }
        res.contentType('application/json');
        if(recepient_list.length > 0){
            return res.status(200).send({error: false, data: recepient_list, message:"Successfully retrieved!"});
        }
        else
        {
            return res.status(200).send({error: true , message: 'No records found!'});
        }
    });
};