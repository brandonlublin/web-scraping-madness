var express = require('express');
var router = express.Router();
var path = require('path');
var cheerio = require('cheerio');

var request = require('request');

var Comment = require('../models/comment.js')
var Article = require('../models/article.js')

router.get('/', function(req, res) {
    res.redirect('/articles')
})