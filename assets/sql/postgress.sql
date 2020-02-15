DROP TABLE IF EXISTS Users CASCADE;
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

DROP TYPE IF EXISTS PERMISSION CASCADE;
CREATE TYPE PERMISSION AS ENUM ('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES');

DROP TABLE IF EXISTS Groups CASCADE;
CREATE TABLE IF NOT EXISTS Groups(
	id char(5) NOT NULL UNIQUE PRIMARY KEY,
	name varchar(50) NOT NULL UNIQUE,
	permissions PERMISSION ARRAY
);

INSERT INTO Groups VALUES ('ID1', 'Group1', ARRAY ['READ'] :: PERMISSION[]);
INSERT INTO Groups VALUES ('ID2', 'Group2', ARRAY ['READ', 'WRITE'] :: PERMISSION[]);
INSERT INTO Groups VALUES ('ID3', 'Group3', ARRAY ['SHARE', 'DELETE'] :: PERMISSION[]);