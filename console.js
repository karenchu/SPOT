var repl = require('repl');
var db = require('./models');

var newRepl = repl.start("karen's app > ");
newRepl.context.db = db;