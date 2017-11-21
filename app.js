var fs = require('fs');
var express = require('express');
var app = express();
var parser = require('body-parser');
var path = ('path');
var pg = require('pg');
var parseConnectionString = require('pg-connection-string');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const configuration = 'postgres://postgres:lOk(9Ow,Ce1q@localhost/bulletinboard';
const pool = new pg.Pool(typeof configuration === 'string' ? parseConnectionString.parse(configuration) : configuration);

app.set('view engine', 'ejs');


//main router
app.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('select * from messages', function(err, result) {
    res.render('bboard', {result: result.rows});
      done();
      });
  });
}); // router close


//post page
 app.get('/post', function(req,res){

   res.render('post', {});

 }); //router close

 //submit button
app.post('/add', function(req,res){
  pool.connect(function(err, client, done) {
    client.query(`insert into messages (title,body) values ($1, $2)`,[req.body.title,req.body.message]);
      done();
      res.redirect('/');
      });
  }); //router close

app.post('/delete', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('delete from messages', function(err, result) {
      res.redirect('/');
      done();
      });
  });
}); // router close


//No modifications below this line!

//if no routes are matched, return a 404
app.get('*', function(req, res) {
    res.status(404).send('<h1>uh oh! page not found!</h1>');
});

//have the application listen on a specific port
app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});
