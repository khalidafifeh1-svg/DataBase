DROP TABLE IF EXISTS Bnames;
DROP TABLE IF EXISTS Btitles;

CREATE TABLE Bnames(
    nameID CHAR(9),
    name VARCHAR(45),
    birthYear INT,
    deathYear INT,
    profession1 VARCHAR(45),
    profession2 VARCHAR(45),
    profession3 VARCHAR(45),
    knownForTitles1 CHAR(9),
    knownForTitles2 CHAR(9),
    knownForTitles3 CHAR(9),
    knownForTitles4 CHAR(9)
);

CREATE TABLE Btitles (
    titleID CHAR(9),
    title VARCHAR(100),
    released INT,
    runtime INT,
    genre1 VARCHAR(50),
    genre2 VARCHAR(50),
    genre3 VARCHAR(50),
    director1 CHAR(9),
    director2 CHAR(9),
    director3 CHAR(9),
    director4 CHAR(9),
    writer1 CHAR(9),
    writer2 CHAR(9),
    writer3 CHAR(9),
    writer4 CHAR(9),
    writer5 CHAR(9),
    principal CHAR(9),
    principal_job VARCHAR(50),
    characters VARCHAR(250),
	averageRating DECIMAL(2,1),
	numVotes INT
);