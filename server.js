
//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");

// First, tell the console what server2.js is doing
console.log("\n******************************************\n" +
            "Grabbing every article headline and link\n" +
            "from the NYT website:" +
            "\n******************************************\n");

// // Require request and cheerio. This makes the scraping possible (Added NEW!)
// var request = require("request");
// var cheerio = require("cheerio");

var PORT = 3003;


// Require all models
var db = require("./models");

// Initialize Express
var app = express();


// Database configuration (Added NEW!)
var databaseUrl = "scraper";
var collections = ["scrapedData"];


// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));


// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newYorkTimesReactDb");

//====================CREATE ARTICLE=============================
// When the server starts, create and save a new User document to the db
// The "unique" rule in the User model's schema will prevent duplicate users from being added to the server
db.Article.create({ title: "fakeTitle", url: "String" })
  .then(function(dbArticle) {
    console.log(dbArticle);
  })
  .catch(function(err) {
    console.log(err.message);
  });




//=====================ROUTES==========================================

// Route for retrieving all Articles from the db
app.get("/", function(req, res) {
    // Find all Articles
    db.Article.find({})
      .then(function(dbArticle) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the news section of `nyTimes`
    axios.get("https://www.nytimes.com/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the scrapedData db
          db.scrapedData.insert({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });
     });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
