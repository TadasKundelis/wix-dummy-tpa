-- MySQL dump 10.13  Distrib 8.0.15, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: apps
-- ------------------------------------------------------
-- Server version	8.0.15

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
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `components` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `compID` varchar(15) NOT NULL,
  `instanceID` varchar(45) NOT NULL,
  `message` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `compID_UNIQUE` (`compID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
INSERT INTO `components` VALUES (50,'comp-juwri1kl','54cea219-1506-4793-8353-774b3f5c1586','vow, such a boring message'),(51,'comp-juwrjozt','5026acaf-25f2-437a-8977-9c05ea68e0c9','new message asdfasdfasdf'),(53,'comp-juwro7rt','5026acaf-25f2-437a-8977-9c05ea68e0c9','new message new message'),(54,'comp-juwrnv9y','5026acaf-25f2-437a-8977-9c05ea68e0c9',''),(55,'comp-juwrvvko','5026acaf-25f2-437a-8977-9c05ea68e0c9','new message'),(56,'comp-juwrwht1','5026acaf-25f2-437a-8977-9c05ea68e0c9','new message asdfasdfasdfasdfadsf'),(57,'comp-juwrxs5b','54cea219-1506-4793-8353-774b3f5c1586','message not found'),(58,'comp-juwryt01','54cea219-1506-4793-8353-774b3f5c1586','another message'),(59,'comp-juxwnwzx','54cea219-1506-4793-8353-774b3f5c1586','brand new one'),(60,'comp-juy0b12u','54cea219-1506-4793-8353-774b3f5c1586','totally new'),(61,'comp-juy2srg2','54cea219-1506-4793-8353-774b3f5c1586','let me tell you something'),(62,'comp-jv2g6ajo','5026acaf-25f2-437a-8977-9c05ea68e0c9','totally new totally totally'),(63,'comp-jv2g7mai','5026acaf-25f2-437a-8977-9c05ea68e0c9','post post kuku ');
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-30 14:55:25
