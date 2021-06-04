-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2021 at 12:12 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `id` int(11) NOT NULL,
  `bio` text NOT NULL,
  `image` blob NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`id`, `bio`, `image`, `name`) VALUES
(1, 'mily A. Duncan was born and raised in Ohio and works as a youth services librarian. She received a Master\'s adegree in library science from Kent State University, which mostly taught her how to find obscure Slavic folklore texts through interlibrary loan systems. When not reading or writing, she enjoys playing copious amounts of video games and dungeons and dragons', '', 'mily A. Duncan'),
(2, '', '', 'Ron Roy'),
(3, 'Leigh Bardugo is the #1 New York Times bestselling and USA Today bestselling author of Six of Crows and the Grisha Trilogy (Shadow and Bone, Siege and Storm, and Ruin and Rising). She was born in Jerusalem, grew up in Los Angeles, graduated from Yale University, and has worked in advertising, journalism, and most recently, makeup and special effects. These days, she lives and writes in Hollywood where she can occasionally be heard singing with her band.', '', 'Leigh Bardugo '),
(4, 'Mark Manson (born March 9, 1984) is an American self-help author and blogger. As of 2019 he had authored three books, two of which, The Subtle Art of Not Giving a Fuck, and Everything Is Fucked: A Book About Hope, were The New York Times bestsellers. His books have sold over 13 million copies.', '', 'Mark Manson'),
(5, 'Barack Obama born August 4, 1961, is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and an Illinois state senator from 1997 to 2004', '', 'Barack Obama'),
(6, 'Kamer Daron Acemoğlu (Turkish: [daˈɾon aˈdʒemoːɫu]; born September 3, 1967) is a Turkish-born Armenian-American economist who has taught at the Massachusetts Institute of Technology (MIT) since 1993. He is currently the Elizabeth and James Killian Professor of Economics at MIT. He was named Institute Professor in 2019. ', '', 'Daron Acemoglu'),
(7, '', '', 'Jeevan Kumar Prasain\r\nजीवनकुमार प्रसाई'),
(8, 'Yuval Noah Harari (Hebrew: יובל נח הררי‎ [juˈval ˈnoaχ haˈʁaʁi]; born 24 February 1976) is an Israeli public intellectual, historian and a professor in the Department of History at the Hebrew University of Jerusalem.[1] He is the author of the popular science bestsellers Sapiens: A Brief History of Humankind (2014), Homo Deus: A Brief History of Tomorrow (2016), and 21 Lessons for the 21st Century (2018). His writings examine free will, consciousness, intelligence, happiness and suffering. ', '', 'Yuval Noah Harari'),
(44, 'nothing', '', 'Alex smith');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` double DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `thumbnail` blob DEFAULT NULL,
  `genre_id` int(11) NOT NULL,
  `language_id` int(11) NOT NULL,
  `edition` int(11) DEFAULT NULL,
  `isbno` varchar(255) NOT NULL,
  `pages` int(11) DEFAULT NULL,
  `publisher_id` int(11) DEFAULT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `title`, `description`, `price`, `author_id`, `thumbnail`, `genre_id`, `language_id`, `edition`, `isbno`, `pages`, `publisher_id`, `url`) VALUES
(2, 'The Haunted Hotel', 'A to Z Mysteries ', 100, 0, NULL, 0, 0, 1, '9780679890799', 250, NULL, 'file:///C:/Users/Lenovo/Downloads/blank.pdf'),
(3, 'Blessed Monsters: A Novel (Something Dark and Holy, 3,\r\n    The girl, the monster, the prince, the queen.', 'They broke the world.\r\n\r\nAnd some things can never be undone.\r\n', 1599, 0, NULL, 0, 0, 3, '978-1250195722', 528, NULL, 'file:///C:/Users/Lenovo/Downloads/blank.pdf'),
(4, 'Everything Is F*cked', 'Mark Manson, author of the international mega-bestseller, \'The Subtle Art of Not Giving a F*ck\' has come up with another guide to the problems of modern life. In this book, the author questions our assumptions on what makes life worth living.\r\n\r\nEver  2880 wonder why greater connectivity seems to make everyone just hate each other more? Ever wonder why the news always seems so depressing? Ever wonder why people are seemingly becoming more anxious and miserable despite life getting easier?', 800, 0, NULL, 0, 0, 1, '9780062898920', 273, NULL, ''),
(5, 'A Promised Land', 'his is a memoir by Barack Obama. It is the first of a planned two books that Barak Obama has written following his period as President of the United States from 2009 to 2017.', 2880, 0, NULL, 0, 0, 1, '9781524763169', 768, NULL, ''),
(6, 'Why Nations Fail', 'Shortlisted for the Financial Times and Goldman Sachs Business Book of the Year Award 2012.\r\n\r\nIs it culture, the weather, geography? Perhaps ignorance of what the right policies are? \r\nSimply, no. None of these factors is either definitive or destiny. Otherwise, how to explain why Botswana has become one of the fastest growing countries in the world, while other African nations, such as Zimbabwe, the Congo, and Sierra Leone, are mired in poverty and violence? \r\n\r\n\r\nDaron Acemoglu and James Robinson conclusively show that it is man-made political and economic institutions that underlie economic success (or lack of it). Korea, to take just one of their fascinating examples, is a remarkably homogeneous nation, yet the people of North Korea are among the poorest on earth while their brothers and sisters in South Korea are among the richest. The south forged a society that created incentives, rewarded innovation, and allowed everyone to participate in economic opportunities. \r\nThe economic success thus spurred was sustained because the government became accountable and responsive to citizens and the great mass of people. Sadly, the people of the north have endured decades of famine, political repression, and very different economic institutions—with no end in sight. The differences between the Koreas is due to the politics that created these completely different institutional trajectories. \r\n\r\n\r\nBased on fifteen years of original research Acemoglu and Robinson marshall extraordinary historical evidence from the Roman Empire, the Mayan city-states, medieval Venice, the Soviet Union, Latin America, England, Europe, the United States, and Africa to build a new theory of political economy with great relevance for the big questions of today.', 399, 0, NULL, 0, 0, 1, '9781846684302', 544, NULL, ''),
(7, 'Jeevan Jiune Kaida', 'The book deals with ways of living a long and healthy life. The author argues that although people often attribute a long and healthy life to genes and portray the genetic makeup as the sole determiner of health, that need not be the case. Eating healthy and in moderation, exercising regularly, and living in a clean environment, according to the author, do not just make a person healthy, but also undo or dilute the effects of certain harmful genetic mutations.', 175, 0, NULL, 0, 0, 1, '9789937892452', 256, NULL, ''),
(8, 'A Brief History of Humankind ', 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be “human.”\r\n\r\nOne hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one—homo sapiens. What happened to the others? And what may happen to us?\r\n\r\nMost books about the history of humanity pursue either a historical or a biological approach, but Dr. Yuval Noah Harari breaks the mold with this highly original book that begins about 70,000 years ago with the appearance of modern cognition. From examining the role evolving humans have played in the global ecosystem to charting the rise of empires, Sapiens integrates history and science to reconsider accepted narratives, connect past developments with contemporary concerns, and examine specific events within the context of larger ideas.\r\n\r\nDr. Harari also compels us to look ahead, because over the last few decades humans have begun to bend laws of natural selection that have governed life for the past four billion years. We are acquiring the ability to design not only the world around us, but also ourselves. Where is this leading us, and what do we want to become?\r\n\r\nFeaturing 27 photographs, 6 maps, and 25 illustrations/diagrams, this provocative and insightful work is sure to spark debate and is essential reading for aficionados of Jared Diamond, James Gleick, Matt Ridley, Robert Wright, and Sharon Moalem.', 960, 0, NULL, 0, 0, 1, '9780099590088', 360, NULL, ''),
(9, 'Software Engineering', '', 500, 0, NULL, 0, 0, 10, '9789332582699', 808, NULL, ''),
(13, 'java', '', 3000, 2, '', 3, 20, 0, '123849', 300, 10, 'book.pdf'),
(14, 'java', '', 3000, 2, '', 3, 20, 0, '123849', 300, 10, 'book.pdf'),
(15, 'java', '', 3000, 2, '', 3, 20, 0, '123849', 300, 10, 'book.pdf'),
(16, 'java', '', 3000, 2, '', 3, 20, 0, '123849', 300, 10, 'book.pdf'),
(19, 'chemistry', '', 3500, 3, '', 3, 3, 0, '', 0, 3, '');

-- --------------------------------------------------------

--
-- Table structure for table `book_author`
--

CREATE TABLE `book_author` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `book_genre`
--

CREATE TABLE `book_genre` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id` int(11) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`id`, `genre`, `description`) VALUES
(3, 'Self-help\r\n', 'A self-help book is one that is written with the intention to instruct its readers on solving personal problems.'),
(20, 'Fantasy', 'Fantasy is a genre that’s identified by the use of magic within it.'),
(22, 'Horror', 'Meant to cause discomfort and fear for both the character and readers, horror writers often make use of supernatural and paranormal elements in morbid stories that are sometimes a little too realistic.'),
(23, 'Science Fiction', 'Also known as Sci-Fi, science fiction deals with the imagined future in terms of science or technology advances. This genre includes things like time travel, outer space, and intelligent life.'),
(24, 'biography', 'A biography, or simply bio, is a detailed description of a person\'s life. It involves more than just the basic facts like education, work, relationships, and death; it portrays a person\'s experience of these life events.'),
(25, 'Mystery', 'Mystery fiction is a loosely-defined term that is often used as a synonym of detective fiction — in other words a novel or short story in which a detective (either professional or amateur) solves a crime.'),
(26, 'Romance', 'A romance novel or romantic novel is a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people, and usually has an emotionally satisfying and optimistic ending.'),
(27, 'Thriller', 'Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'),
(28, 'Action', 'Action fiction is a form of genre fiction whose subject matter is characterized by emphasis on exciting action sequences. '),
(29, 'Kids', 'A genre of stories that are made up but could very well happen in real life. These stories often take place in settings familiar to your child — like schools — which makes them more relatable.'),
(30, 'Crafts/hobbies', 'skill in planning, making, or executing'),
(31, 'Health/fitness', 'Define fitness and explain the essential elements of physical fitness and Health related Activies'),
(33, 'Poetry', ''),
(34, 'Encyclopedia', ' reference work or compendium providing summaries of knowledge either from all branches or from a particular field or discipline. '),
(35, 'Cookbook', 'A cookbook or cookery book is a kitchen reference containing recipes. Cookbooks may be general, or may specialize in a particular cuisine or category of food.'),
(36, 'Business/economics', ''),
(37, 'Comic book', 'A comic book, also called comic magazine or (in the United Kingdom and Ireland) simply comic, is a publication that consists of comics art in the form of sequential juxtaposed panels that represent individual scenes. Panels are often accompanied by descriptive prose and written narrative, usually, dialogue contained in word balloons emblematic of the comics art form.'),
(38, 'Textbooks', 'A textbook is a book containing a comprehensive compilation of content in a branch of study with the intention of explaining it.'),
(39, 'tragedy', 'Tragedy, branch of drama that treats in a serious and dignified style the sorrowful or terrible events encountered or caused by a heroic individual.');

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `language` varchar(255) NOT NULL,
  `code1` varchar(20) DEFAULT NULL,
  `code2` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `language`, `code1`, `code2`) VALUES
(3, 'Afghanistan', 'af', 'afg'),
(8, 'Albania', 'al', 'alb'),
(10, 'Antarctica', 'aq', 'ata'),
(12, 'Algeria', 'dz', 'dza'),
(16, 'American Samoa', 'as', 'asm'),
(20, 'Andorra', 'ad', 'and'),
(24, 'Angola', 'ao', 'ago'),
(28, 'Antigua and Barbuda', 'ag', 'atg'),
(31, 'Azerbaijan', 'az', 'aze'),
(32, 'Argentina', 'ar', 'arg'),
(36, 'Australia', 'au', 'aus'),
(44, 'Bahamas', 'bs', 'bhs'),
(48, 'Bahrain', 'bh', 'bhr'),
(50, 'Bangladesh', 'bd', 'bgd'),
(51, 'Armenia', 'am', 'arm'),
(52, 'Barbados', 'bb', 'brb'),
(56, 'Belgium', 'be', 'bel'),
(60, 'Bermuda', 'bm', 'bmu'),
(64, 'Bhutan', 'bt', 'btn'),
(68, 'Bolivia (Plurinational State of)', 'bo', 'bol'),
(70, 'Bosnia and Herzegovina', 'ba', 'bih'),
(72, 'Botswana', 'bw', 'bwa'),
(74, 'Bouvet Island', 'bv', 'bvt'),
(76, 'Brazil', 'br', 'bra'),
(84, 'Belize', 'bz', 'blz'),
(86, 'British Indian Ocean Territory', 'io', 'iot'),
(90, 'Solomon Islands', 'sb', 'slb'),
(92, 'Virgin Islands (British)', 'vg', 'vgb'),
(96, 'Brunei Darussalam', 'bn', 'brn'),
(100, 'Bulgaria', 'bg', 'bgr'),
(104, 'Myanmar', 'mm', 'mmr'),
(108, 'Burundi', 'bi', 'bdi'),
(112, 'Belarus', 'by', 'blr'),
(116, 'Cambodia', 'kh', 'khm'),
(120, 'Cameroon', 'cm', 'cmr'),
(124, 'Canada', 'ca', 'can'),
(132, 'Cabo Verde', 'cv', 'cpv'),
(136, 'Cayman Islands', 'ky', 'cym'),
(140, 'Central African Republic', 'cf', 'caf'),
(144, 'Sri Lanka', 'lk', 'lka'),
(148, 'Chad', 'td', 'tcd'),
(152, 'Chile', 'cl', 'chl'),
(156, 'China', 'cn', 'chn'),
(158, 'Taiwan, Province of China', 'tw', 'twn'),
(162, 'Christmas Island', 'cx', 'cxr'),
(166, 'Cocos (Keeling) Islands', 'cc', 'cck'),
(170, 'Colombia', 'co', 'col'),
(174, 'Comoros', 'km', 'com'),
(175, 'Mayotte', 'yt', 'myt'),
(178, 'Congo', 'cg', 'cog'),
(180, 'Congo, Democratic Republic of the', 'cd', 'cod'),
(184, 'Cook Islands', 'ck', 'cok'),
(188, 'Costa Rica', 'cr', 'cri'),
(191, 'Croatia', 'hr', 'hrv'),
(192, 'Cuba', 'cu', 'cub'),
(196, 'Cyprus', 'cy', 'cyp'),
(203, 'Czechia', 'cz', 'cze'),
(204, 'Benin', 'bj', 'ben'),
(208, 'Denmark', 'dk', 'dnk'),
(212, 'Dominica', 'dm', 'dma'),
(214, 'Dominican Republic', 'do', 'dom'),
(218, 'Ecuador', 'ec', 'ecu'),
(222, 'El Salvador', 'sv', 'slv'),
(226, 'Equatorial Guinea', 'gq', 'gnq'),
(231, 'Ethiopia', 'et', 'eth'),
(232, 'Eritrea', 'er', 'eri'),
(233, 'Estonia', 'ee', 'est'),
(234, 'Faroe Islands', 'fo', 'fro'),
(238, 'Falkland Islands (Malvinas)', 'fk', 'flk'),
(239, 'South Georgia and the South Sandwich Islands', 'gs', 'sgs'),
(242, 'Fiji', 'fj', 'fji'),
(246, 'Finland', 'fi', 'fin'),
(248, 'Åland Islands', 'ax', 'ala'),
(250, 'France', 'fr', 'fra'),
(254, 'French Guiana', 'gf', 'guf'),
(258, 'French Polynesia', 'pf', 'pyf'),
(260, 'French Southern Territories', 'tf', 'atf'),
(262, 'Djibouti', 'dj', 'dji'),
(266, 'Gabon', 'ga', 'gab'),
(268, 'Georgia', 'ge', 'geo'),
(270, 'Gambia', 'gm', 'gmb'),
(275, 'Palestine, State of', 'ps', 'pse'),
(276, 'Germany', 'de', 'deu'),
(288, 'Ghana', 'gh', 'gha'),
(292, 'Gibraltar', 'gi', 'gib'),
(296, 'Kiribati', 'ki', 'kir'),
(300, 'Greece', 'gr', 'grc'),
(304, 'Greenland', 'gl', 'grl'),
(308, 'Grenada', 'gd', 'grd'),
(312, 'Guadeloupe', 'gp', 'glp'),
(316, 'Guam', 'gu', 'gum'),
(320, 'Guatemala', 'gt', 'gtm'),
(324, 'Guinea', 'gn', 'gin'),
(328, 'Guyana', 'gy', 'guy'),
(332, 'Haiti', 'ht', 'hti'),
(334, 'Heard Island and McDonald Islands', 'hm', 'hmd'),
(336, 'Holy See', 'va', 'vat'),
(340, 'Honduras', 'hn', 'hnd'),
(344, 'Hong Kong', 'hk', 'hkg'),
(348, 'Hungary', 'hu', 'hun'),
(352, 'Iceland', 'is', 'isl'),
(356, 'India', 'in', 'ind'),
(360, 'Indonesia', 'id', 'idn'),
(364, 'Iran (Islamic Republic of)', 'ir', 'irn'),
(368, 'Iraq', 'iq', 'irq'),
(372, 'Ireland', 'ie', 'irl'),
(376, 'Israel', 'il', 'isr'),
(380, 'Italy', 'it', 'ita'),
(384, 'Côte d\'Ivoire', 'ci', 'civ'),
(388, 'Jamaica', 'jm', 'jam'),
(392, 'Japan', 'jp', 'jpn'),
(398, 'Kazakhstan', 'kz', 'kaz'),
(400, 'Jordan', 'jo', 'jor'),
(404, 'Kenya', 'ke', 'ken'),
(408, 'Korea (Democratic People\'s Republic of)', 'kp', 'prk'),
(410, 'Korea, Republic of', 'kr', 'kor'),
(414, 'Kuwait', 'kw', 'kwt'),
(417, 'Kyrgyzstan', 'kg', 'kgz'),
(418, 'Lao People\'s Democratic Republic', 'la', 'lao'),
(422, 'Lebanon', 'lb', 'lbn'),
(426, 'Lesotho', 'ls', 'lso'),
(428, 'Latvia', 'lv', 'lva'),
(430, 'Liberia', 'lr', 'lbr'),
(434, 'Libya', 'ly', 'lby'),
(438, 'Liechtenstein', 'li', 'lie'),
(440, 'Lithuania', 'lt', 'ltu'),
(442, 'Luxembourg', 'lu', 'lux'),
(446, 'Macao', 'mo', 'mac'),
(450, 'Madagascar', 'mg', 'mdg'),
(454, 'Malawi', 'mw', 'mwi'),
(458, 'Malaysia', 'my', 'mys'),
(462, 'Maldives', 'mv', 'mdv'),
(466, 'Mali', 'ml', 'mli'),
(470, 'Malta', 'mt', 'mlt'),
(474, 'Martinique', 'mq', 'mtq'),
(478, 'Mauritania', 'mr', 'mrt'),
(480, 'Mauritius', 'mu', 'mus'),
(484, 'Mexico', 'mx', 'mex'),
(492, 'Monaco', 'mc', 'mco'),
(496, 'Mongolia', 'mn', 'mng'),
(498, 'Moldova, Republic of', 'md', 'mda'),
(499, 'Montenegro', 'me', 'mne'),
(500, 'Montserrat', 'ms', 'msr'),
(504, 'Morocco', 'ma', 'mar'),
(508, 'Mozambique', 'mz', 'moz'),
(512, 'Oman', 'om', 'omn'),
(516, 'Namibia', 'na', 'nam'),
(520, 'Nauru', 'nr', 'nru'),
(524, 'Nepal', 'np', 'npl'),
(528, 'Netherlands', 'nl', 'nld'),
(531, 'Curaçao', 'cw', 'cuw'),
(533, 'Aruba', 'aw', 'abw'),
(534, 'Sint Maarten (Dutch part)', 'sx', 'sxm'),
(535, 'Bonaire, Sint Eustatius and Saba', 'bq', 'bes'),
(540, 'New Caledonia', 'nc', 'ncl'),
(548, 'Vanuatu', 'vu', 'vut'),
(554, 'New Zealand', 'nz', 'nzl'),
(558, 'Nicaragua', 'ni', 'nic'),
(562, 'Niger', 'ne', 'ner'),
(566, 'Nigeria', 'ng', 'nga'),
(570, 'Niue', 'nu', 'niu'),
(574, 'Norfolk Island', 'nf', 'nfk'),
(578, 'Norway', 'no', 'nor'),
(580, 'Northern Mariana Islands', 'mp', 'mnp'),
(581, 'United States Minor Outlying Islands', 'um', 'umi'),
(583, 'Micronesia (Federated States of)', 'fm', 'fsm'),
(584, 'Marshall Islands', 'mh', 'mhl'),
(585, 'Palau', 'pw', 'plw'),
(586, 'Pakistan', 'pk', 'pak'),
(591, 'Panama', 'pa', 'pan'),
(598, 'Papua New Guinea', 'pg', 'png'),
(600, 'Paraguay', 'py', 'pry'),
(604, 'Peru', 'pe', 'per'),
(608, 'Philippines', 'ph', 'phl'),
(612, 'Pitcairn', 'pn', 'pcn'),
(616, 'Poland', 'pl', 'pol'),
(620, 'Portugal', 'pt', 'prt'),
(624, 'Guinea-Bissau', 'gw', 'gnb'),
(626, 'Timor-Leste', 'tl', 'tls'),
(630, 'Puerto Rico', 'pr', 'pri'),
(634, 'Qatar', 'qa', 'qat'),
(638, 'Réunion', 're', 'reu'),
(642, 'Romania', 'ro', 'rou'),
(643, 'Russian Federation', 'ru', 'rus'),
(646, 'Rwanda', 'rw', 'rwa'),
(652, 'Saint Barthélemy', 'bl', 'blm'),
(654, 'Saint Helena, Ascension and Tristan da Cunha', 'sh', 'shn'),
(659, 'Saint Kitts and Nevis', 'kn', 'kna'),
(660, 'Anguilla', 'ai', 'aia'),
(662, 'Saint Lucia', 'lc', 'lca'),
(663, 'Saint Martin (French part)', 'mf', 'maf'),
(666, 'Saint Pierre and Miquelon', 'pm', 'spm'),
(670, 'Saint Vincent and the Grenadines', 'vc', 'vct'),
(674, 'San Marino', 'sm', 'smr'),
(678, 'Sao Tome and Principe', 'st', 'stp'),
(682, 'Saudi Arabia', 'sa', 'sau'),
(686, 'Senegal', 'sn', 'sen'),
(688, 'Serbia', 'rs', 'srb'),
(690, 'Seychelles', 'sc', 'syc'),
(694, 'Sierra Leone', 'sl', 'sle'),
(702, 'Singapore', 'sg', 'sgp'),
(703, 'Slovakia', 'sk', 'svk'),
(704, 'Viet Nam', 'vn', 'vnm'),
(705, 'Slovenia', 'si', 'svn'),
(706, 'Somalia', 'so', 'som'),
(710, 'South Africa', 'za', 'zaf'),
(716, 'Zimbabwe', 'zw', 'zwe'),
(724, 'Spain', 'es', 'esp'),
(728, 'South Sudan', 'ss', 'ssd'),
(729, 'Sudan', 'sd', 'sdn'),
(732, 'Western Sahara', 'eh', 'esh'),
(740, 'Suriname', 'sr', 'sur'),
(744, 'Svalbard and Jan Mayen', 'sj', 'sjm'),
(748, 'Eswatini', 'sz', 'swz'),
(752, 'Sweden', 'se', 'swe'),
(756, 'Switzerland', 'ch', 'che'),
(760, 'Syrian Arab Republic', 'sy', 'syr'),
(762, 'Tajikistan', 'tj', 'tjk'),
(764, 'Thailand', 'th', 'tha'),
(768, 'Togo', 'tg', 'tgo'),
(772, 'Tokelau', 'tk', 'tkl'),
(776, 'Tonga', 'to', 'ton'),
(780, 'Trinidad and Tobago', 'tt', 'tto'),
(784, 'United Arab Emirates', 'ae', 'are'),
(788, 'Tunisia', 'tn', 'tun'),
(792, 'Turkey', 'tr', 'tur'),
(795, 'Turkmenistan', 'tm', 'tkm'),
(796, 'Turks and Caicos Islands', 'tc', 'tca'),
(798, 'Tuvalu', 'tv', 'tuv'),
(800, 'Uganda', 'ug', 'uga'),
(804, 'Ukraine', 'ua', 'ukr'),
(807, 'North Macedonia', 'mk', 'mkd'),
(818, 'Egypt', 'eg', 'egy'),
(826, 'United Kingdom of Great Britain and Northern Ireland', 'gb', 'gbr'),
(831, 'Guernsey', 'gg', 'ggy'),
(832, 'Jersey', 'je', 'jey'),
(833, 'Isle of Man', 'im', 'imn'),
(834, 'Tanzania, United Republic of', 'tz', 'tza'),
(840, 'United States of America', 'us', 'usa'),
(850, 'Virgin Islands (U.S.)', 'vi', 'vir'),
(854, 'Burkina Faso', 'bf', 'bfa'),
(858, 'Uruguay', 'uy', 'ury'),
(860, 'Uzbekistan', 'uz', 'uzb'),
(862, 'Venezuela (Bolivarian Republic of)', 've', 'ven'),
(876, 'Wallis and Futuna', 'wf', 'wlf'),
(882, 'Samoa', 'ws', 'wsm'),
(887, 'Yemen', 'ye', 'yem'),
(894, 'Zambia', 'zm', 'zmb'),
(897, 'test', 'jk', '');

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

CREATE TABLE `publisher` (
  `image` blob NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `phone` double NOT NULL,
  `email` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `publisher`
--

INSERT INTO `publisher` (`image`, `name`, `description`, `phone`, `email`, `twitter`, `instagram`, `facebook`, `id`) VALUES
('', 'Wednesday Books', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt', 586178, 'vulputate@gmail.com', '', '', '', 1),
('', 'Orion Children\'s Books', 'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem', -84899377, '', '', '', '', 2),
('', 'Random House', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia ', -998838341, 'quae@explicabo.com', '', '', '', 3),
('', 'HarperLuxe', '-98340', 0, 'spring@yahoo.com', '', '', '', 4),
('', 'Crown Publishing Group\r\n', 'abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQR', -356696, 'ABC@gmail.com', '', '', '', 5),
('', 'Publication Nepalaya', 'Publication Nepalaya is one of the leading book publication houses of Nepal.', -4412394, 'publication@nepalaya.com.np', '', '', '', 6),
('', 'Dvir Publishing House Ltd. (Israel) Harper', '', 71928374, '', '', '', '', 7),
('', 'Alchemy Publication', 'Established in 2072 B.S., Alchemy Publication is a publisher of Nepali books.', -1273646, 'http://www.alchemypublication.com.np', '', '', '', 8),
('', 'Kitab Publishers', 'Established in 2006, FinePrint is an independent trade publishing house based in Kathmandu, Nepal. It publishes mostly fiction and literary non-fiction but is open to ideas across all genres.', -1278646, 'fineprintbooks@fineprint.com.np', '', '', '', 9),
('', 'Ratna Pustak Bhandar,', 'रत्न पुस्तक भण्डार नेपालको एक नीजी प्रकाशनगृह हो । यसको स्थापना वि.सं. २००३ ताक काठमाडौँँका व्यापारी रत्नदास श्रेष्ठ र रत्नप्रसाद श्रेष्ठले रत्नपार्क भोटाहिटिमा गरेका थिए । यस प्रकाशनगृहले नेपाली र अङ्रेजी भाषामा भाषा, धर्म, साहित्य, संस्मरण आदि विधाका कृतिहरू प्रकाशित गर्ने गर्छ । Ratna Pustak Bhandar was established in 1946. It is the oldest book store of the country. The founders of the store are Ram Das Shrestha and Ratna Prasad Shrestha.', 12837756, 'ratnapustak@gmail.com ', '', '', '', 10),
('', 'Jk publishers', '', 0, 'jkpublishers@gmail.com', '', '', '', 11);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `language_id` (`language_id`),
  ADD KEY `publisher_id` (`publisher_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `book_author`
--
ALTER TABLE `book_author`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `book_genre`
--
ALTER TABLE `book_genre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `language` (`language`),
  ADD UNIQUE KEY `code` (`code1`);

--
-- Indexes for table `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `book_author`
--
ALTER TABLE `book_author`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `book_genre`
--
ALTER TABLE `book_genre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=898;

--
-- AUTO_INCREMENT for table `publisher`
--
ALTER TABLE `publisher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `author` (`id`),
  ADD CONSTRAINT `book_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`),
  ADD CONSTRAINT `book_ibfk_3` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`id`),
  ADD CONSTRAINT `book_ibfk_4` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

--
-- Constraints for table `book_author`
--
ALTER TABLE `book_author`
  ADD CONSTRAINT `book_author_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  ADD CONSTRAINT `book_author_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `author` (`id`);

--
-- Constraints for table `book_genre`
--
ALTER TABLE `book_genre`
  ADD CONSTRAINT `book_genre_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  ADD CONSTRAINT `book_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
