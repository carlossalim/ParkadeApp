//const passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let models = require('./models');
let bcrypt = require('bcrypt')
let flash = require('connect-flash');


const Users = models.User;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        //console.log('---PASSPORT serializeUser-----')
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        //console.log('---PASSPORT deserializeUser-----')
        Users.findOne({
            where: {
                'id': id
            }
        }).then(user => {
            if (user == null) {
                done(new Error('Wrong user email.'))
            }
            done(null, user);
        })
    });

    const validPassword = ((user, password) => {
        return bcrypt.compareSync(password, user.password);
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        return Users.findOne({
            where: {
                'email': email,
            }
        }).then(user => {
            if (user == null) {
                //console.log('null user');
                req.flash('error_msg', 'Incorrect credentials.')
                return done(null, false);
            } else if (user.password == null) {
                //console.log('null password');
                req.flash('error_msg', 'You must reset your password.')
                return done(null, false);
            } else if (!validPassword(user, password)) {
                //console.log('Incorrect password');
                req.flash('error_msg', 'Incorrect Password.')
                return done(null, false);
            }
            //console.log('ok password', user.email);
            req.flash('success_msg', 'Login Sucessful.');
            req.flash('user', user.id);
            return done(null, user);
        }).catch(err => done(err, false))

    }))
}