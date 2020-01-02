let models = require('../models');
let bcrypt = require('bcrypt');
const passport = require('passport');
let flash = require('connect-flash');

const User = models.User;
const Sequelize = require('sequelize');


exports.show_login = function (req, res, next) {
    res.render('users/login', { formData: {}, errors: {} });
}

exports.show_signup = function (req, res, next) {
    res.render('users/signup', { formData: {}, errors: {} });
}

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
}

exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}

const generateHash = (password => { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) })

exports.signup = function (req, res, next) {
    const newUser = User.build({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        //ENCRYPT PASSWORD from:   Signup.pug    or      unit.pug
        password: generateHash(req.body.password || req.body.owner_password)
    });
    console.log("USER -> ", newUser.firstName);
    return newUser.save().then(result => {
        req.flash('message', 'SingUP Sucessful.>');
        passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "/signup",
            failureFlash: true
        })(req, res, next);
    })
}