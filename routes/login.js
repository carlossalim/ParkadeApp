let express = require('express');
let router = express.Router();
const passport = require('passport');


let done;

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('./login', { title: 'LOG IN' });
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;
