-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 27, 2026 at 06:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `noveldb`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES
(1, 'รักโรแมนติก', 'เน้นเรื่องราวความรัก ความสัมพันธ์ และความรู้สึกของตัวละครหลัก'),
(2, 'แฟนตาซี', 'เรื่องราวเหนือจินตนาการ เวทมนตร์ พลังวิเศษ หรือโลกคู่ขนาน'),
(3, 'สืบสวนสอบสวน', 'การไขคดี ปริศนา และการค้นหาความจริงที่ซ่อนอยู่'),
(4, 'สยองขวัญ', 'เรื่องราวลี้ลับ สิ่งเหนือธรรมชาติ และความน่ากลัว'),
(5, 'กำลังภายใน', 'การฝึกยุทธ์ ลมปราณ และเรื่องราวในยุทธภพ'),
(6, 'วาย (Yaoi / Yuri)', 'นิยายชายรักชาย หรือหญิงรักหญิง ซึ่งเป็นหมวดหมู่ที่ได้รับความนิยมสูง'),
(7, 'ย้อนยุค / ทะลุมิติ', 'การเดินทางข้ามเวลาไปในอดีต หรือการไปเกิดใหม่ในต่างโลก'),
(8, 'ตลกขบขัน', 'เนื้อหาเน้นความสนุกสนาน สร้างรอยยิ้มและเสียงหัวเราะ'),
(9, 'ดราม่า', 'เนื้อหาเข้มข้น สะท้อนอารมณ์ และปัญหาชีวิตที่หนักหน่วง'),
(10, 'แอคชัน / ผจญภัย', 'เน้นการต่อสู้ การเดินทาง และการเผชิญหน้ากับอุปสรรค');

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `ChapterID` int(11) NOT NULL,
  `NovelID` int(11) DEFAULT NULL,
  `ChapterNumber` int(11) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Content` longtext DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`ChapterID`, `NovelID`, `ChapterNumber`, `Title`, `Content`, `CreatedAt`) VALUES
(1, 3, 1, 'new begining', 'asda\nasd\n\nad\na\ndasdfsdgffggsgsgsg\ndad\naa\nd\n\nad\na\nd\nad\nad\nad\nad\na\nd\nad\na\ndad\nadadadadad\nadadad\na\ndadadadad\nadadad\nadadadad\nadada\nadadadad\nadadad\nadad\nadad\nadadad\nadada\ndadad', '2026-01-27 19:55:41'),
(2, 3, 2, 'new adventure', 'ioahsdo;a\ndasipojdoaid\nadpsjapoida\naosjdpoad\nasodj;apoijd\nsdolojapod\nasd\nasd\nas\nda\nsda\ndsa\nfg\nfhfgdj\n\ndj\nj\ndfg\njfd\ngj\ndfgj\ndf\ngj\ndfgj\ndf\ngj\nfdg\nj\ndfjg\nfd\njg\ndfgj\ndf\ngj\nfdgj\ndf\ngj\ndfgj\ndfg\nj\ndfgj\ndfgj\nfd\ngj\nfdg\nj\nfdgj\nfd\ngj\nfdg\njfd\ngj\ndfg\nj\nfdgj\ndfg\njf\ndgj\ndfgj\nfd\ngj\ndfgj\ndf\ngjf\ndgj\nfd\ngj\nfdgj\nfdg\njdf\ngj\nfdg\njf\ngj\nfdgj\n\ndfgj\nfdg\njd\nfgj\nfdg\nj\ndfgj\ndf\ngj\ndfgj\ndfg\nj\ndfgj\nfgd\nj\nfgj\ndfg\njdf\ngj\ndfg\njf\ngjdfjgdfjg', '2026-01-27 20:34:44'),
(3, 2, 1, 'yooo', 'yooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', '2026-01-27 21:24:39'),
(4, 4, 1, 'dad', 'asdasdadsad', '2026-01-27 23:08:48');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `CommentID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `NovelID` int(11) DEFAULT NULL,
  `ChapterID` int(11) DEFAULT NULL,
  `Message` text NOT NULL,
  `CommentedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`CommentID`, `UserID`, `NovelID`, `ChapterID`, `Message`, `CommentedAt`) VALUES
(2, 8, 3, NULL, 'this test', '2026-01-27 20:26:35');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `FavoriteID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `NovelID` int(11) NOT NULL,
  `AddedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`FavoriteID`, `UserID`, `NovelID`, `AddedAt`) VALUES
(1, 7, 3, '2026-01-27 22:18:47'),
(7, 8, 2, '2026-01-27 22:41:59'),
(11, 8, 3, '2026-01-28 00:05:48');

-- --------------------------------------------------------

--
-- Table structure for table `novels`
--

CREATE TABLE `novels` (
  `NovelID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CoverImage` text DEFAULT NULL,
  `AuthorID` int(11) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'กำลังเขียน',
  `ViewCount` int(11) DEFAULT 0,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `novels`
--

INSERT INTO `novels` (`NovelID`, `Title`, `Description`, `CoverImage`, `AuthorID`, `Status`, `ViewCount`, `CreatedAt`) VALUES
(2, 'novel2', 'novel2', '/uploads/coverImage-1769511381186-513384213.jpg', 8, 'Ongoing', 95, '2026-01-27 17:56:21'),
(3, 'inuyacha', 'inuyacha', '/uploads/coverImage-1769512919702-828543937.webp', 8, 'Ongoing', 131, '2026-01-27 18:21:59'),
(4, 'jklnou', 'tadafasddadasdagdffgf', '/uploads/coverImage-1769530114552-182549724.gif', 8, 'กำลังเขียน', 69, '2026-01-27 23:08:34');

-- --------------------------------------------------------

--
-- Table structure for table `novel_categories`
--

CREATE TABLE `novel_categories` (
  `NovelID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `novel_categories`
--

INSERT INTO `novel_categories` (`NovelID`, `CategoryID`) VALUES
(2, 1),
(2, 3),
(3, 1),
(3, 5),
(3, 7),
(3, 10),
(4, 3),
(4, 9),
(4, 10);

-- --------------------------------------------------------

--
-- Table structure for table `readinghistory`
--

CREATE TABLE `readinghistory` (
  `HistoryID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `NovelID` int(11) NOT NULL,
  `ChapterID` int(11) DEFAULT NULL,
  `LastReadAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `readinghistory`
--

INSERT INTO `readinghistory` (`HistoryID`, `UserID`, `NovelID`, `ChapterID`, `LastReadAt`) VALUES
(1, 7, 3, NULL, '2026-01-27 22:40:38'),
(15, 7, 2, NULL, '2026-01-27 22:40:32'),
(39, 8, 4, 4, '2026-01-27 23:38:48'),
(47, 8, 2, 3, '2026-01-27 23:51:17'),
(53, 8, 3, 2, '2026-01-27 23:52:05');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `RoleID` int(11) NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`RoleID`, `RoleName`) VALUES
(1, 'Admin'),
(2, 'Author'),
(3, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` text NOT NULL,
  `FullName` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `RoleID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `Username`, `Password`, `FullName`, `Email`, `RoleID`, `CreatedAt`) VALUES
(3, 'testuser', '$2b$10$jwdZA3W4wclmAGGAQZGYOutq1AnTMU5fpIcD4bGown5Cd0BRUXVmG', 'Test User', 'test@example.com', 3, '2026-01-27 16:48:41'),
(4, 'UJIN', '$2b$10$Yu3GCnTlBbCum/YKf9PAkuJ76.Qy2xfn0fJHuVPrH8q5HEodPOdOG', 'wee', 'koonball451@gmail.com', 3, '2026-01-27 17:00:01'),
(5, 'testA1', '$2b$10$YURFqJDUX6aHsK/lF19CNeVxMyrB2oF4x3Bd/JqJkNZvp1wmuTET2', 'ta1', 'testA1@t', 3, '2026-01-27 17:04:11'),
(6, 'author1', '$2b$10$6sBBPnDcwPNcbuVbPmrL1ukfxLjOsgSLY9gJmHERQO6tJRgMW5jgu', 'author1', 'author1@a', 3, '2026-01-27 17:05:37'),
(7, 'au1', '$2b$10$UqUsr6PDgE5YMZqqv1hXRetyYxC6O7Mb86W6FtNHdl937kiuOy07.', 'au1', 'au1@a', 3, '2026-01-27 17:10:52'),
(8, 'au2@a', '$2b$10$A8HongZHAGIs28UttoUll.4rNFPUTCOwXe1EZEmcDW307wW43El8a', 'au2@aฎ', 'au2@a', 2, '2026-01-27 17:13:47'),
(9, 'admin', '$2b$10$WyxlcxVCNPXNZFdg0v08UezMd974H1KXvhJu7lZbC69/VJ//.oIg2', 'admin', 'ad@m', 1, '2026-01-28 00:06:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`ChapterID`),
  ADD KEY `NovelID` (`NovelID`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`CommentID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `NovelID` (`NovelID`),
  ADD KEY `ChapterID` (`ChapterID`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`FavoriteID`),
  ADD UNIQUE KEY `unique_user_novel` (`UserID`,`NovelID`),
  ADD KEY `NovelID` (`NovelID`);

--
-- Indexes for table `novels`
--
ALTER TABLE `novels`
  ADD PRIMARY KEY (`NovelID`),
  ADD KEY `AuthorID` (`AuthorID`);

--
-- Indexes for table `novel_categories`
--
ALTER TABLE `novel_categories`
  ADD PRIMARY KEY (`NovelID`,`CategoryID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `readinghistory`
--
ALTER TABLE `readinghistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD UNIQUE KEY `unique_history` (`UserID`,`NovelID`),
  ADD KEY `NovelID` (`NovelID`),
  ADD KEY `fk_history_chapter` (`ChapterID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`RoleID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `RoleID` (`RoleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `ChapterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `CommentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `FavoriteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `novels`
--
ALTER TABLE `novels`
  MODIFY `NovelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `readinghistory`
--
ALTER TABLE `readinghistory`
  MODIFY `HistoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`NovelID`) REFERENCES `novels` (`NovelID`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`NovelID`) REFERENCES `novels` (`NovelID`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`ChapterID`) REFERENCES `chapters` (`ChapterID`);

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`NovelID`) REFERENCES `novels` (`NovelID`) ON DELETE CASCADE;

--
-- Constraints for table `novels`
--
ALTER TABLE `novels`
  ADD CONSTRAINT `novels_ibfk_1` FOREIGN KEY (`AuthorID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `novel_categories`
--
ALTER TABLE `novel_categories`
  ADD CONSTRAINT `novel_categories_ibfk_1` FOREIGN KEY (`NovelID`) REFERENCES `novels` (`NovelID`) ON DELETE CASCADE,
  ADD CONSTRAINT `novel_categories_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE CASCADE;

--
-- Constraints for table `readinghistory`
--
ALTER TABLE `readinghistory`
  ADD CONSTRAINT `fk_history_chapter` FOREIGN KEY (`ChapterID`) REFERENCES `chapters` (`ChapterID`) ON DELETE CASCADE,
  ADD CONSTRAINT `readinghistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `readinghistory_ibfk_2` FOREIGN KEY (`NovelID`) REFERENCES `novels` (`NovelID`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
