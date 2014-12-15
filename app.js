var express = require("express"),
	bodyParser = require("body-parser"),
	app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// our root route
app.get("/", function (req, res) {
	res.send("Herro");
});

app.listen(3000, function() {
	console.log(new Array("*").join());
	console.log("STARTED ON localhost:3000");
})