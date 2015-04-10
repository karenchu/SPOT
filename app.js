var express = require("express"),
	bcrypt = require("bcrypt"),
	bodyParser = require("body-parser"),
	db = require("./models"),
  	passport = require("passport"),
  	session = require("cookie-session"),
  	cheerio = require("cheerio"),
  	ejs = require("ejs"),
  	expressValidator=require("express-validator"),
  	pgHstore = require("pg-hstore"),
  	Sequelize = require("sequelize"),
  	async = require("async"),
	app = express();


var yelp = require("yelp").createClient({
	consumer_key: 		"sOwjvBvlFOMkyq9NDg7UTg", 
	consumer_secret: 	"K0y_tyBqJ5V1r2E0q5qRMjQlD2A",
	token: 				"PFMuuMjh-dpokUZXQaGBNOMZnazCNlDR",
	token_secret: 		"9P5iP9mk_cAALC8qttySRp6ulRg"
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//authorization
app.use(session( {
	secret: 'thisismysecretkey',
	name: 'chocolate chip',
	maxage: 3600000
})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	console.log("Working!");

	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log("Deserializing!");
	db.user.find({
		where: {
			id: id
		}
	})
	.then(function(user){
		done(null, user);
	},
	function(err) {
		done(err, null);
	});
});

app.get("/signup", function(req, res) {
	res.render("users/signup")
});

app.post("/users", function (req, res) {
	console.log("POST /users");
	var newUser = req.body.user;
	console.log("New User:", newUser);
	db.user.createSecure(newUser.email, newUser.password, newUser.firstName, newUser.lastName,
		function () {
			res.redirect("/signup");
		},
		function (err, user) {
			req.login(user, function(){
				console.log("Id: ", user.id)
				res.redirect('/users/' + user.id);
			});
		})
});

app.get("/users/:id", function (req, res) {
	var id = req.params.id;
	db.user.find(id)
		.then(function (user) {
			res.render("users/show",{user: user});
		})
		.error(function () {
			res.redirect("/signup");
		})
});

app.get("/login", function (req, res) {
	res.render("users/login");
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get("/", function (req, res) {
	console.log(req.user)

	if(req.user) {
		res.render("sites/home", {user: req.user});
	} else {
		res.render("sites/home", {user: false});
	}
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

// our root route
app.get("/", function (req, res) {
	res.render("sites/home");	
});

app.get("/about", function (req, res) {
	if(req.user) {
		res.render("sites/about", {user: req.user});
	} else {
		res.render("sites/about", {user: false});
	}
});


app.get("/howto", function (req, res) {
	if(req.user) {
		res.render("sites/howto", {user: req.user});
	} else {
		res.render("sites/howto", {user: false});
	}
});

app.get("/results", function (req, res) {

	var loc = req.query.location || "san francisco";
	yelp.search({term: req.query.business, location: loc}, function(error, data) {
		console.log("THE DATA", JSON.stringify(data.businesses[0]));
		var remappedResults = {}
		var businessIds = data.businesses.map(function (loc) {
			remappedResults[loc.id] = loc;
			return loc.id;
		});
		db.dogfriendly.findAll({
			where: {
				yelp_id: businessIds
			}
		}).then(function (results) {
			results.map(function (result) {
				console.log(result.dog_friendly)
				remappedResults[result.yelp_id].friendly = result.dog_friendly;
			}),

			// async.each(results, function (result, done) {
			// 	console.log("meep")
			// 	db.Amenity.find({
			// 		where: {
			// 			yelp_id: result.yelp_id
			// 		}
			// 	}).then(function (amenity) {
			// 	console.log("MEEP!");
			// 		remappedResults[result.yelp_id].treat = amenity.treat;
			// 		remappedResults[result.yelp_id].water = amenity.water;
			// 		remappedResults[result.yelp_id].bed = amenity.bed;
			// 		remappedResults[result.yelp_id].cut = amenity.cut;
			// 		remappedResults[result.yelp_id].bath = amenity.bath;
			// 	}),


			// async.each(results, function (result, done){
			// 	console.log("find")
			// 	db.Rating.find({
			// 		where: {
			// 			yelp_id: result.yelp_id
			// 		}
			// 	}).then(function (rating) {
			// 	console.log("FINISHED SEARCHING!!!!");
			// 		remappedResults[result.yelp_id].ratingObj = rating ? rating.dataValues: null;
			// 		done();
			// 	}),
			// 	function () {
			// 	console.log("RENDERING", remappedResults);
					res.render("sites/results", {
							user: 		req.user, 
							locations: 	remappedResults
					});
				// }
			})
			// })
		// })

	});
});

app.post("/results/:yelp_id", function (req, res) {

	var dogsTrue 	= req.body.dogs == "true" ? true: false;
	// var treatsTrue  = req.body.treats == "true" ? true: false;
	// var waterTrue   = req.body.water == "true" ? true: false;
	// var bedsTrue    = req.body.beds == "true" ? true: false;
	// var cutsTrue    = req.body.cuts == "true" ? true: false;
	// var bathsTrue   = req.body.baths == "true" ? true: false;

	// var rating 		= Math.floor(req.body.rating);
	var yelpId 		= req.params.yelp_id; 
	var referer 	= req.get("referer");

	// console.log("RATING IS:", rating)

	db.dogfriendly.find({
		where: {
			yelp_id: yelpId
		}
	}).then(function (result) {
		// db.Amenity.find({
		// 	where: {
		// 		yelp_id: yelpId
		// 	}
		// });
s
		if (result){
			result.dog_friendly = dogsTrue;
			// result.treat = treatsTrue;
			// result.water = waterTrue;
			// result.bed = bedsTrue;
			// result.cut = cutsTrue;
			// result.bath = bathsTrue;
			result.save().then(function (loc) {
				res.redirect(referer);
			});
		} else {
			db.dogfriendly.create({
				yelp_id: 		yelpId,
				dog_friendly: 	dogsTrue
			// });
			// db.Amenity.create({
			// 	yelp_id: yelpId,
			// 	treat: treatsTrue,
			// 	water: waterTrue,
			// 	bed: bedsTrue,
			// 	cut: cutsTrue,
			// 	bath: bathsTrue
			}).then(function() {
				res.redirect(referer);
			});
		}
	})

	// db.Amenity.find({
	// 		where: {
	// 			yelp_id: yelpId
	// 		}
	// }).then(function (result) {
	// 	if (result){
	// 		result.treat = treatsTrue;
	// 		result.water = waterTrue;
	// 		result.bed = bedsTrue;
	// 		result.cut = cutsTrue;
	// 		result.bath = bathsTrue;
	// 		result.save().then(function (loc) {
	// 			res.redirect(referer);
	// 		});
	// 	} else {
	// 		db.Amenity.create({
	// 			yelp_id: yelpId,
	// 			treat: treatsTrue,
	// 			water: waterTrue,
	// 			bed: bedsTrue,
	// 			cut: cutsTrue,
	// 			bath: bathsTrue
	// 		}).then(function() {
	// 			res.redirect(referer);
	// 		});
	// 	}
	// })

})


app.listen(process.env.PORT || 3000, function() {
	console.log(new Array("*").join());
	console.log("STARTED ON localhost:3000");
});