'use strict';

const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('API endpoint /api', function() {  
  this.timeout(5000); // How long to wait for a response (ms)
 
  before(function() {
    console.log("Running mocha tests!");
  });
 
  after(function() {
    console.log("Finished running tests!");
  });

  // GET - Invalid path
  it('should return Not Found', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .then(function(res) {
        throw new Error('Path exists!');
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
 
  // POST - Register specified students
  it('should register the specified students', function() {
    return chai.request(app)
      .post('/api/register')
      .send({
        "teacher": "teacherken@gmail.com",
        "students":
          [
            "studentjon2@example.com"
          ]
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(false);
      });
  });

  // POST - Bad Request (teacher or student(s) not specified or null)
  it('should return Bad Request', function() {
    return chai.request(app)
      .post('/api/register')
      .send({
        "teacher": "",
        "students":
          [
            "studentjon@example.com"
          ]
      })
      .then(function(res) {
        throw new Error('Invalid content type!');
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });

  //POST - Suspend a student
  it('should suspend a specified student', function(){
    return chai.request(app)
    .post('/api/suspend')
    .send({
        "student" : "studentjon@example.com"
    })
    .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(false);
    });
  });

 
  // GET - List all common students for single teacher
  it('should retrieve students common to the teacher specified in the request', function() {
    return chai.request(app)
      .get('/api/commonstudents')
      .query({ teacher : 'teacherken@gmail.com' })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(false);
        expect(res.body.data.students).to.be.an('array');
      });
  });

  // GET - List all common students for more than one teacher
  it('should retrieve students common to all teachers specified in the request', function() {
    return chai.request(app)
      .get('/api/commonstudents')
      .query({ teacher : ['teacherken@gmail.com', 'teacherjoe@gmail.com'] })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal(false);
        expect(res.body.data.students).to.be.an('array');
      });
  });

 
  
  //POST - Retreive all students that can receive notifications
  it('should retreive all students that can receive notifications', function(){
    return chai.request(app)
    .post('/api/retrievefornotifications')
    .send({
        "teacher":  "teacherken@example.com",
        "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
      
    })
    .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.be.an('object');
        expect(res.body.error).to.equal(false);
    })
  });
 
});