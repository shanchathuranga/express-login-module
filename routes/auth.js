const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
    const flashMessages = res.locals.getMessages();
    console.log(flashMessages);

    if (flashMessages.error) {
        res.render('login', {
            showErrors: true,
            errors: flashMessages.error
        });
    } else {
        res.render('login');
    }
});

/*router.post('/login', (req, res) => {
    console.log('body: ', req.body);
    User.authenticate(req.body.username, req.body.password, (err, user) => {
        if (err || user === false) {
            console.log('Login err', err);
            res.redirect('/login');
        } else {
            res.redirect('/home');
        }
    });
});*/
router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    const flashMessages = res.locals.getMessages();
    console.log(flashMessages);

    if (flashMessages.error) {
        res.render('register', {
            showErrors: true,
            errors: flashMessages.error
        });
    } else {
        res.render('register');
    }
});

router.post('/register', (req, res, next) => {
    console.log('body: ', req.body);

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    req.getValidationResult()
        .then(function(result) {
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    req.flash('error', error.msg);
                });
                res.redirect('/register');
            } else {
                const user = new User({
                    username: req.body.username, 
                    password: req.body.password
                });
                user.save((err) => {
                    if (err) {
                        console.log('User cannot be saved: ', err);
                        if (err.code === 11000) {
                            req.flash('error', 'Username already exists');
                        } else {
                            req.flash('error', 'Something wrong with the database');
                        }
                        res.redirect('/register');            
                    } else {
                        next();
                    }
                });
            }
        });
    
}, passport.authenticate('local', {
    successRedirect: '/home'
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;