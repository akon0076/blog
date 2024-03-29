CREATE TABLE
IF NOT EXISTS `file`
(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `crt_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP comment '创建时间',
   `upd_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP comment '更新时间',
   `name` VARCHAR(255) NOT NULL,
   `type` VARCHAR(8) NOT NULL,
   `atc_id` INT,
   PRIMARY KEY
( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8

