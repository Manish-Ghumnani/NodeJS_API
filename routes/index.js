var express = require('express');
var router = express.Router();

// Require controller modules.
var register_controller = require('../controllers/registerController');
var suspend_controller = require('../controllers/suspendController');
var commonstudents_controller = require('../controllers/commonstudentsController');
var retreive_notifications_controller = require('../controllers/retreivenotificationsController');
var retrieve_all_students = require('../controllers/retreiveallstudentsController');


//app

router.get('/', function (req, res) {
    res.render('index', {title: 'API'});
});

//retreiving all students
router.get('/getAll', retrieve_all_students.retieve_all_students);

//resgistering students
router.post('/register',register_controller.register_students);

//retrieve list of common students
router.get('/commonstudents', commonstudents_controller.common_students);

//suspend a specified student
router.post('/suspend',suspend_controller.suspden_students);

//retrieve students who can receive notifications
router.post('/retrievefornotifications', retreive_notifications_controller.retreive_notifications);

module.exports = router;