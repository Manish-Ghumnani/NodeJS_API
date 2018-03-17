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
/*!40101 SET character_set_client = @saved_cs_client */;
