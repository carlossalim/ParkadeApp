let express = require('express');
let router = express.Router();
let moment = require('moment');
const { check, validationResult } = require('express-validator');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../config/database');
const models = require('../models');
const Parkade = models.Parkade;
const Visitor = models.Visitor;
const Unit = models.Unit;

users = require('../controllers/users');
parkades = require('../controllers/parkades');
units = require('../controllers/units');
visitor = require('../controllers/visitor');

function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Please log in first in the app');
    res.redirect('/login');
  }
}

/////PARKADE ROUTES//////
router.get('/parkade/listall', ensureAuthentication, parkades.showAll);
router.get('/parkade/:id', ensureAuthentication, parkades.showItem);
router.get('/parkade', ensureAuthentication, (req, res, next) =>
  res.render('./parkade', { title: 'New Parkade', parkades: null, user: req.user })
)
router.get('/parkade/del/:id', ensureAuthentication, parkades.deleteItem);
router.post('/parkade/delete-json/:id', ensureAuthentication, parkades.delete_json);
router.post('/parkade/add/', ensureAuthentication, parkades.addItem);
router.post('/parkade/update/:id', ensureAuthentication, parkades.updateItem);
/////PARKADE ROUTES//////


//////UNITS ROUTES/////////
router.get('/unit/listall', ensureAuthentication, units.showAll);
router.get('/unit/:id', ensureAuthentication, units.showItem);
router.get('/unit', ensureAuthentication, (req, res, next) => {
  Parkade.findAll()
    .then(parkades => res.render('./unit', { title: 'New Unit', units: null, user: req.user, parkades: parkades }))
    .catch(err => console.log(err))
})
router.get('/unit/del/:id', ensureAuthentication, units.deleteItem);
router.post('/unit/delete-json/:id', ensureAuthentication, units.delete_json);
router.post('/unit/add/', ensureAuthentication,
  //VALIDATING INPUTS SERVER SIDE
  [check('ownerName', 'Owner should be at lest 3 characters long.').isLength({ min: 3 }),
  check('owner_username', 'Username should be at lest 4 characters long.').isLength({ min: 4 }),
  check('owner_password', 'Password should be at lest 4 characters long.').isLength({ min: 4 }),
  check('unit', 'Unit should not be empty').notEmpty(),
  check('email', 'Email is not valid.').isEmail().normalizeEmail(),
  check('spots', 'Number of parking spots is not an Integer.').isInt()],
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render('./unit', {
        title: 'New Unit', units: null, errors: result.errors,
        ownerName: req.body.ownerName,
        owner_username: req.body.owner_username,
        owner_password: req.body.owner_password,
        unit: req.body.unit,
        email: req.body.email,
        spots: req.body.spots,
        user: req.user
      })
    }
    units.addItem(req, res, next)
    req.flash('success_msg', 'Unit added sucessfully.')
  });
router.post('/unit/update/:id', ensureAuthentication,
  //VALIDATING INPUTS SERVER SIDE
  [check('ownerName', 'Owner should be at lest 3 characters long.').isLength({ min: 3 }),
  check('owner_username', 'Username should be at lest 4 characters long.').isLength({ min: 4 }),
  check('owner_password', 'Password should be at lest 4 characters long.').isLength({ min: 4 }),
  check('unit', 'Unit should not be empty').notEmpty(),
  check('email', 'Email is not valid.').isEmail().normalizeEmail(),
  check('spots', 'Number of parking spots is not an Integer.').isInt()],
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      for (let key in result.errors) {
        error = result.errors[key]
        req.flash('error_msg', error.msg)
      }
      myunits = [{
        id: req.params.id,
        ownerName: req.body.ownerName,
        owner_username: req.body.owner_username,
        owner_password: req.body.owner_password,
        unit: req.body.unit,
        email: req.body.email,
        spots: req.body.spots
      }]
      return res.redirect('/unit/' + req.params.id)
    }
    units.updateItem(req, res, next)
    req.flash('success_msg', 'Unit updated sucessfully.')
  }
);
//////UNITS ROUTES/////////


////// VISITOR VEHICLE ROUTES/////////
function isVisitorSpotAvailable(req, res, next) {
  const email = req.user.email
  const dateLimit = moment().add(-1, 'days').toDate();
  Unit.findAll({
    where: { email: email },
    include: [{
      model: Visitor,
      where: { createdAt: { [Op.gte]: dateLimit } },
      order: [['createdAt', 'DESC']],
      required: false
    }],

  })
    .then(unit => {
      //COMPARE THE UNit's # of Spots vs Used Spots   
      if (unit[0].spots > unit[0].Visitors.length) {
        return next();
      } else {
        console.log('This unit has no visitor spot available');
        req.flash('error_msg', 'This unit has no visitor spot available. Please free one spot.');
        res.redirect('/visitor');
      }
    })
    .catch(err => console.log(err))
}
router.get('/visitor', ensureAuthentication, visitor.showAll);
router.get('/visitor/delete/:id', ensureAuthentication, visitor.deleteItem);
router.post('/visitor', ensureAuthentication, isVisitorSpotAvailable,
  [check('plate', 'Plate number should be at least 6 characther long.').isLength({ min: 6 })],
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      for (let key in result.errors) {
        error = result.errors[key]
        req.flash('error_msg', error.msg)
      }
      return res.redirect('/visitor');
    }
    visitor.addItem(req, res, next)
  }
);
////// VISITOR VEHICLE ROUTES/////////


///// CHECK PLATE ROUTES //////////////////
router.get('/checkplate', ensureAuthentication, function (req, res, next) {
  Parkade.findAll()
    .then(parkades => res.render('./checkplate', { title: 'Checkplate', user: req.user, parkades: parkades, visitors: null }))
    .catch(err => console.log(err))
});
router.post(  '/checkplate', ensureAuthentication, visitor.findPlate)
///// CHECK PLATE ROUTES //////////////////


router.get('/', ensureAuthentication, function (req, res, next) {
  res.render('./index', { title: 'Home', user: req.user });
});

router.get('/logout', function (req, res, next) {
  req.logout();
  req.flash('success_msg', 'User logged out.')
  res.redirect('/login');
});

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.send('respond with a resource! INDEX - Login');
});

router.post('/signup', (req, res, next) => {
  //console.log("POST SIGNUP")
  users.signup
});

module.exports = router;
