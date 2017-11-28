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

const configuration = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';
const pool = new pg.Pool(typeof configuration === 'string' ? parseConnectionString.parse(configuration) : configuration);

app.set('view engine', 'ejs');


//main view
app.get('/', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('select * from messages', function(err, result) {
    res.render('bboard', {result: result.rows});
      done();
      });
  });
}); // router close

//submit button
app.post('/add', function(req,res){
  pool.connect(function(err, client, done) {
    client.query(`insert into messages (title,body) values ($1, $2)`,[req.body.title,req.body.message]);
      done();
      res.redirect('/');
      });
  }); //router close

//delete all
app.delete('/delete', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('delete from messages', function(err, result) {
      res.sendStatus(200);
      done();
      });
  });
}); // router close


//delete by message id
app.delete('/delete/:id', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('delete from messages where id = $1',[req.params.id], function(err, result) {
      res.sendStatus(200);
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
