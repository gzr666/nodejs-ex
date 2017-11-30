var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var _ = require("lodash");
var nodemailer = require('nodemailer');
var jwt    = require('jsonwebtoken');
var config = require("./models/config.js");
/* var email 	= require("./node_modules/emailjs/email");
var server 	= email.server.connect({
   user:    "bleksabat666@gmail.com", 
   password:"sabbath666", 
   host:    "smtp.gmail.com", 
   ssl:     true
}); */

var transporter = nodemailer.createTransport('smtps://bleksabat666@gmail.com:sabbath666@smtp.gmail.com');

var app = express();

//openshift or local

/*
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000; 

//mongo connectionstring
//mongodb configuration
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoUser = "admin"; //mongodb username
var mongoPass = "t2Nnf6Uc5gRx"; //mongodb password
var mongoDb   = "nodesinj"; //mongodb database name

var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort +  '/' + mongoDb;

if (typeof process.env.OPENSHIFT_MONGODB_DB_HOST === "undefined") {
    
    mongoString = "mongodb://localhost/nodesinj";
  };

*/

var port = process.env.PORT;

//mongo connectionstring
//mongodb configuration open shift
/*var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoUser = "admin"; //mongodb username
var mongoPass = "Buz-S9gtgMTm"; //mongodb password
var mongoDb   = "stationlocator"; //mongodb database name*/


//heroku
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoUser = "geezer"; //mongodb username
var mongoPass = "sabbath66"; //mongodb password
var mongoDb   = "stationlocator"; //mongodb database name



var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + 'ds243055.mlab.com:43055/stationlocator';


//enabling static files
app.use(express.static(__dirname + "/public"));

//adding middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride("X-HTTP-Method-Override"));

app.use(function(req,res,next){

    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    if ('OPTIONS' === req.method) {
    res.send(200);
  } 
  else {
    next();
  }
    

});


app.get("/test",function(req,res,next){

res.send("Hello World");



});

app.post("/mail",function(req,res,next){

/* server.send({
   text:    "i hope this works", 
   from:    "someone@mail.com", 
   to:      "bleksabat666@gmail.com",
   cc:      "else <else@your-email.com>",
   subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
 */
 
 var test = "is it working";
 
 var mailOptions = {
    from: '"Booking Aplikacija: "<bleksabat666@gmail.com>', // sender address
    to: "bleksabat666@gmail.com", // list of receivers
    subject: 'Upit - Booking', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Upit za booking</b>' + 
    '<br>Ime: ' + req.body.firstname + 
    '<br>Prezime: ' + req.body.lastname +
    '<br>Email: ' + req.body.mail + 
    '<br>Telefon: ' + req.body.phone + 
    '<br>Mobitel: ' + req.body.mobile + 
    '<br>Smjestajna jedinica: ' + req.body.smjedinica + 
    '<br>Dolazak: ' + req.body.dolazak  +
    '<br>Odlazak: ' + req.body.odlazak + 
    '<br>Broj odraslih: ' + req.body.brojodraslih + 
    '<br>Broj djece do 6 god. : ' + req.body.brojdjecedo6 + 
    '<br>Broj djece od 6 do 12 god. : ' + req.body.brojdjeceod6 + 
    '<br>Upit: ' + req.body.upit 

	
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
     console.log(error);
    }
    console.log('Message sent: ' + info.response);

});

res.send({success:"success"});

next();


});

app.post("/token",function(req,res){

  var user = config.user;
  console.log(user);
  var claims = {
    "user":user.username,
    "role":"admin"

  };
console.log(req.body.password);
console.log(user.password);

  if (user.password !== req.body.password) {

        res.status(400).send({ success: false, message: 'Authentication failed. Wrong password.' });
        
      }

       else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(claims, config.secret, {
          expiresIn: 1000000 // expires in 24 hours
        });

        res.send({ user:"rade",

        role:"admin",
        token:token });

      }
      

});

//connect to mongodb
mongoose.connect(mongoString);

mongoose.connection.once("open",function(){

    app.models = require("./models/index.js");

    var routes = require("./routes");

    _.each(routes,function(controller,route){

        app.use(route,controller(app,route));

    });


    console.log("mongoose");
   app.listen(port,ipaddress);


});






