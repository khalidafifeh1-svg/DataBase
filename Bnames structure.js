// === Load required tools ===
// 'fs' helps us read and write files, 'path' helps with file paths (not used directly here but included)
const fs = require('fs');
const path = require('path');

// === File locations ===
// These variables store where the input and output files are located on your computer
const inputPath = 'C:/Users/khali/Desktop/DB_Coursework/Bname.json';      // Original data file with names
const outputPath = 'C:/Users/khali/Desktop/DB_Coursework/BName_clean.json'; // Where the cleaned data will be saved

// === Check if input file exists ===
// Before doing anything, make sure the input file is actually there
if (!fs.existsSync(inputPath)) {
  console.log("File not found:", inputPath); // Tell the user the file wasn't found
  process.exit(); // Stop the program here, because we can't continue without the file
}

// === Read the file and convert to data we can use ===
// Read the file as text
const rawData = fs.readFileSync(inputPath);
// Convert the text (JSON format) into a JavaScript object to work with
const data = JSON.parse(rawData);

// === Make sure the data format is correct ===
// We expect the data to have a property called "Bnames" which should be a list (array)
if (!data.Bnames || !Array.isArray(data.Bnames)) {
  console.log("Bnames is missing or is not an array."); // Warn if it's not right
  process.exit(); // Stop the program if the data is not what we expect
}

// === Transform the data ===
// Go through each item in the "Bnames" list and create a new cleaned-up object for it
const transformedData = data.Bnames.map(original => ({
  Name_id: original.nameID,            // Copy the person's ID
  name: original.name,                  // Copy the person's name
  birthYear: parseInt(original.birthYear), // Convert birth year from text to a number
  deathYear: parseInt(original.deathYear), // Convert death year from text to a number
  // Collect up to 3 professions, but only keep ones that are not empty or undefined
  professions: [
    original.profession1,
    original.profession2,
    original.profession3
  ].filter(Boolean),  // filter(Boolean) removes any empty or falsey values
  // Collect up to 4 titles this person is known for, again removing empty ones
  knownForTitles: [
    original.knownForTitles1,
    original.knownForTitles2,
    original.knownForTitles3,
    original.knownForTitles4
  ].filter(Boolean)
}));

// === Save the cleaned data to a new file ===
// Convert the cleaned data back to JSON text, formatted nicely with indentation (2 spaces)
// and write it to the output file location
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

// Let the user know the program finished successfully
console.log(`Transformed data saved to: ${outputPath}`);
