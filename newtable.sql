-- Step 1: Select the database to work with
USE abuafifk;

-- Step 2: Create a cleaned-up table for people (actors, directors, etc.)
CREATE TABLE IF NOT EXISTS Name (
    nameID CHAR(9) PRIMARY KEY,          -- Unique ID for the person (like a personal code)
    name VARCHAR(45) NOT NULL,           -- Person's name (cannot be empty)
    birthYear INT NULL,                  -- Year they were born (optional)
    deathYear INT NULL                   -- Year they died (optional)
);

-- Insert only unique and non-empty names from the original names table
INSERT INTO Name (nameID, name, birthYear, deathYear)
SELECT DISTINCT nameID, name, birthYear, deathYear
FROM names
WHERE name IS NOT NULL;

-- Step 3: Create a table for titles (movies or shows)
CREATE TABLE IF NOT EXISTS TiTles (
    titleID CHAR(9) PRIMARY KEY,         -- Unique code for each movie/show
    title VARCHAR(100) NOT NULL,         -- The actual name of the title
    released INT,                        -- Year it was released (optional)
    runtime INT,                         -- How long it is (in minutes, optional)
    averageRating DECIMAL(2,1),          -- Average rating (e.g. 8.5 out of 10)
    numVotes INT                         -- Number of votes the rating is based on
);

-- Insert only unique and non-empty titles
INSERT INTO TiTles (titleID, title, released, runtime, averageRating, numVotes)
SELECT DISTINCT titleID, title, released, runtime, averageRating, numVotes
FROM titles
WHERE title IS NOT NULL;

-- Step 4: Create a table to store unique professions (e.g. actor, director, etc.)
CREATE TABLE IF NOT EXISTS Professions (
    professionID INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID that increases automatically
    professionName VARCHAR(45) UNIQUE NOT NULL    -- The name of the profession (must be unique)
);

-- Insert all unique profession names from the original data
INSERT INTO Professions (professionName)
SELECT DISTINCT profession1 FROM names WHERE profession1 IS NOT NULL
UNION
SELECT DISTINCT profession2 FROM names WHERE profession2 IS NOT NULL
UNION
SELECT DISTINCT profession3 FROM names WHERE profession3 IS NOT NULL;

-- Step 5: Link people to their professions (many-to-many relationship)
CREATE TABLE IF NOT EXISTS Name_Professions (
    nameID CHAR(9),
    professionID INT,
    PRIMARY KEY (nameID, professionID),                   -- Each combination is unique
    FOREIGN KEY (nameID) REFERENCES Name(nameID),         -- Links to Name table
    FOREIGN KEY (professionID) REFERENCES Professions(professionID)  -- Links to Professions table
);

-- Insert people with their corresponding profession(s)
INSERT INTO Name_Professions (nameID, professionID)
SELECT DISTINCT n.nameID, p.professionID
FROM names n
JOIN Professions p ON n.profession1 = p.professionName
WHERE n.profession1 IS NOT NULL
UNION
SELECT DISTINCT n.nameID, p.professionID
FROM names n
JOIN Professions p ON n.profession2 = p.professionName
WHERE n.profession2 IS NOT NULL
UNION
SELECT DISTINCT n.nameID, p.professionID
FROM names n
JOIN Professions p ON n.profession3 = p.professionName
WHERE n.profession3 IS NOT NULL;

-- Step 6: Create a table to store job types (e.g. director, writer, main actor, etc.)
CREATE TABLE IF NOT EXISTS Jobtype (
    jobID INT AUTO_INCREMENT PRIMARY KEY,         -- Unique ID for job type
    jobType VARCHAR(50) UNIQUE NOT NULL           -- Name of the job (must be unique)
);

-- Insert all job types found in the data + 'director' and 'writer'
INSERT INTO Jobtype (jobType)
SELECT DISTINCT principal_job_category FROM titles WHERE principal_job_category IS NOT NULL
UNION
SELECT 'director'
UNION
SELECT 'writer';

-- Step 7: Create a table that shows who did what job in which title
CREATE TABLE IF NOT EXISTS Principals (
    titleID CHAR(9),
    nameID CHAR(9),
    jobID INT,
    PRIMARY KEY (titleID, nameID, jobID),        -- Unique combination for title, person, and job
    FOREIGN KEY (titleID) REFERENCES TiTles(titleID),
    FOREIGN KEY (nameID) REFERENCES Name(nameID),
    FOREIGN KEY (jobID) REFERENCES Jobtype(jobID)
);

-- Insert directors into the Principals table
INSERT IGNORE INTO Principals (titleID, nameID, jobID)
SELECT DISTINCT titleID, director1, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'director'
WHERE director1 IS NOT NULL
UNION
SELECT DISTINCT titleID, director2, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'director'
WHERE director2 IS NOT NULL
UNION
SELECT DISTINCT titleID, director3, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'director'
WHERE director3 IS NOT NULL
UNION
SELECT DISTINCT titleID, director4, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'director'
WHERE director4 IS NOT NULL;

-- Insert writers into the Principals table
INSERT IGNORE INTO Principals (titleID, nameID, jobID)
SELECT DISTINCT titleID, writer1, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'writer'
WHERE writer1 IS NOT NULL
UNION
SELECT DISTINCT titleID, writer2, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'writer'
WHERE writer2 IS NOT NULL
UNION
SELECT DISTINCT titleID, writer3, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'writer'
WHERE writer3 IS NOT NULL
UNION
SELECT DISTINCT titleID, writer4, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'writer'
WHERE writer4 IS NOT NULL
UNION
SELECT DISTINCT titleID, writer5, j.jobID FROM titles
JOIN Jobtype j ON j.jobType = 'writer'
WHERE writer5 IS NOT NULL;

-- Insert other job roles (like principal actors) into Principals
INSERT IGNORE INTO Principals (titleID, nameID, jobID)
SELECT DISTINCT t.titleID, t.principal, j.jobID
FROM titles t
JOIN Jobtype j ON j.jobType = t.principal_job_category
WHERE t.principal IS NOT NULL;

-- Step 8: Create a table of genres (like Action, Comedy, etc.)
CREATE TABLE IF NOT EXISTS Genres (
    genreID INT AUTO_INCREMENT PRIMARY KEY,        -- Unique genre ID
    genreName VARCHAR(50) UNIQUE NOT NULL          -- Name of the genre
);

-- Insert unique genre names from the titles
INSERT INTO Genres (genreName)
SELECT DISTINCT genre1 FROM titles WHERE genre1 IS NOT NULL
UNION
SELECT DISTINCT genre2 FROM titles WHERE genre2 IS NOT NULL
UNION
SELECT DISTINCT genre3 FROM titles WHERE genre3 IS NOT NULL;

-- Step 9: Connect titles with their genres (many-to-many)
CREATE TABLE IF NOT EXISTS Title_Genres (
    titleID CHAR(9),
    genreID INT,
    PRIMARY KEY (titleID, genreID),
    FOREIGN KEY (titleID) REFERENCES TiTles(titleID),
    FOREIGN KEY (genreID) REFERENCES Genres(genreID)
);

-- Insert connections between each title and its genre(s)
INSERT INTO Title_Genres (titleID, genreID)
SELECT titleID, g.genreID
FROM titles t
JOIN Genres g ON t.genre1 = g.genreName
WHERE genre1 IS NOT NULL
UNION
SELECT titleID, g.genreID
FROM titles t
JOIN Genres g ON t.genre2 = g.genreName
WHERE genre2 IS NOT NULL
UNION
SELECT titleID, g.genreID
FROM titles t
JOIN Genres g ON t.genre3 = g.genreName
WHERE genre3 IS NOT NULL;

-- Step 10: Store which title(s) each person is best known for
CREATE TABLE IF NOT EXISTS KnownForTitles (
    titleID CHAR(9),
    nameID CHAR(9),
    PRIMARY KEY (titleID, nameID),
    FOREIGN KEY (titleID) REFERENCES TiTles(titleID),
    FOREIGN KEY (nameID) REFERENCES Name(nameID)
);

-- Insert known titles for each person
INSERT INTO KnownForTitles (titleID, nameID)
SELECT DISTINCT k.knownForTitles, k.nameID
FROM (
    SELECT knownForTitles1 AS knownForTitles, nameID FROM names WHERE knownForTitles1 IS NOT NULL
    UNION
    SELECT knownForTitles2 AS knownForTitles, nameID FROM names WHERE knownForTitles2 IS NOT NULL
    UNION
    SELECT knownForTitles3 AS knownForTitles, nameID FROM names WHERE knownForTitles3 IS NOT NULL
    UNION
    SELECT knownForTitles4 AS knownForTitles, nameID FROM names WHERE knownForTitles4 IS NOT NULL
) AS k
JOIN TiTles t ON k.knownForTitles = t.titleID;

-- === ANALYSIS QUERIES ===

-- Query 1: Count how many different people worked on titles of each genre
SELECT 
    g.genreName,                                  -- Genre name (e.g. Action, Drama)
    COUNT(DISTINCT p.nameID) AS peopleCount       -- Count of unique people who worked in this genre
FROM 
    Genres g
JOIN 
    Title_Genres tg ON g.genreID = tg.genreID     -- Link genres to titles
JOIN 
    TiTles t ON tg.titleID = t.titleID            -- Link titles to genre matches
JOIN 
    Principals p ON t.titleID = p.titleID         -- Find all people who worked on these titles
GROUP BY 
    g.genreName;                                  -- Show result per genre

-- Query 2: Find living cinematographers known for titles with low ratings (≤ 4.5)
SELECT 
    n.name,                                -- Person's name
    t.title,                               -- Title they are known for
    t.averageRating AS lowest_rating       -- Rating of the title
FROM 
    Name n
JOIN 
    Name_Professions np ON n.nameID = np.nameID
JOIN 
    Professions p ON np.professionID = p.professionID
JOIN 
    KnownForTitles kft ON n.nameID = kft.nameID
JOIN 
    TiTles t ON kft.titleID = t.titleID
JOIN 
    Principals pr ON t.titleID = pr.titleID
JOIN 
    Jobtype j ON pr.jobID = j.jobID
WHERE 
    p.professionName = 'cinematographer'    -- Only people who are cinematographers
    AND n.deathYear IS NULL                 -- Only living people
    AND t.averageRating <= 4.5              -- Only titles with a low rating
ORDER BY 
    t.averageRating DESC;                   -- Sort from highest (bad) to lowest (worse)
