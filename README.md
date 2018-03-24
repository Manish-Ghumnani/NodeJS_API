
# NodeJS_API

A System for teachers to perform admin functions for their students. 

Consists of a set of API endpoints which provides these functionalities -
  1. A teacher can register multiple students.
  2. A student can be registered under multiple teachers.
  3. Teachers can retrieve all students common to all of them.
  4. Teacher can suspend a student.
  5. Teachers can send notifications to students to inform students of important announcements.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Technology Stack
```
node js (server)
express js (api)
mocha & chai (unit testing)
mysql (db)
docker (not in scope)
```

### Installing

A step by step series of examples that tell you how to get a development env running

Node JS app dependencies
```
npm install express body-parser --save
npm install mocha chai chai-http --save-dev
```

1. Running the app ->
  var host = 'localhost';   //change in server.js

 * Open terminal(in the project directory) and enter
```
node server.js
```
Access through ->
url: http://localhost:8080/api


2. Running inside a Docker ->
  var host = 'mysql';    //change in server.js 

Go to the project folder:
  * Open terminal with the project path and run 
```
docker-compose up --build
```
  * Open one more terminal and run the following:
 ```
docker exec -it nodeassignment_mysql_1 bash     
mysql
CREATE DATABASE IF NOT EXISTS test;
GRANT ALL PRIVILEGES on test.*
TO 'root'@'%' IDENTIFIED BY 'manish'
WITH GRANT OPTION;

USE test;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS student 
(stud_id int(11) NOT NULL AUTO_INCREMENT,
  stud_email varchar(45) NOT NULL,
  teach_email varchar(45) NOT NULL,
  suspension tinyint(1) DEFAULT NULL,
  PRIMARY KEY (stud_id)
) DEFAULT CHARSET=utf8;
CREATE UNIQUE INDEX student_teacher
ON student (stud_email, teach_email);
 ```
Here nodeassignment_mysql_1 is the mysql container, run docker ps to check the name of the container created for you. 

Access through ->
url: http://localhost:49160/api

## Running the tests

* Open terminal(in the project directory) and enter
```
npm test
```

## Screenshots
## Tested on public cloud

### 1. As a teacher, I want to be able to register one or more students to a specified teacher.
![alt text](/screens/api_register.png "Title")

### 2. As a teacher, I want to be able to provide a list of teachers and retrieve a list of students common to all of them (i.e. students who are registered to ALL of them).
![alt text](/screens/api_commonstudents_singleteacher.png "Title")

![alt text](/screens/api_commonstudents_multipleteachers.png "Title")


### 3. As a teacher, I want to be able to suspend a specified student.
![alt text](/screens/api_suspend.png "Title")


### 4. As a teacher, I should be able to retrieve all student emails that can receive notifications from a teacher's email.
![alt text](/screens/api_retreivenotifications.png "Title")


