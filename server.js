// BASE SETUP
// =================================




//config files
var config = require('./config');

// PACKAGES
var express	= require('express'); //call
var app		= express(); // define app using express
var bodyParser = require('body-parser');
var morgan	= require('morgan'); //request reader
var mongoose = require("mongoose"); // database ODM
var jwt = require('jsonwebtoken'); // web tokens
var path = require('path');

// APP CONFIGURATION --------------
// use bodyPar to digest information from request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
	next();
});


// log all requests to console
app.use(morgan('dev'));



// set static files location
// used for frontend requests
app.use(express.static(__dirname + '/public'));



// REGISTER ROUTES ------------
// all routes will use 'api' prefix
var apiRouter = require('./app/routes/api')(app, express);
app.use('/api', apiRouter);



// MAIN CATCHALL ROUTE ----------
// SEND USERS TO FRONTEND
// must be registered af api routes
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START SERVER
// ========================
app.listen(config.port);
console.log('whole lot of magic on port: ', config.port);





