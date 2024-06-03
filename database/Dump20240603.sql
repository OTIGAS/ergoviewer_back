-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ergoviewer
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id_address` int NOT NULL AUTO_INCREMENT,
  `id_company` int DEFAULT NULL,
  `number` varchar(10) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `complement` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_address`),
  KEY `id_company` (`id_company`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`id_company`) REFERENCES `company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,1,'83','R. Dom Pedro I','Cidade Nova I','Indaiatuba','SP','13334-100',NULL,'2024-05-23 15:45:53','2024-05-26 06:55:04',NULL),(2,3,'83','R. Dom Pedro I','Cidade Nova I','Indaiatuba','SP','13334-100',NULL,'2024-05-23 15:47:15','2024-05-26 06:55:04',NULL),(3,1,'83','R. Dom Pedro I','Cidade Nova I','Indaiatuba','SP','13334-100',NULL,'2024-05-23 18:10:17','2024-05-26 06:55:04',NULL),(4,1,'83','R. Dom Pedro I','Cidade Nova I','Indaiatuba','SP','13334-100',NULL,'2024-05-23 18:11:07','2024-05-26 06:55:04',NULL),(5,4,'83','Rua Dom Pedro I','Cidade Nova','Indaiatuba','SP','13334-100','Faculdade','2024-05-26 15:14:43','2024-05-26 23:27:34','2024-05-26 23:27:34'),(6,4,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-05-26 23:18:59','2024-05-26 23:18:59',NULL);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analysis`
--

DROP TABLE IF EXISTS `analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analysis` (
  `id_analysis` int NOT NULL AUTO_INCREMENT,
  `id_department` int DEFAULT NULL,
  `id_user` int DEFAULT NULL,
  `analysis_name` varchar(50) DEFAULT NULL,
  `analysis_image` varchar(255) DEFAULT NULL,
  `analysis_description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_analysis`),
  KEY `id_department` (`id_department`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `analysis_ibfk_1` FOREIGN KEY (`id_department`) REFERENCES `department` (`id_department`),
  CONSTRAINT `analysis_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analysis`
--

LOCK TABLES `analysis` WRITE;
/*!40000 ALTER TABLE `analysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id_company` int NOT NULL AUTO_INCREMENT,
  `id_mediator` int DEFAULT NULL,
  `type_company` int NOT NULL,
  `name_company` varchar(50) DEFAULT NULL,
  `cnpj_company` varchar(18) DEFAULT NULL,
  `more_information` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_company`),
  UNIQUE KEY `cnpj_company` (`cnpj_company`),
  KEY `id_mediator` (`id_mediator`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`id_mediator`) REFERENCES `company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,NULL,1,'Empresa Ergonômica 01','00.000.000/0000-00','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et mattis metus. Curabitur dui lacus, consectetur eget eros vel, pharetra consectetur leo. Maecenas at malesuada nulla. Nulla vitae orci porta, facilisis lectus quis, finibus purus.','2024-05-23 15:45:53','2024-06-03 11:18:55',NULL),(3,1,2,'Empresa Analizada 01','00.000.000/0000-01','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et mattis metus. Curabitur dui lacus, consectetur eget eros vel, pharetra consectetur leo. Maecenas at malesuada nulla. Nulla vitae orci porta, facilisis lectus quis, finibus purus.','2024-05-23 15:47:15','2024-05-25 05:42:09',NULL),(4,NULL,2,'Empresa que Analisa','00.000.000/0000-02','More Information','2024-05-26 15:14:43','2024-05-26 15:14:43',NULL);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id_contact` int NOT NULL AUTO_INCREMENT,
  `id_company` int DEFAULT NULL,
  `person_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_contact`),
  KEY `id_company` (`id_company`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`id_company`) REFERENCES `company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,1,'Empresa que Analisa 01','empresa01@contato.com','(19) 99527-7858','2024-05-23 15:45:53','2024-05-26 06:58:16',NULL),(2,3,'Empresa Analizada 01','empresa01@contato.com','(19) 99527-7858','2024-05-23 15:47:15','2024-05-26 06:58:16',NULL),(3,4,'Empresa que Analisa','contact@email.com','(11) 98765-4321','2024-05-26 15:14:43','2024-05-26 21:41:25',NULL),(4,4,'Tiago Faria Gouvea','email@contato.com','(11) 98765-4321','2024-05-26 18:04:27','2024-05-26 21:41:18',NULL),(5,4,'Mateus Faria Gouvea','email@contato.com','(11) 11111-1111','2024-05-26 18:12:38','2024-05-27 01:57:51',NULL),(6,4,'Lucas Gouvea','email@contato.com','(11) 11111-1111','2024-05-26 18:17:47','2024-05-26 22:43:56','2024-05-26 22:43:56'),(7,4,'Lucas Faria Gouvea','email@contato.com','(11) 11111-1111','2024-05-26 22:44:18','2024-05-26 22:44:18',NULL);
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id_department` int NOT NULL AUTO_INCREMENT,
  `id_project` int DEFAULT NULL,
  `department_name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_department`),
  KEY `id_project` (`id_project`),
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`id_project`) REFERENCES `project` (`id_project`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `niosh_method`
--

DROP TABLE IF EXISTS `niosh_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `niosh_method` (
  `id_niosh_method` int NOT NULL AUTO_INCREMENT,
  `id_analysis` int NOT NULL,
  `lifted_item` varchar(25) DEFAULT NULL,
  `horizontal_distance` float DEFAULT NULL,
  `vertical_distance` float DEFAULT NULL,
  `vertical_displacement` float DEFAULT NULL,
  `trunk_twist_angle` float DEFAULT NULL,
  `average_lift_frequency` float DEFAULT NULL,
  `grip_quality` float DEFAULT NULL,
  `load_mass` float DEFAULT NULL,
  `recommended_weight_limit` float DEFAULT NULL,
  `lifting_index` float DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`id_niosh_method`),
  KEY `id_analysis` (`id_analysis`),
  CONSTRAINT `niosh_method_ibfk_1` FOREIGN KEY (`id_analysis`) REFERENCES `analysis` (`id_analysis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `niosh_method`
--

LOCK TABLES `niosh_method` WRITE;
/*!40000 ALTER TABLE `niosh_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `niosh_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owas_method`
--

DROP TABLE IF EXISTS `owas_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owas_method` (
  `id_owas_method` int NOT NULL AUTO_INCREMENT,
  `id_analysis` int NOT NULL,
  `arm_posture` int NOT NULL,
  `back_posture` int NOT NULL,
  `leg_posture` int NOT NULL,
  `lifted_load` int NOT NULL,
  `analysis_result` int NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id_owas_method`),
  KEY `id_analysis` (`id_analysis`),
  CONSTRAINT `owas_method_ibfk_1` FOREIGN KEY (`id_analysis`) REFERENCES `analysis` (`id_analysis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owas_method`
--

LOCK TABLES `owas_method` WRITE;
/*!40000 ALTER TABLE `owas_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `owas_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id_project` int NOT NULL AUTO_INCREMENT,
  `id_company_customer` int NOT NULL,
  `id_customer_contact` int NOT NULL,
  `id_customer_address` int NOT NULL,
  `id_company_user` int NOT NULL,
  `id_user_contact` int NOT NULL,
  `id_user_address` int NOT NULL,
  `name_project` varchar(50) DEFAULT NULL,
  `visibility` tinyint DEFAULT NULL,
  `description` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_project`),
  KEY `id_company_customer` (`id_company_customer`),
  KEY `id_customer_contact` (`id_customer_contact`),
  KEY `id_customer_address` (`id_customer_address`),
  KEY `id_company_user` (`id_company_user`),
  KEY `id_user_contact` (`id_user_contact`),
  KEY `id_user_address` (`id_user_address`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`id_company_customer`) REFERENCES `company` (`id_company`),
  CONSTRAINT `project_ibfk_2` FOREIGN KEY (`id_customer_contact`) REFERENCES `contact` (`id_contact`),
  CONSTRAINT `project_ibfk_3` FOREIGN KEY (`id_customer_address`) REFERENCES `address` (`id_address`),
  CONSTRAINT `project_ibfk_4` FOREIGN KEY (`id_company_user`) REFERENCES `company` (`id_company`),
  CONSTRAINT `project_ibfk_5` FOREIGN KEY (`id_user_contact`) REFERENCES `contact` (`id_contact`),
  CONSTRAINT `project_ibfk_6` FOREIGN KEY (`id_user_address`) REFERENCES `address` (`id_address`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,1,1,1,1,1,1,'Nome do Projeto',NULL,'Descrição','2024-06-03 12:40:52','2024-06-03 12:40:52',NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rula_method`
--

DROP TABLE IF EXISTS `rula_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rula_method` (
  `id_rula_method` int NOT NULL AUTO_INCREMENT,
  `id_analysis` int NOT NULL,
  `arm_position` int NOT NULL,
  `forearm_position` int NOT NULL,
  `wrist_position` int NOT NULL,
  `trunk_position` int NOT NULL,
  `group_a_time_of_work` int NOT NULL,
  `group_a_load_supported` int NOT NULL,
  `group_b_time_of_work` int NOT NULL,
  `group_b_load_supported` int NOT NULL,
  `analysis_result` int NOT NULL,
  `description` longtext,
  PRIMARY KEY (`id_rula_method`),
  KEY `id_analysis` (`id_analysis`),
  CONSTRAINT `rula_method_ibfk_1` FOREIGN KEY (`id_analysis`) REFERENCES `analysis` (`id_analysis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rula_method`
--

LOCK TABLES `rula_method` WRITE;
/*!40000 ALTER TABLE `rula_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `rula_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `id_company` int DEFAULT NULL,
  `user_role` int DEFAULT NULL,
  `email_login` varchar(50) DEFAULT NULL,
  `password_login` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `birth_date` varchar(50) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_login` (`email_login`),
  KEY `id_company` (`id_company`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_company`) REFERENCES `company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,1,'testetg02@gmail.com','$2b$10$aA1P78j46AVUra4cHefwFO5syllEYZ92ihesQ6Z5veTI364A./FbC','avatar-db2e44e1e245398b.png','Administrador','2000-09-23','1050482123045','2024-05-23 15:45:53','2024-05-25 20:55:15',NULL),(2,3,1,'testetg01@gmail.com','$2b$10$34Tm6Gl8O8j1HlP.8q8p4.9J17uCUC.88ZWHgYckMgghegPhh2o4.',NULL,'Administrador','2000-09-23','1050482123045','2024-05-23 15:47:15','2024-05-23 15:47:15',NULL),(3,4,1,'email@login.com','$2b$10$R9bqRfA8gxIJSPC0YWFw9OTkDGYiC9..nP1UBI6JfuKgm06eLlhB.','avatar-1ce581c05ecec163.png','Tiago Faria Gouvea','2001-01-01','1234563789','2024-05-26 15:14:43','2024-06-02 18:49:53',NULL),(4,4,4,'rh@login.com',NULL,NULL,'Recursos Humanos','2001-01-01','123456','2024-06-02 22:35:06','2024-06-03 01:16:03',NULL),(7,4,5,'funcionario@login.com',NULL,NULL,'Funcionário','2001-01-01','1234','2024-06-03 01:18:55','2024-06-03 01:18:55',NULL);
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

-- Dump completed on 2024-06-03 10:18:11
