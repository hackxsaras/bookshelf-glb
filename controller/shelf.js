const express = require("express");

const mongoose = require('mongoose');
const { shelfSchema } = require('../models/shelf');

const Shelf = mongoose.model("Shelf", shelfSchema)

const router = express.Router();


const add = (req, res) => {
    (async function(){
        let newShelf = new Shelf(req.body);
        renderResponse(req, res, await newShelf.save());
    })().catch(e => responseFromError(e, res));
}

const getAll = async (req, res) => {
    (async function(){
        renderResponse(req, res, await Shelf.find({}));
    })().catch(e => responseFromError(e, res));
}

const getByID = async (req, res) => {
    (async function(){
        renderResponse(req, res, await Shelf.findOne({ _id: req.params.accID }));
    })().catch(e => responseFromError(e, res));
}

const updateByID = async (req, res) => {
    (async function(){
        renderResponse(req, res, await Shelf.findOneAndUpdate({ _id: req.params.accID }, req.body, { new: true }));
    })().catch(e => responseFromError(e, res));
}

const deleteByID = async (req, res) => {
    (async function(){
        renderResponse(req, res, await Shelf.findOneAndRemove({ _id: req.params.accID }));
    })().catch(e => responseFromError(e, res));
}

function responseFromError(error, res) {
    debugg(error);
    if (error.name === "ValidationError") {
        let errors = {
            error:error.name,
            details:{}
        };

        Object.keys(error.errors).forEach((key) => {
            errors.details[key] = error.errors[key].message;
        });
        return res.status(400).json(errors);
    }
    console.error(error);
    res.status(500).send("Error: "+ error.message);
}
function renderResponse(req, res, obj) {

    if (req.query.render) {
        if(! Array.isArray(obj)) obj = [obj];
        return res.render("models/shelf.ejs", {shelves:obj, loggedIn: req.session.loggedIn});
    }
    res.json(obj);
}

router.get('/getAll', getAll);
router.post('/add/a', add);
router.post('/update/:accID/a', updateByID);
router.get('/delete/:accID/a', deleteByID);
router.get('/get/:accID', getByID);

module.exports = router;