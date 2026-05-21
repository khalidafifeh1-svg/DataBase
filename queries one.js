db.BTitle_clean.aggregate([
  // Step 1: Prepare fields to work with
  {
    $project: {
      genres: 1,  // Keep the genres array as is
      
      // Create a new field called 'people' that combines all people involved
      people: {
        $setUnion: [  // Combine arrays and remove duplicates
          { $ifNull: ["$directors", []] },  // Directors array or empty if missing
          { $ifNull: ["$writers", []] },    // Writers array or empty if missing
          {
            $map: {                        // For principals, extract only their IDs
              input: { $ifNull: ["$principals", []] },  // principals array or empty if missing
              as: "p",                     // variable for each principal
              in: "$$p.id"                 // get the id field from each principal
            }
          }
        ]
      }
    }
  },

  // Step 2: Split genres array so each document has only one genre (duplicate docs for each genre)
  { $unwind: "$genres" },

  // Step 3: Split people array so each document has only one person
  { $unwind: "$people" },

  // Step 4: Group by genre to gather all unique people in that genre
  {
    $group: {
      _id: "$genres",                // Group by genre
      uniquePeople: { $addToSet: "$people" }  // Collect unique people IDs into a set (no duplicates)
    }
  },

  // Step 5: Format the output to show genre and number of unique people
  {
    $project: {
      genre: "$_id",                  // Rename _id to genre
      count: { $size: "$uniquePeople" }  // Count how many unique people were collected
    }
  },

  // Step 6: Sort the genres by the count of unique people in descending order
  { $sort: { count: -1 } }
]);
