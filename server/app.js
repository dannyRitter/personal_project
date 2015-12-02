var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



mongoose.connect('mongodb://localhost/personal_project_questions');

//MODELS
mongoose.model('Question', new Schema({
    "name": String,
    "definition": String,
    "quote": String,
    "order": Number,
    "gender": String,
    "success": String
    }, {collection: 'questions'}));
var Question = mongoose.model('Question');

mongoose.model('Test', new Schema({
    "name": String,
    "definition": String,
    "quote": String,
    "order": Number,
    "gender": String,
    "success": String
}, {collection: 'tests'}));
var Test = mongoose.model('Test');


//ANSWERS collection probably not necessary anymore...

//mongoose.model('Answer', new Schema({
//    "response": Number,
//    "order": Number
//    }, {collection: 'answers'}));
//var Answer = mongoose.model('Answer');


//Checking to see if I'm connected to the database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    Question.findOne({'name': 'Using a blindfold'}, 'name definition quote order', function(err, question) {
        if (err) return handleError(err);
        console.log(question.definition);
    })
    Test.findOne({'name': 'Filler Name 1'}, 'name definition quote', function(err, question) {
        if (err) return handleError(err);
        console.log(question.quote);
    })
});



app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));



//Grabbing questions from database to be served to the client
app.get('/data', function(req,res){
    //return the questions from the database, and send it down to the client

    Test.find({}, function(err, data){
        if(err) console.log(err);
        res.send(data);
        //console.log(data);
    });
});


//ANSWERS collection probably not necessary anymore...

//Posting user input to Answers collection
//app.post('/data', function(req,res){
//
//    var addedAnswer = new Answer({
//        "response" : req.body.response,
//        "order" : req.body.order
//    });
//
//    addedAnswer.save(function(err, data){
//        if(err) console.log(err);
//        console.log(data);
//        res.send(data);
//    });
//});


app.get("/*", function(req,res){
    var file = req.params[0] || "/assets/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});
