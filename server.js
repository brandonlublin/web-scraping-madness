var bodyParser = require('body-parser')
var mongoose = require('mongoose')
// var logger = require('morgan');

var cheerio = require("cheerio");
var axios = require("axios");

// var path = require('path');

var mongojs = require('mongojs');

var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
// app.use(logger('dev'));

var port = process.env.PORT || 8080;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static(__dirname + '/public'));

const db = require("./models")

mongoose.connect("mongodb://localhost/s2kScraper", { useNewUrlParser: true })

// Make a request via axios to grab the HTML body from the site of your choice
axios.get("https://news.vice.com/en_us").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    var $ = cheerio.load(response.data);
    
    // An empty array to save the data that we'll scrape
    var articles = {};

    $('section._jnvm1n').each((i, element) => { 
        let article = $('article.unit')
        console.log(article.children.toString());
        
    });
    
    


    // $(element).find("h3").find("a").text()
    

    // Log the results once you've looped through each of the elements found with cheerio
});

app.listen(port, function () {
    console.log('App running on port ' + port + '!');
});
