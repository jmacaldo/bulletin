var fs = require('fs');
var express = require('express');
var app = express();
var parser = require('body-parser');
var pg = require('pg');
var parseConnectionString = require('pg-connection-string');
var cons = require('consolidate');
var dust = require('dustjs-helpers');

const configuration = 'postgres://postgres:lOk(9Ow,Ce1q@localhost/bulletinboard';
const pool = new pg.Pool(typeof configuration === 'string' ? parseConnectionString.parse(configuration) : configuration);


//main router
app.get('/', function(req, res) {

  pool.connect(function(err, client, done) {
    client.query(`select * from hats where id = (select (id) from users where name = 'joven')`, function(err, result) {
      console.log(result.rows);
      done();
      pool.end();
      });
  });

}); // router close - DO NOT TOUCH!


//setting up router for random
 app.get('/test', function(req, res){

   var rand = Math.floor((Math.random() * 20) + 1);
   console.log('this is your random number: '+rand);

 }); //close tag for random router

//if no routes are matched, return a 404
app.get('*', function(req, res) {
    res.status(404).send('<h1>uh oh! page not found!</h1>');
});

//have the application listen on a specific port
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
