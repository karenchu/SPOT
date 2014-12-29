var express = require("express"),
	bodyParser = require("body-parser"),
	db = require("./models"),
  	passport = require("passport"),
  	session = require("cookie-session"),
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

app.get("/contact", function (req, res) {
	if(req.user) {
		res.render("sites/contact", {user: req.user});
	} else {
		res.render("sites/contact", {user: false});
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
			});
			res.render("sites/results", {
					user: 		req.user, 
					locations: 	remappedResults
				});
		})

	});
});

app.post("/results/:yelp_id", function (req, res) {

	var dogsTrue 	= req.body.dogs == "true" ? true: false;
	var yelpId 		= req.params.yelp_id; 
	var referer 	= req.get("referer");

	db.dogfriendly.find({
		where: {
			yelp_id: yelpId
		}
	}).then(function (result) {
		if (result){
			result.dog_friendly = dogsTrue;
			result.save().then(function (loc) {
				res.redirect(referer);
			});
		} else {
			db.dogfriendly.create({
				yelp_id: 		yelpId,
				dog_friendly: 	dogsTrue
			}).then(function() {
				res.redirect(referer);
			});
		}
	})

})

app.listen(process.env.PORT || 3000, function() {
	console.log(new Array("*").join());
	console.log("STARTED ON localhost:3000");
});