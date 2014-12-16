var express = require("express"),
	bodyParser = require("body-parser"),
	db = require("./models"),
  	passport = require("passport"),
  	session = require("cookie-session"),
	app = express();

var yelp = require("yelp").createClient({
	consumer_key: "sOwjvBvlFOMkyq9NDg7UTg", 
	consumer_secret: "K0y_tyBqJ5V1r2E0q5qRMjQlD2A",
	token: "PFMuuMjh-dpokUZXQaGBNOMZnazCNlDR",
	token_secret: "9P5iP9mk_cAALC8qttySRp6ulRg"
});


yelp.search({term: "food", location: "Montreal"}, function(error, data) {
  console.log(error);
  console.log(data);
});

yelp.business("{location}", function(error, data) {
  console.log(error);
  console.log(data);
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
	console.log("SERIALIZED JUST RAN!");

	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	console.log("DESERIALIZED JUST RAN!");
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
	db.user.createSecure(newUser.email, newUser.password,
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
			res.render("users/show", {user: user});
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

app.get("/", function (req, res) {
	var location = req.query.location;
	request('http://api.yelp.com/v2/business/{location}', function (err, response, body) {
		console.log(body);
	var results = JSON.parse(body);
	var searchResults = results.Search;
		res.render("sites/results", {location: searchResults});	
	});
});

app.listen(3000, function() {
	console.log(new Array("*").join());
	console.log("STARTED ON localhost:3000");
})