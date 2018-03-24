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

exports.retieve_all_students = function (req, res) {
    mc.query('SELECT distinct stud_email FROM student', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Students List.' });
    });
};