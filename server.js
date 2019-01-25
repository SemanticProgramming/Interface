'use strict';

//Module dependencies.
var express             = require('express')
    ,   path            = require('path')
    ,   favicon         = require('serve-favicon')
    ,   cookieParser    = require('cookie-parser')
    ,   bodyParser      = require('body-parser')
    ,   mongoose        = require('mongoose')
    ,   passport        = require('passport')
    ,   localStrategy   = require('passport-local').Strategy
    ,   morgan          = require('morgan')
    ,   session         = require('express-session')
    ,   methodOverride  = require('method-override')
    ,   errorHandler    = require('errorhandler')
    ,   routes          = require('./server/routes/index')
    ,   api             = require('./server/routes/api')
    ;

// express server configuration ===============================================================
var app = express();
// all environments
app.set('port', process.env.PORT || 9988);

//for using HTML as our view technology
app.engine('html', require('ejs').renderFile);

// view engine setup (html instead of jade)
app.set('view engine', 'html');
app.set('view options', {
    layout: false
});
app.set('views', path.join(__dirname, '/views'));

// favicon in /public
app.use(favicon(__dirname + '/public/img/favicon.ico'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose configuration ===============================================================
mongoose.connect('mongodb://localhost/mdb-prototyp');

// required for passport
app.use(session({
    secret: 'secret emorphology term', // session secret
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: false }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(methodOverride());

// serve public data/libs for website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/views/templates'));

// configuration ======================================================================
app.use(express.static(path.join(__dirname, 'app')));
app.set('views', __dirname + '/views');

// routes ======================================================================
app.use('/', routes);
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.use('/user/', api);

// user schema/model
var User = require('./server/models/user.js');
// configure passport


// CHANGE: USE "createStrategy" INSTEAD OF "authenticate" => passport.use(new localStrategy(User.authenticate()));
//Starting with version 0.2.1 passport-local-mongoose adds a helper method createStrategy as static method to your schema.
//The reason for this functionality is that when using the usernameField option to specify an alternative usernameField name,
//for example "email" passport-local would still expect your frontend login form to contain an input field with name "username"
//instead of email. This can be configured for passport-local but this is double the work. So we got this shortcut implemented.
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*
// error handlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.end(JSON.stringify({
        message: err.message,
        error: {}
    }));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/


// error handlers

/*
// production error handler (no stacktraces leaked to user)
 app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
         message: err.message,
         error: {}
     });
 });
*/


// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

/*
// development error handler (will print stacktrace)
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
*/


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

module.exports = app;

// Start server
app.listen(app.get('port'), function(){
    console.log("Express server listening on http://127.0.0.1:%d in %s mode", app.get('port'), app.get('env'));
});

console.log(app.get('port'));
console.log(app.get('env'));