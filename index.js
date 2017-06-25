var MongoClient = require('mongodb').MongoClient,
    request = require('request'),
    async = require('async'),
    fs = require('fs'),
    d3dsv = require('d3-dsv'),
    config = require('./config.js');

var url = 'mongodb://localhost:27017/mozilla';
var endpoint = 'https://api.dandelion.eu/datatxt/nex/v1';

MongoClient.connect(url, function(err, db) {
  if(err){throw err}
  var collection = db.collection('dandelion-nex');

  // load data
  var data = d3dsv.tsvParse(fs.readFileSync('data/urls.tsv', 'utf-8'));
  var total = data.length;


  async.eachOfSeries(
    data,
    function(page, index, callback) {

        getEntity(page.url, function(err,response){
          if(err){
            console.log('ERROR ' + (index+1) + '/' + total + ' ' + page.url, err);
            callback()
          }else{
            if(response.error){
              console.log('ERROR ' + (index+1) + '/' + total + ' ' + page.url, response);
              callback()
            }else{
              response.source = page;
              collection.insertOne(response, function(err, result) {
                  if(err){
                    console.log('ERROR ' + (index+1) + '/' + total + ' ' + page.url, err);
                    callback()
                  }else{
                    console.log((index+1) + '/' + total + ' ' + page.url);
                    callback()
                  }
                });
            }
          }
        })

      },
    function(err) {
        if( err ) {
          console.log(err);
        } else {
          console.log('All urls have been processed successfully');
          db.close();
        }
      }
  );
});



function getEntity(url, callback){
  var params = {
    url:url,
    token: config.token,
    include: 'types'
  }
  request({url:endpoint, qs:params}, function(err, response, body) {
    callback(err, JSON.parse(body))
  });
}
