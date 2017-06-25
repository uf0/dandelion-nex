var MongoClient = require('mongodb').MongoClient,
    request = require('request'),
    config = require('./config.js');

// Connection URL
var url = 'mongodb://localhost:27017/mozilla';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  if(err){throw err}
  console.log("Connected correctly to server");

  db.close();
});
