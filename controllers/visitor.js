let express = require('express');
let router = express.Router();
let moment = require('moment');

const Sequelize = require('sequelize');

const models = require('../models');
const Visitor = models.Visitor;
const Parkade = models.Parkade;
const Unit = models.Unit;

exports.showAll = function (req, res, next) {
    const email = req.user.email;

    return Visitor.findAll({
        include: [{
            model: Unit,
            where: { email: email }
        }],
        order: [['createdAt', 'DESC']],
    })
        .then(
            visitors => {
                Parkade.findAll({
                    include: [{
                        model: Unit,
                        where: { email: email }
                    }],
                })
                    .then(parkades => {
                        res.render('./visitor', { title: 'New Visitor Vehicle', user: req.user, parkades: parkades, visitors: visitors })
                    })
                    .catch(err => console.log(err))
            })
        .catch(err => console.log(err))
}

function showAllOldVisits(req, res, next) {
    const email = req.user.email
    return Visitor.findAll({
        include: [{
            model: Unit,
            where: { email: email },
        }],
        order: [['createdAt', 'DESC']],
    })
        .then(
            visitors => {
                return visitors
            }
        )
        .catch(err => console.log(err))
}

exports.addItem = function (req, res, next) {
    const parkadeid = req.body.parkadeid;
    const unitid = req.body.unitid;
    const plate = req.body.plate.toUpperCase();
    return Visitor.create({ plate: plate, parkadeid: parkadeid, unitid: unitid })
        .then(visitor => {
            req.flash('success_msg', 'Plate number registred as visitor  ');
            res.redirect('/visitor')
        })
        .catch(err => console.log(err))
}

exports.deleteItem = function (req, res, next) {
    const id = req.params.id;
    return Visitor.destroy({ where: { id: id } })
        .then(Visitor => {
            req.flash('success_msg', 'Plate number deleted! You have freed one spot.  ');
            res.redirect('/visitor')
        })
        .catch(err => {
            console.log(err)
            req.flash('error_msg', 'Sorry item can not be DELETED!  ');
            res.redirect('/visitor');
        })
}

//Find the history of a PLate for a certain Parkade
//We  will use the information to check the Plate Status(OK or it will get a ticket)
exports.findPlate = function (req, res, next) {
    const email = req.user.email;
    const plate = req.body.plate;
    const parkadeid = req.body.parkadeid;
    return Visitor.findAll({
        where: {
            plate: plate,
            parkadeid: parkadeid,
        },
        include: [{
            model: Unit,
        }],
        order: [['createdAt', 'DESC']],
    })
        .then(
            visitors => {
                console.log(visitors)
                Parkade.findAll()
                    .then(parkades => res.render('./checkplate', { title: 'Checkplate', user: req.user, parkadeid: parkadeid, parkades: parkades, visitors: visitors }))
                    .catch(err => console.log(err))
            })
        // res.render('./checkplate', { title: 'Checkplate', user: req.user, parkadeid: parkadeid, parkades: parkades, visitors: visitors })

        // })
        .catch(err => console.log(err))
}

