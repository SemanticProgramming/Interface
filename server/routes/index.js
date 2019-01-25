var express = require('express'),
    router = express.Router();

router.index = function (req, res) {
    res.render('index', {user: req.user});
};

router.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name, {user: req.user});
};

router.ping = function (req, res) {
    res.send("pong!", 200);
};

module.exports = router;
