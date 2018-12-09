const router = require('express').Router();
//const passport = require('passport');

router.get('/', (req, res) => {
    res.render('index');
});

function authRequired(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/home', authRequired, (req, res) => {
    console.log('user: ', req.user);
    res.render('home', {
        username: req.user.username
    });
});

module.exports = router;