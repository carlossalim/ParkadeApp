var express = require('express');
var router = express.Router();
//users = require('../controllers/users');


let models = require('../models');
let bcrypt = require('bcrypt');
let passport = require('passport');
let flash = require('connect-flash');

const generateHash = (password => { return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) })

const User = models.User;
const Sequelize = require('sequelize');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('./signup', { title: 'SIGN IN' });
});


router.post('/', (req, res, next) => {
    const newUser = User.build({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        //ENCRYPT PASSWORD 
        password: generateHash(req.body.password)
    });
    return newUser.save().then(result => {
        req.flash('message', 'SingUP Sucessful.');
        passport.authenticate('local', {
            successRedirect: "/login",
            failureRedirect: "/signup",
            failureFlash: true
        })(req, res, next);
    })
});

module.exports = router;
