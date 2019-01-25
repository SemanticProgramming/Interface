/*
 * Serve JSON to our AngularJS client
 */

var express = require('express'),
    router = express.Router(),
    passport = require('passport');
User = require('../models/user.js');

// return mdb ids in use
router.get('/mdbueids', function (req, res) {
    User.distinct("mdbueid", function (err, mdbueids) { // User.distinct("mdbueid").toArray(function(err, mdbueids) {
        if (err) {
            //alert("index router" + err);
            throw err;
        } else {
            res.status(200).json({mdbueids: mdbueids});
        }
    })
});

// check, if an mdbueid is already in use (mdbueid_unique false)
router.post('/checkmdbueid', function (req, res) {
    User.findOne({mdbueid: req.body.mdbueid}, function (err, usr) {
        if (usr) {
            return res.status(500).json({mdbueid_unique: false, status: 'mdbueid already in use.'})
        }
        else {
            return res.status(200).json({mdbueid_unique: true, status: 'mdbueid not in use yet.'})
        }
    });
});

// get connection sid
router.get('/getconnectsid', function (req, res, next) {
    res.status(200).json({
        status: 'Successful!',
        req: req.session,
        connectSID: req.cookies['connect.sid'],
        sessionID: req.sessionID,
        sessionInfo: req.cookies
    });
});


//getUserByUEIDFromDB -
//data - {
//    "mdbuser":true,
//    "mdbusername":"kermit@muppets.com",
//    "mdbueid":"3be4a4cd",
//    "mdbueiduri":{"_id":"57a1e15e9e09e0b62cdb80c6","username":"kermit@muppets.com","mdbueid":"3be4a4cd","__v":0,"mdbueiduri":"http://www.morphdbase.de/resource/3be4a4cd"},
//    "status":"User found."}
//
//
//getUserInfoByUEIDFromDB -
//data - {
//    "user":{"_id":"57a1e15e9e09e0b62cdb80c6","username":"kermit@muppets.com","mdbueid":"3be4a4cd","__v":0,"mdbueiduri":"http://www.morphdbase.de/resource/3be4a4cd"},
//    "mdbusername":"kermit@muppets.com",
//    "v":0,
//    "status":"User found."}


// TODO: test http post, because it fails to deliver mdbueiduri separately
// check, if an mdbueid is already in use (mdbueid_unique false)
router.post('/getuserinfobyueid', function (req, res) {
    User.findOne({mdbueid: req.body.mdbueid}, function (err, usr) {
        if (usr) {
            return res.status(200).json({
                user: usr,
                mdbusername: usr.username,
                mdbueiduri: usr.mdbueiduri,
                v: usr.__v,
                status: 'User found.'
            })
        }
        else {
            return res.status(500).json({mdbuser: false, status: 'No user found.'})
        }
    });
});

// check, if an mdbueid is already in use (mdbueid_unique false)
router.post('/getuserbyueid', function (req, res) {
    User.findOne({mdbueid: req.body.mdbueid}, function (err, usr) {
        if (usr) {
            return res.status(200).json({
                mdbuser: true,
                mdbusername: usr.username,
                mdbueid: usr.mdbueid,
                mdbueiduri: usr,
                status: 'User found.'
            })
        }
        else {
            return res.status(500).json({mdbuser: false, status: 'No user found.'})
        }
    });
});

// get user info by username
router.post('/getuserbyusername', function (req, res) {
    User.findOne({username: req.body.username}, function (err, usr) {
        if (usr) {
            return res.status(200).json({
                mdbuser: true,
                mdbusername: usr.username,
                mdbueid: usr.mdbueid,
                mdbueiduri: usr,
                status: 'User found.'
            })
        }
        else {
            return res.status(500).json({mdbuser: false, status: 'No user found.'})
        }
    });
});

// remove user by mdbueid
router.post('/removeuserbyueid', function (req, res) {
    User.findOneAndRemove({mdbueid: req.body.mdbueid}, function (err, usr) {
            if (usr) {
                return res.status(200).json({
                    removed: true,
                    mdbusername: usr.username,
                    mdbueid: usr.mdbueid,
                    status: 'User removed.'
                })
            }
            else {
                return res.status(500).json({removed: false, status: 'No user found.'})
            }
        }
    );
});

// remove user by username
router.post('/removeuserbyusername', function (req, res) {
    User.findOneAndRemove({username: req.body.username}, function (err, usr) {
            if (usr) {
                return res.status(200).json({
                    removed: true,
                    mdbusername: usr.username,
                    mdbueid: usr.mdbueid,
                    status: 'User removed.'
                })
            }
            else {
                return res.status(500).json({removed: false, status: 'No user found.'})
            }
        }
    );
});

// register user with email, mdbueid and password
router.post('/register', function (req, res) {
    User.register(new User({
        username: req.body.username,
        mdbueid: req.body.mdbueid
    }), req.body.password, function (err, user) {
        if (err) {
            return res.status(500).json({
                err: err,
                user: user
            })
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
                status: 'Registration successful!',
                username: req.user.username,
                usermdbueid: req.user.mdbueid,
                connectSID: req.cookies['connect.sid'],
                sessionID: req.sessionID
            })
        });
    });
});

// authenticate user with email and password
router.post('/authenticate', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({err: info})
        }
        req.logIn(user, function (err) {
            if (err) {
                return res.status(500).json({err: 'Could not authenticate user'})
            }
            //res.cookie('userid', user.id); //, { maxAge: 2592000000 });  // Expires in one month
            //res.cookie('username', user.username); //, { maxAge: 2592000000 });  // Expires in one month
            // TODO: workaround, um datenbank nicht vollzumüllen
            //res.cookie('connect.sid', 's:42-HALLOHIERALARMEINS1ELF-TTESTT.SANDRASGANZPERSOENLICHEMDBPROTOTYPSESSIONID');
            res.status(200).json({
                status: 'Authentication successful!',
                user: user,
                username: user.username,
                userID: user._id,
                usermdbueid: req.user.mdbueid,
                connectSID: req.cookies['connect.sid'],
                sessionID: req.sessionID
            })
        });
    })(req, res, next);
});

// log out user
router.get('/logout', function (req, res) {
    req.logout();
    //res.clearCookie('userid');
    //res.clearCookie('username');
    res.status(200).json({status: 'Bye!'})
});

module.exports = router;

