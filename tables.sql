CREATE TABLE users (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255),
    `last_name` varchar(255),
    `email` varchar(255),
    `password` varchar(255),
    `type` int(11),
    CONSTRAINT `login_type` FOREIGN KEY (`type`) REFERENCES LoginType (`id`),
    PRIMARY KEY (`id`),
    CONSTRAINT UNIQUE(email, password) 
) ENGINE=INNODB;

CREATE TABLE courses (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `course_name` varchar(255) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=INNODB;

CREATE TABLE student_to_course(
   `sid` int(11) NOT NULL,
   `cid` int(11) NOT NULL,
   `completion` int(11) NOT NULL,
   CONSTRAINT `cid` FOREIGN KEY (`cid`) REFERENCES courses(`id`) ON DELETE CASCADE,
   CONSTRAINT `sid` FOREIGN KEY (`sid`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE parents (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255),
    `last_name` varchar(255),
    `email` varchar(255),
    `password` varchar(255),
    `sid` int(11),
    CONSTRAINT `sid_parent` FOREIGN KEY (`sid`) REFERENCES users (`id`),
    PRIMARY KEY (`id`),
    CONSTRAINT UNIQUE(email, password)
) ENGINE=INNODB;