// === Load necessary tools ===
// 'fs' lets us read files from the computer
// 'mongodb' provides tools to connect to MongoDB database
const fs = require('fs');
const { MongoClient } = require("mongodb");

// === MongoDB connection details ===
// This is the address and credentials needed to connect to your MongoDB cloud database
const uri = "mongodb+srv://khalidabuafifeh:8PSw2F2HKRKgsllp@cluster0.oyubv.mongodb.net/DB?retryWrites=true&w=majority";

// Create a new MongoDB client with options to support latest connection features
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// === Main function to run the program ===
async function run() {
  try {
    // Connect to the MongoDB database
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    // Get a reference to the database named "DB"
    const db = client.db("DB");

    // Get a reference to the collection (like a table) named "BTitle_clean11"
    const btitleCollection = db.collection("BTitle_clean11");

    // Read the file 'BTitle_clean.json' and convert its text content into usable data (an array)
    const btitleData = JSON.parse(fs.readFileSync('BTitle_clean.json', 'utf-8'));

    // For each item (movie or title) in the array...
    for (const item of btitleData) {
      // Update the database:
      // - Find a document with the same title_id
      // - If found, update it with the new info ($set)
      // - If not found, insert this item as a new document (upsert: true)
      await btitleCollection.updateOne(
        { title_id: item.title_id },  // Find by title_id
        { $set: item },               // Update with new data
        { upsert: true }              // Insert if doesn't exist
      );
    }

    // Inform the user that data was successfully added or updated
    console.log("Data inserted/updated successfully!");
  } catch (err) {
    // If any error happens, print it out here
    console.error("Error inserting data:", err);
  } finally {
    // No matter what happens, close the database connection when finished
    await client.close();
  }
}

// Run the main function to start the process
run();
