#!/usr/bin/env node

var FeedParser = require('feedparser')
  , async = require('async')
  , posts = []
  , hackerNews = require("node-hacker-news")()
  , colors = require('colors')
  , prompt = require('prompt')
  , exec = require('child_process').exec
  , platform = require('os').platform();

const shellOpenCommand = {
  'win32': 'start ',
  'linux': 'xdg-open ',
  'darwin': 'open '
}[platform];

const hnUrls = {
  'item': 'https://news.ycombinator.com/item?id='
};

hackerNews.getHottestItems(28, function(err, items) {
  if (err) {
    throw err;
  }

  posts = items.slice();
  async.each(posts, printPostTitle, promptForPost);
});

function printPostTitle(post, next) {
  console.log((posts.indexOf(post) + 1).toString().red + ". " + post.title);
  next();
}

function openPost(post) {
  var url = post.url.length ? post.url : hnUrls.item + post.id;

  exec(shellOpenCommand + url, function(error) {
    if(error) throw error;
  });
}

function promptForPost() {
  prompt.start();

  var schema = {
    properties: {
      post: {
        message: 'Type post number to open, or 0 to quit',
        required: true
      },
    }
  };

  prompt.get(schema, function (err, result) {
    if(result.post !== "0"){
      var i = parseInt(result.post);
      if(isNaN(i) || i > posts.length || i < 1) {
        console.log("Invalid post number");
      } else {
        openPost(posts[i - 1]);
      }
      promptForPost();
    }
  });
}
