var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var textbelt = require('textbelt');

app.use(session({
    secret: 'whateverIwant',
    resave: true,
    saveUninitialized: true,
    name: 'shrivelry'
    }));


mongoose.connect('mongodb://localhost/shrivelry');


var ObjectId = mongoose.Schema.Types.ObjectId;

var UserPlantSchema = new mongoose.Schema({
	nickname: String,
	plant_id: {type: ObjectId, ref: 'Plant'},
	date_created: {type: Date, default: Date.now()}
});

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	phoneNum: String,
	plants: [UserPlantSchema]
});

var UserPlant = mongoose.model('UserPlant', UserPlantSchema);

//adding a plant to a user:
app.post('/users/myplants', function(req,res) {
	console.log(req.body);
	User.findOne({_id: req.body.user._id}).populate({ path:'plants.plant_id' }).exec(function(err, user) {
		if(err) {
			console.log(user);
			res.status(404).send(err);
		}
		else{
			var user_plant = new UserPlant();
			user_plant.nickname = req.body.nickname;
			user_plant.plant_id = req.body.plant._id;
			user_plant.date_created = Date.now();

			user.plants.push(user_plant);
			console.log(user);
			user.save(function(err) {
				if(err){
					res.status(404).send(err);
				}
				else{
					User.findById(user.id).populate('plants.plant_id').exec(function (err, user) {
						res.send(user);
					});
				}
			});
		}
	});	
});

app.get("/sendtext", function(req, res){
	var currentTime = Date.now();

	User.find({plants: {$elemMatch: {date_created: { $lt: currentTime }}}}).populate('plants.plant_id').exec(function(err, users){
		if(err)	{
			res.status(404).send(err);
		}
		else{
			users.forEach(function (user) {
				user.plants.forEach(function (plant) {

					if(plant.date_created < currentTime) {
						textbelt(user.phoneNum, 'Be sure to water your ' + plant.plant_id.name +", "+ plant.nickname + "!");
				
						var dateCheck = new Date(Date.now() + (plant.plant_id.type * 84600000));
						plant.date_created = dateCheck;

						// Save the actual updated records
						user.save(function (err) {
							console.log("I updated " + plant.nickname + "'s and texted a reminder to " + user.name);
						});
					}
				})
			})
			res.status(200).send();
		}
	})


});

var User = mongoose.model('User', UserSchema);


var PlantSchema = new mongoose.Schema({
	name: String,
	sunlight: String, 
	water: String,
	notes: String,
	type: Number
});
var Plant = mongoose.model('Plant', PlantSchema); 

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
app.delete('/deletePetPlant/:id', function(req,res){
	User.findOne({"plants": {"$elemMatch" : {"_id" : req.params.id} }}).exec(function(err,user) {
		if(err){
			console.log(err);
		}
		else{
			console.log(user);
			user.plants.id(req.params.id).remove();
			user.save(function (err){
				if (err) {
					res.send(err);
				}
				else{
					User.findById(user.id).populate('plants.plant_id').exec(function (err, user) {
						res.send(user);
					});
					console.log("your plant was removed");}
			});
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
	User.findOne({email: req.body.email}).populate('plants.plant_id').exec(function(err, user) {
		if(err){
			res.send(err);
		} 
		else {
			if(!user){
				res.send({error: "Error WRONG Email"})
			}
			 else if(user.password === req.body.password){
				res.send(user);
			}
			else {
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
