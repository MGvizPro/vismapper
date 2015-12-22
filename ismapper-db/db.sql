USE ismapper;

CREATE TABLE project
(
  id varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  title text NOT NULL,
  date bigint(99) NOT NULL,
  ready bigint(1) NOT NULL,
  PRIMARY KEY (id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
