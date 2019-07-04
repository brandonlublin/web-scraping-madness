const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('views'));

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const db = require('./models');

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/BrWebscraper';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// Routes
app.get('/', (req, res) => {
    db.Article.find({}).then(dbArticle => {
    // console.log(dbArticle)
    res.render('index', { articles: dbArticle });
    });
});

// Make a request via axios to grab the HTML body from the site of your choice
app.get('/scrape', (req, res) => {
    
    axios.get('https://bleacherreport.com/featured/').then(response => {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    $('li.featuredImage').each((i, element) => {
        var link = $(element)
            .find('div.articleMedia')
            .find('a')
            .attr('href');
        // var link = $(element).find("a").attr("href");
        var articleTitle = $(element)
            .find('div.commentary')
            .find('h3')
            .text();
        var articleSummary = $(element)
            .find('div.articleContent')
            .find('p.articleDescription')
            .text();
        var img = $(element)
            .find('div.articleMedia')
            .find('a.thumbnailImage')
            .find('img.lazyImage')
            .attr('src');
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            articleTitle: articleTitle,
            link: link,
            summary: articleSummary,
            image: img,
        });
        db.Article.create(results)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        // Log the results once you've looped through each of the elements found with cheerio
        console.log(results);
        
    });
});

app.post('/insert', (req, res) => {});

app.post('/update', (req, res) => {});

app.get('/article', (req, res) => {
    //retrieves articles from db
    db.Article.find(
        {}.then(function(err, foundArt) {
        if (err) {
            console.log(err);
        } else {
            // Otherwise, send json of the articles back to user
            // This will fire off the success function of the ajax request
            res.json(foundArt);
        }
        })
    );
});

app.listen(PORT, () => {
    console.log('App running on port ' + PORT + '!');
});
