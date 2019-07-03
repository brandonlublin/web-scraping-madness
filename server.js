const express = require("express")
const mongoose = require("mongoose")
const logger = require("morgan")
const path = require("path")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

const PORT = process.env.PORT || 8080

app.use(logger("dev"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(express.static("views"))

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

const db = require("./models")

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/", (req, res) => {
    db.Article.find({}).then(dbArticle => {
        // console.log(dbArticle)
        res.render("index", {articles: dbArticle});
    });
})

app.get("/articles", (req, res) => {
    db.Article.find({}).then(dbArticle => {
        res.json(dbArticle)
    }).catch(err => {
        res.json(err)
    })
})
// Make a request via axios to grab the HTML body from the site of your choice
axios.get("https://bleacherreport.com/featured/").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("li.featuredImage").each(function(i, element) {

    var link = $(element).find('div.articleMedia').find('a').attr('href');
    // var link = $(element).find("a").attr("href");
    var articleTitle = $(element).find('div.commentary').find('h3').text();
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      articleTitle: articleTitle,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '!');
});
