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


exports.register_students = function(req, res) {
    console.log(req.body);
    let teacher = req.body.teacher;
    let students = req.body.students;

    //if null return invalid respone
    if(!teacher || !students) {
        return res.status(400).json({ error: true, message: "Invalid Request"});
    }

    var data_records = [];
    for(var i = 0; i< students.length; i++) {
        
        //if invalid email id return invalid response
        if(validateEmail(students[i]) && validateEmail(teacher)){
            var data = {stud_email: students[i], teach_email:teacher};
            data_records.push(data);
        }
        else{
            res.status(200).json({error: true, message: "One or more of the email Ids is invalid"});
        }
    }
        mc.query("insert into student set ?", data_records , function (error, results, fields) {
            try {
            if(error){
                throw error;
            }
            else
            {
                return res.status(200).json({error: false, message: "Students successfully added!"});
            }
            } catch (error) {
                console.log(error.message);
                res.status(200).json({error: true, message: "Student(s) already registered"});
            }
        
        });
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}