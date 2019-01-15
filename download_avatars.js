var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
var args = process.argv.slice(2);
var repoName = args[0];
var repoOwner = args[1];


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);

  });
}

function downloadImageByURL(url, filePath) {
  request(url).pipe(fs.createWriteStream(filePath))
}


console.log('Welcome to the GitHub Avatar Downloader!');
var avatars = './avatars';
if (!fs.existsSync(avatars)){
    fs.mkdirSync(avatars);
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(ava) {
    var url = ava.avatar_url;
    var login = avatars + "/" + ava.login + '.jpeg';
    downloadImageByURL(url, login);
  })
});

