let express = require('express');
let router = express.Router();

const Sequelize = require('sequelize');
const models = require('../models');
const Unit = models.Unit;
const Parkade = models.Parkade;
// const User = models.User;
const user = require('../controllers/users');

/*  TABLE UNITS
    ownerName: DataTypes.STRING,
    unit: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    spots: DataTypes.INTEGER     */

exports.showAll = function (req, res, next) {
    return Unit.findAll()
        .then(units => {
            res.render(
                'unit'
                , {
                    title: 'Condominium Units', user: req.user, isDetail: false, flash: { message: req.flash('message') }, units: units
                })
        })
        .catch(err => console.log(err))
}

exports.showItem = function (req, res, next) {
    return Unit.findAll({ where: { id: req.params.id } })
        .then(units => {
            Parkade.findAll()
                .then(parkades => {
                    // for (unit in units) {
                    //     console.log('unit.ParkedID', unit.parkadeid, unit.id)
                    // }
                    //console.log(units)
                    res.render('unit', {
                        title: 'Unit Details', parkades: parkades, user: req.user, isDetail: true, units: units, flash: { message: req.flash('message') }
                    })
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

exports.addItem = function (req, res, next) {
    const ownerName = req.body.ownerName;
    const parkadeid = req.body.parkadeid;
    const email = req.body.email;
    const unit = req.body.unit;
    const owner_username = req.body.owner_username;
    const owner_password = req.body.owner_password;
    const spots = req.body.spots;
    return Unit.create({ parkadeid: parkadeid, ownerName: ownerName, email: email, unit: unit, username: owner_username, password: owner_password, spots: spots })
        .then(unit => {
            user.signup(req, res, next)
            res.redirect('/unit/' + unit.id)

        })
        .catch(err => console.log(err))
}
exports.updateItem = function (req, res, next) {
    const id = req.params.id;
    const parkadeid = req.body.parkadeid;
    const ownerName = req.body.ownerName;
    const email = req.body.email;
    const unit = req.body.unit;
    const owner_username = req.body.owner_username;
    const owner_password = req.body.owner_password;
    const spots = req.body.spots;
    return Unit.update({
        parkadeid: parkadeid,
        ownerName: ownerName,
        email: email,
        unit: unit,
        username: owner_username,
        password: owner_password,
        spots: spots,
    },
        {
            where: { id: id }
        })
        .then(unit => res.redirect('/unit/listall'))
        .catch(err => console.log(err))
}

exports.deleteItem = function (req, res, next) {
    const id = req.params.id;
    return Unit.destroy({ where: { id: id } })
        .then(unit => res.redirect('/unit/listall'))
        .catch(err => console.log(err))
}

exports.delete_json = function (req, res, next) {
    return models.Unit
        .destroy({
            where: { id: req.params.id }
        })
        .then(results => {
            res.send({ msg: "JSON Success " });
        });
}

