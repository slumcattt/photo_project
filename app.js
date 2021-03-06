// Boo!

// Setup this module to emit events
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

// Set the testing switch
if (module.parent) {
    module.exports.testing = true;
}
else {
    module.exports.testing = false;
}

// Load in all our dependancies
var express = require('express'),
    photo = require('./routes/photo'),
    set = require('./routes/set'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    login = require('./utils/login'),
    database = require('./utils/database');

// Get the instance of express
var app = express();
// Setup the passport instance
login.setup();

module.exports.emit('setupComplete');

// Configure for all environments
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(database.middleware());
    app.use(express.favicon());
    
    if (!module.exports.testing) {
        app.use(express.logger('dev')); // Dont log when testing
    }

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());

    if (module.exports.testing) {
        app.use(login.fakeUserLogin());
    }

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// Configure if we're in development
app.configure('development', function(){
    app.use(express.errorHandler());
});

// Setup the routes
// User login
app.post('/login', login.postLoginRoute, function(req, res) {
    res.json(req.user);
});
app.get('/logout', login.logoutRoute);
// Photos
app.get('/photo', photo.list);
app.post('/photo', photo.create);
app.get('/photo/:id', photo.single);
app.put('/photo/:id', photo.update);
app.post('/photo/:id', photo.update);
app.del('/photo/:id', photo.del);
// Sets
app.get('/set', set.list);
app.post('/set', set.create);
app.get('/set/:id', set.single);
app.put('/set/:id', set.update);
app.post('/set/:id', set.update);
app.del('/set/:id', set.del);
app.post('/set/:id/share', set.share);
// Users
app.get('/user', user.list);
app.get('/user/current', user.getCurrentUser);
app.post('/user/register', user.register);
if (module.exports.testing) {
    // Test filestore route
    var knoxMock = require('./test/fixtures/knoxMock');
    app.get('/fileTest/:path', knoxMock.testRoute);
}

// Start the server
// This also doubles as the export which is used for the test framework
var server = module.exports.server = http.createServer(app);

// Check which mode we're in
if (!module.exports.testing) {
    // Only start listening if we aren't being tested
    server.listen(3000, function() {
        console.log("Express server started at http://0.0.0.0:" + app.get('port'));
    });
}
