var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//testing twilio:
// var twilio = require("path/to/twilio-node/lib");
// var accountSid = 'AC979e19c8e65f77fc73379299ca570c3a';
// var authToken = "f08ee7748ebea1b6fbacc14870fb032c";
// var client = require('twilio')(accountSid, authToken);
 
// client.messages.create({
//     body: "Jenny please?! I love you <3",
//     to: "+18015406417",
//     from: "3852090079"
// }, function(err, message) {
//     process.stdout.write(message.sid);
// });

var app = express();
app.use(bodyParser.json());

app.use(session({
    secret: 'whateverIwant',
    resave: true,
    saveUninitialized: true,
    name: 'shrivelry'
    }));


mongoose.connect('mongodb://localhost/shrivelry');


var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	phoneNum: String,
	plants: [{type: ObjectId, ref: 'Plant', plantReminder: Date}]


	//plant Reminder must be handled by me when added to a user's plants [].
	//set plantReminder to current time 
});
var User = mongoose.model('User', UserSchema);


var PlantSchema = new mongoose.Schema({
	name: String,
	sunlight: String, 
	water: String,
	notes: String,
	type: Number
});
var Plant = mongoose.model('Plant', PlantSchema) //become the plants collection

//adding a user to the collection:

app.post('/signup', function(req, res){
	console.log(req.body);
	var newUser = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		phoneNum: req.body.phoneNum 
	});
	newUser.save(function(err){
		if(err){
			console.log(err);
		} else {
			res.status(200).send(newUser);
		}
	})
});
//adding a plant to the database collection
app.post('/newplant', function(req,res){
	var newPlant = new Plant({
		name: req.body.name,
		sunlight: req.body.sunlight, 
		water: req.body.water,
		notes: req.body.notes,
		type: req.body.type
	});
	newPlant.save(function(err){
		if(err){
			console.log(err);
		}
		else {
			res.status(200).send(newPlant);
		}
	})
});

//getting all users' information in order to show plants in each user's collection:

app.post('/login', function(req, res) {
	User.findOne({email: req.body.email}).populate('plants').exec(function(err, user) {
		if(err){
			res.send(err);
		} else {
			if(user.password === req.body.password){
				res.send(user);
			} else {
				res.send({error: "Error WRONG PASSWORD"});
			}
		}
	});
});

//getting all the users
app.get('/users', function(req,res) {
	User.find({}, function(err, users) {
		return res.json(users);
	});
});

//getting all the plants in database:

app.get('/plants', function(req,res) {
	Plant.find({}, function(err, plants) {
		return res.json(plants);
	});
});

//adding a plant to a user:
app.post('/users/myplants', function(req,res) {
	console.log(req.body);
	User.findOne({_id: req.body.user._id}).populate('plants').exec(function(err, user) {
		if(err) {
			console.log(user);
			res.status(404).send(err);
		}
		else{
			console.log(user);
			debugger;
			console.log("ninja");
			var dateAdded = Date.now();
			user.plants.addToSet(req.body.plant, dateAdded);
			console.log(user.plants.plantReminder);
			user.save(function(err){
				if(err){
					res.status(404).send(err);
				}
				else{
					res.send(user);
				}
				console.log(user.plants);
			});
		}

	});	

})

// var katie = new User({
// 	name: "Katie",
// 	email: "katieleechristiansen@gmail.com", 
// 	password: "passwordy",
// 	phoneNum: '8015406417'
// });

// katie.save(function(err){
// 	if(err){
// 		console.log(err)
// 	} else {
// 		console.log(katie.name + ' was added to the database');
// 	}
// });

// var spiderPlant = new Plant({
// 	name: "Spider Plant",
// 	water: "once every 7 days",
// 	type: 7
// });

// spiderPlant.save(function(err){
// 	if(err){
// 		console.log(err)
// 	}else {
		
// 		User.findOne({email: 'katieleechristiansen@gmail.com'}, function(err, user){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				user.plants.addToSet(spiderPlant);
// 				console.log(spiderPlant.name + 'was added to ' + user.name);
// 			}
// 		});
// 	}
// });


app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(function(req,res, next)	{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});


mongoose.connection.once('open', function(){
	app.listen(8002);
	console.log("We are now connected to our Db. App is listening on port 8002");

});
