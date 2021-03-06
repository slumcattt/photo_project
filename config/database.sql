SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `orig_photo_url` varchar(255) NOT NULL,
  `small_photo_url` varchar(255) NOT NULL,
  `medium_photo_url` varchar(255) NOT NULL,
  `large_photo_url` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL COMMENT 'Foreign key linking to the user',
  `set_id` int(11) NOT NULL,
  `date_taken` datetime DEFAULT NULL,
  `location_lat` varchar(50) DEFAULT NULL,
  `location_lon` varchar(50) DEFAULT NULL,
  `upload_group` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  KEY `set_id` (`set_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

CREATE TABLE IF NOT EXISTS `set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` TEXT NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

CREATE TABLE IF NOT EXISTS `set_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `set_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `set_id` (`set_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `salt` varchar(32) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;


ALTER TABLE `photo`
  ADD CONSTRAINT `photo_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `photo_ibfk_2` FOREIGN KEY (`set_id`) REFERENCES `set` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `set_user`
  ADD CONSTRAINT `set_user_ibfk_1` FOREIGN KEY (`set_id`) REFERENCES `set` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `set_user_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



INSERT INTO `set` (`id`, `name`, `description`, `start_date`, `end_date`) VALUES ('1', 'Testing', 'Testing', '2012-11-01', '2012-11-02');
INSERT INTO `set` (`id`, `name`, `description`, `start_date`, `end_date`) VALUES ('2', 'Only for user 2', 'User 2 set', '2012-11-01', '2012-11-02');

INSERT INTO `user` (`id`, `email`, `password`, `name`) VALUES ('1', 'default@user.me', SHA1('default'), 'Default User');
INSERT INTO `user` (`id`, `email`, `password`, `name`) VALUES ('2', 'user@two.me', SHA1('boom'), 'User 2');

INSERT INTO `set_user` (`id`, `set_id`, `user_id`) VALUES ('1', '1', '1');
INSERT INTO `set_user` (`id`, `set_id`, `user_id`) VALUES ('2', '2', '2');

INSERT INTO `photo` (`id`, `description`, `orig_photo_url`, `small_photo_url`, `medium_photo_url`, `large_photo_url`, `owner_id`, `set_id`, `date_taken`, `location_lat`, `location_lon`, `upload_group`) VALUES ('1', 'A simple test', 'http://fake.com', 'http://fake.com', 'http://fake.com', 'http://fake.com', '1', '1', '2012-11-06 00:00:00', NULL, NULL, '1');
INSERT INTO `photo` (`id`, `description`, `orig_photo_url`, `small_photo_url`, `medium_photo_url`, `large_photo_url`, `owner_id`, `set_id`, `date_taken`, `location_lat`, `location_lon`, `upload_group`) VALUES ('2', 'A simple test', 'http://fake.com', 'http://fake.com', 'http://fake.com', 'http://fake.com', '2', '2', '2012-11-06 00:00:00', NULL, NULL, '2');
