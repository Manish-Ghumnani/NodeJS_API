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

exports.common_students = function(req,res) {
    var teach_email = req.query.teacher;
    console.log(teach_email);
    var count = teach_email.length;
    if(typeof teach_email === 'string'){
        count = 1;
    }
    //if null return invalid respone
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
        if(student_list.length > 0)
        {
            return res.status(200).send({error: false, data: students, message: 'Successfully retrieved!'});
        }
        else
        {
            return res.status(200).send({error: true , message: 'No records found!'});
        }
        
    });
};