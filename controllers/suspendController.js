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

exports.suspden_students = function(req, res) {
    let student = req.body.student;
    //if null return invalid respone
    if (!student) {
        res.status(400);
        return res.send({ error: true, message: 'Invalid Request!' });
    }
    console.log(student);
    mc.query("update student set suspension = 1 where stud_email=?", student, function(error, results, fields) {
        if(error) throw error;
        //console.log(results.affectedRows);
        if(results.affectedRows > 0){
        res.status(200);
        return res.send({error: false, message: "Student suspended!"});
        }
        else{
            return res.status(200).send({error: true, message: "Student record not found!"});
        }
    });
};