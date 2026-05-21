db.BName_clean.aggregate([
  // Step 1: Find all living cinematographers
  {
    $match: {
      // Either deathYear is null (meaning no death recorded)
      // OR deathYear field does not exist at all
      $or: [
        { deathYear: null },
        { deathYear: { $exists: false } }
      ],
      // And their professions array contains "cinematographer"
      professions: { $in: ["cinematographer"] }
    }
  },

  // Step 2: Join (lookup) movie info from the BTitle_clean collection
  {
    $lookup: {
      from: "BTitle_clean",        // The other collection to join with (movie titles)
      localField: "knownForTitles", // This person's known movie IDs (array)
      foreignField: "title_id",     // Match movie documents where title_id equals knownForTitles entries
      as: "titles_info"             // Output joined movie data into this new field (array)
    }
  },

  // Step 3: Split the array of movies so each movie becomes its own document (record)
  { $unwind: "$titles_info" },

  // Step 4: Keep only movies with an average rating less than or equal to 4.5
  {
    $match: {
      "titles_info.averageRating": { $lte: 4.5 }
    }
  },

  // Step 5: Pick only the fields we want to see in the final output
  {
    $project: {
      _id: 0,                        // Hide the internal MongoDB ID
      cinematographerName: "$name",  // Show the person's name as 'cinematographerName'
      title: "$titles_info.title",   // Show the movie title
      averageRating: "$titles_info.averageRating" // Show movie rating
    }
  },

  // Step 6: Sort the results by cinematographer's name, A to Z
  {
    $sort: { cinematographerName: 1 }
  },

  // Optional: Show only the first 20 results (for easier viewing/testing)
  { $limit: 20 }
]);
