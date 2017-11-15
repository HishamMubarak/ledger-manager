//Start here
const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');

const config = require('./config/dbConfig');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Whitelisted Links for API Call
var originsWhiteList = [
    'http://localhost:4200', //Frontend Dev Url
    'https://creditclient-c7340.firebaseapp.com'
];

//Creating corsOptions Object
var corsOptions = {
    origin: function(origin, callback){
        var isWhitelisted = originsWhiteList.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}

//Enabling CORS and passing corsOptions as Parameter
app.use(cors(corsOptions));

var db;

app.get('/', function(err, res){
    res.send("Welcome to the backend. Now go the frontend");
});

mongodb.MongoClient.connect(config.dbString, function(err, database) {
    if(err) {
        console.log(err);
        console.log("Database Connection Error");
    } else {
        db = database;
        console.log("Database connection ready");
        require('./routes')(app, db);

        app.listen(3000, function() {
            console.log("Server running on port " + 3000);
        });
    }
});


