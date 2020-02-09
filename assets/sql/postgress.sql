CREATE TABLE IF NOT EXISTS Users(
	id char(5) NOT NULL UNIQUE PRIMARY KEY,
	login varchar(50) NOT NULL UNIQUE,
	password varchar(50) NOT NULL,
	age integer CHECK (age > 0),
	isDeleted boolean DEFAULT FALSE	
);

INSERT INTO Users VALUES ('ID1', 'login1', 'password1', 10, FALSE);
INSERT INTO Users VALUES ('ID2', 'login2', 'password2', 50, FALSE);
INSERT INTO Users VALUES ('ID3', 'login3', 'password3', 160, FALSE);