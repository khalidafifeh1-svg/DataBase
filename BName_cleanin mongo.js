// === Load tools to work with files and MongoDB ===
const fs = require('fs');                  // lets us read files from the computer
const { MongoClient } = require("mongodb"); // lets us connect and work with MongoDB database

// === MongoDB connection information ===
// This is the address and credentials to connect to your MongoDB cloud database
const uri = "mongodb+srv://khalidabuafifeh:8PSw2F2HKRKgsllp@cluster0.oyubv.mongodb.net/DB?retryWrites=true&w=majority";

// Create a new MongoDB client with options for latest features
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// === Main function to run the data upload process ===
async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    // Select the database named "DB"
    const db = client.db("DB");

    // Select the collection (like a table) named "BName_clean"
    const bnamesCollection = db.collection("BName_clean");

    // Read the JSON file 'BName_clean.json' and convert text to JavaScript object
    const bnamesData = JSON.parse(fs.readFileSync('BName_clean.json', 'utf-8'));

    // For each person in the data...
    for (const item of bnamesData) {
      // Update the database:
      // - Look for a document with the same Name_id
      // - If found, update it with this item’s data
      // - If not found, add it as a new document (upsert: true)
      await bnamesCollection.updateOne(
        { Name_id: item.Name_id }, // Search filter by Name_id
        { $set: item },            // Set (update) the document to this item
        { upsert: true }           // Insert if document doesn't exist
      );
    }

    // Tell the user the process finished successfully
    console.log("Data inserted/updated successfully!");
  } catch (err) {
    // If an error happens, show the error message
    console.error("Error inserting data:", err);
  } finally {
    // Always close the connection when done (or on error)
    await client.close();
  }
}

// Run the main function to start everything
run();
