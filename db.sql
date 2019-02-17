-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: s3
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendence`
--

DROP TABLE IF EXISTS `attendence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `attendence` (
  `student_id` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `Is_leave` tinyint(4) DEFAULT '0',
  `Is_holiday` tinyint(4) DEFAULT '0',
  `is_delete` tinyint(4) DEFAULT '0',
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  `reason` varchar(45) DEFAULT NULL,
  `finger` varchar(45) DEFAULT NULL,
  `is_present` tinyint(4) DEFAULT '0',
  `attendence_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`attendence_id`),
  UNIQUE KEY `uniq` (`student_id`,`date`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendence`
--

LOCK TABLES `attendence` WRITE;
/*!40000 ALTER TABLE `attendence` DISABLE KEYS */;
INSERT INTO `attendence` VALUES (2,'pranit','2019-02-17',0,0,0,'2019-02-17 12:41:07','2019-02-17 12:41:07','','',1,1),(2,NULL,'2019-01-22',1,0,0,NULL,NULL,'test',NULL,0,2),(2,NULL,'2019-01-26',1,0,0,NULL,NULL,'test',NULL,0,3);
/*!40000 ALTER TABLE `attendence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `parent` (
  `user_id` varchar(45) NOT NULL,
  `android_id` varchar(45) NOT NULL,
  `is_delete` tinyint(4) DEFAULT NULL,
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`android_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parentofstudent`
--

DROP TABLE IF EXISTS `parentofstudent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `parentofstudent` (
  `s_user_id` varchar(50) NOT NULL,
  `p_user_id` varchar(45) NOT NULL,
  `is_delete` tinyint(4) DEFAULT NULL,
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  `parent_of_student_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`parent_of_student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parentofstudent`
--

LOCK TABLES `parentofstudent` WRITE;
/*!40000 ALTER TABLE `parentofstudent` DISABLE KEYS */;
INSERT INTO `parentofstudent` VALUES ('1','2',NULL,NULL,NULL,1),('2','3',NULL,NULL,NULL,2);
/*!40000 ALTER TABLE `parentofstudent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parents`
--

DROP TABLE IF EXISTS `parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `parents` (
  `u_id` varchar(50) DEFAULT NULL,
  `android_id` varchar(45) DEFAULT NULL,
  `is_delete` tinyint(4) DEFAULT NULL,
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  `parent_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parents`
--

LOCK TABLES `parents` WRITE;
/*!40000 ALTER TABLE `parents` DISABLE KEYS */;
/*!40000 ALTER TABLE `parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student` (
  `name` varchar(50) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `rollno` varchar(45) DEFAULT NULL,
  `finger` varchar(2000) DEFAULT NULL,
  `is_delete` tinyint(4) DEFAULT NULL,
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES ('bhushan','computer','123','Register_thumb/1_thumb_AnsiTemplate.ansi',NULL,NULL,NULL,1,'imbhush99@gmail.com'),('pranit','computer','1234','Register_thumb/2_thumb_AnsiTemplate.ansi',NULL,NULL,NULL,2,'pranitlahane@gmail.com');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `Emai` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `branch` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `is_delete` tinyint(4) DEFAULT NULL,
  `update` datetime DEFAULT NULL,
  `add` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('admin','admin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),('bhushan','bhushan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,2),('pranit','pranit',NULL,NULL,NULL,NULL,NULL,NULL,NULL,3);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-17 13:08:32
