let express = require('express');
let router = express.Router();

const Sequelize = require('sequelize');
const models = require('../models');
const Parkade = models.Parkade;

exports.showAll = function (req, res, next) {
    return Parkade.findAll()
        .then(parkades => {
            res.render(
                'parkade'
                , {
                    title: 'Parkade', user: req.user, isDetail: false, flash: { message: req.flash('message') }, parkades: parkades
                })
        })
        .catch(err => console.log(err))
}

exports.showItem = function (req, res, next) {
    return Parkade.findAll({ where: { id: req.params.id } })
        .then(parkades => {
            res.render(
                'parkade'
                , {
                    title: 'Parkade Details', user: req.user, isDetail: true, flash: { message: req.flash('message') }, parkades: parkades
                })
        })
        .catch(err => console.log(err))
}

exports.addItem = function (req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const description = req.body.description;
    return Parkade.create({ name: name, email: email, description: description })
        .then(parkade => res.redirect('/parkade/' + parkade.id))
        .catch(err => console.log(err))
}
exports.updateItem = function (req, res, next) {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const description = req.body.description;
    return Parkade.update({
        name: name,
        email: email,
        description: description
    },
        {
            where: { id: id }
        })
        .then(parkade => res.redirect('/parkade/listall'))
        .catch(err => console.log(err))
}

exports.deleteItem = function (req, res, next) {
    const id = req.params.id;
    return Parkade.destroy({ where: { id: id } })
        .then(parkade => res.redirect('/parkade/listall'))
        .catch(err => {
            console.log(err)
            req.flash('error_msg', 'Sorry item can not be DELETED!  ');
            res.redirect('/parkade/listall');
        })
}

exports.delete_json = function (req, res, next) {
    const id = req.params.id;
    return models.Parkade
        .destroy({ where: { id: id } })
        .then(results => {
            res.send({ msg: "JSON Success " });
        })
        .catch(err => {
            console.log(err)
            req.flash('error_msg', 'Sorry item can not be DELETED!  ');
            res.redirect('/parkade/listall');
        })
}


