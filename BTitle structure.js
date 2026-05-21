// === Load the required tools ===
// These two lines bring in tools from Node.js that help us work with files and file paths.
const fs = require('fs');       // 'fs' lets us read and write files
const path = require('path');   // 'path' helps us deal with file locations (folders and file names)

// === File Locations ===
// These are the locations (paths) of the input and output files on your computer.
const inputPath = 'C:/Users/khali/Desktop/DB_Coursework/Btitle.json';      // File with original title data
const outputPath = 'C:/Users/khali/Desktop/DB_Coursework/BTitle_clean.json';  // Where the cleaned data will be saved
const characterPath = 'C:/Users/khali/Desktop/DB_Coursework/BName_clean.json'; // File with character (name) info

// === Check if files actually exist ===
// Before doing anything, we check if the needed files are there. If not, we stop the program.
if (!fs.existsSync(inputPath)) {
  console.log("File not found:", inputPath);
  process.exit();  // Stops the program
}
if (!fs.existsSync(characterPath)) {
  console.log("Characters file not found:", characterPath);
  process.exit();  // Stops the program
}

// === Load the data from the files ===
// These lines read the files and turn the JSON (text) into JavaScript objects we can work with.
const rawData = fs.readFileSync(inputPath);
const data = JSON.parse(rawData);  // Turns the JSON text into usable data

const characterRaw = fs.readFileSync(characterPath);
const characterData = JSON.parse(characterRaw);  // Same here, but for the character file

// === Make a map of names by ID ===
// This creates a fast lookup table: if we know someone's ID, we can quickly find their name.
const nameMap = {};
characterData.forEach(person => {
  nameMap[person.Name_id] = person.name;  // Store the name under the ID
});

// === Check the format of the title data ===
// Make sure that the data we loaded contains something called "Btitles" and that it's a list.
if (!data.Btitles || !Array.isArray(data.Btitles)) {
  console.log("Btitles is missing or not an array.");
  process.exit();  // Stop the program if data is not as expected
}

// === Group data by titleID ===
// We'll clean up and group all the information about each title using its unique ID.
const grouped = {};

data.Btitles.forEach(original => {
  const id = original.titleID;  // Each title has a unique ID

  // If this title hasn't been added yet, create a new group for it
  if (!grouped[id]) {
    grouped[id] = {
      title_id: original.titleID,     // ID of the title
      title: original.title,          // Title name
      released: parseInt(original.released),  // Convert release year to a number
      runtime: parseInt(original.runtime),    // Convert runtime to a number
      genres: [original.genre1, original.genre2, original.genre3].filter(Boolean), // Collect non-empty genres
      directors: [
        original.director1, original.director2,
        original.director3, original.director4
      ].filter(Boolean),  // Get list of all non-empty directors
      writers: [
        original.writer1, original.writer2,
        original.writer3, original.writer4,
        original.writer5
      ].filter(Boolean),  // Get list of all non-empty writers
      averageRating: parseFloat(original.averageRating),  // Convert rating to a number with decimals
      numVotes: parseInt(original.numVotes),              // Convert vote count to a number
      principals: []  // Start an empty list where we will add key people involved
    };
  }

  // === Add information about key people (principals) ===
  // For each row, if there's a person listed with a job (like actor, director), we add them.
  if (original.principal && original.principal_job) {
    const principalName = nameMap[original.principal] || null;  // Look up the name using the ID

    // If the name is missing, show a warning (not stopping the program)
    if (!principalName) {
      console.warn(`Name not found for principal ID: ${original.principal}`);
    }

    // Add the person to the list of principals for this title
    grouped[id].principals.push({
      id: original.principal,
      name: principalName,  // This might be null if name wasn't found
      job: original.principal_job
    });
  }
});

// === Turn the grouped data into a list and save it to a new file ===
// We only care about the grouped values, so we turn them into an array (list)
const transformedData = Object.values(grouped);

// Save the cleaned-up data into a new file, formatted to be human-readable
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

// Let the user know we're done
console.log(`Transformed data saved to: ${outputPath}`);
