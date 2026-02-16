-- MySQL dump 10.13  Distrib 9.4.0, for macos14.7 (x86_64)
--
-- Host: localhost    Database: psaltermatic
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hours`
--
use psaltermatic;
DROP TABLE IF EXISTS `hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `lang` varchar(10) NOT NULL,
  `content` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`lang`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hours`
--

LOCK TABLES `hours` WRITE;
/*!40000 ALTER TABLE `hours` DISABLE KEYS */;
INSERT INTO `hours` VALUES (13,'Com_com','la','{\"kyrie\": \"ant_prayers_6\", \"pater\": \"ant_prayers_0\", \"divinum\": \"ant_prayers_38-2\", \"dominus\": \"ant_prayers_8\", \"benedicamus\": \"ant_prayers_8-2\", \"pater_silent\": \"ant_prayers_6-2\", \"initial_verset\": \"ant_prayers_1\", \"fidelium_animae\": \"ant_prayers_38\"}'),(14,'Dom_sext','la','{\"ps1\": \"ps_118-08\", \"ps2\": \"ps_118-09\", \"ps3\": \"ps_118-10\", \"verset\": \"ant_verset_90\", \"capit\": \"ant_capit_90\", \"hymn\": \"ant_hymn_87\", \"antiphon\": \"ant_antiphon_87\"}'),(15,'Dom_tier','la','{\"ps1\": \"ps_118-05\", \"ps2\": \"ps_118-06\", \"ps3\": \"ps_118-07\", \"verset\": \"ant_verset_87\", \"capit\": \"ant_capit_87\", \"hymn\": \"ant_hymn_84\", \"antiphon\": \"ant_antiphon_87\"}'),(16,'Dom_non','la','{\"ps1\": \"ps_118-11\", \"ps2\": \"ps_118-12\", \"ps3\": \"ps_118-13\", \"verset\": \"ant_verset_93\", \"capit\": \"ant_capit_93\", \"hymn\": \"ant_hymn_90\", \"antiphon\": \"ant_antiphon_87\"}'),(17,'Dom_comp','la','{\"ps1\": \"ps_4\", \"ps2\": \"ps_90\", \"ps3\": \"ps_133\", \"verset\": \"ant_verset_93\", \"capit\": \"ant_capit_93\", \"hymn\": \"ant_hymn_170\", \"jube_domne\": \"ant_prayers_167\", \"noctem_quietam\": \"ant_prayers_167-2\", \"lect_complet\": \"ant_prayers_167-3\", \"adjutorium\": \"ant_prayers_167-4\", \"confiteor\": \"ant_prayers_168\", \"misereatur\": \"ant_prayers_168-2\", \"indulgentiam\": \"ant_prayers_168-3\", \"convertere\": \"ant_prayers_169\", \"oratio_complet\": \"ant_prayers_173\", \"benedic_complet\": \"ant_prayers_173-2\", \"alma_redemp\": \"ant_prayers_173-3\", \"ave_regina\": \"ant_prayers_175\", \"regina_caeli\": \"ant_prayers_176\", \"salve_regina\": \"ant_prayers_176-2\"}');
/*!40000 ALTER TABLE `hours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-06 19:17:48
