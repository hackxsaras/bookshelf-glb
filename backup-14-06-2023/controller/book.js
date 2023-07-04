const express = require("express");

const mongoose = require('mongoose');
const { bookSchema } = require('../models/book');

const Book = mongoose.model("Book", bookSchema)

const router = express.Router();


const add = (req, res) => {
    (async function () {
        let newBook = new Book(req.body);
        renderResponse(req, res, await newBook.save());
    })().catch(e => responseFromError(e, res));
}

const getAll = async (req, res) => {
    (async function () {
        renderResponse(req, res, await Book.find({}));
    })().catch(e => responseFromError(e, res));
}

const getByID = async (req, res) => {
    (async function () {
        renderResponse(req, res, await Book.findOne({ accID: req.params.accID }));
    })().catch(e => responseFromError(e, res));
}

const updateByID = async (req, res) => {
    (async function () {
        renderResponse(req, res, await Book.findOneAndUpdate({ accID: req.params.accID }, req.body, {new:true}));
    })().catch(e => responseFromError(e, res));
}

const deleteByID = async (req, res) => {
    (async function () {
        renderResponse(req, res, await Book.findOneAndRemove({ accID: req.params.accID }));
    })().catch(e => responseFromError(e, res));
}
const getByShelfID = async (req, res) => {
    (async function () {
        renderResponse(req, res, await Book.find({ shelf: req.params.accID }));
    })().catch(e => responseFromError(e, res));
}


function responseFromError(error, res) {
    debugg(error);
    if (error.name === "ValidationError") {
        let errors = {
            error: error.name,
            details: {}
        };

        Object.keys(error.errors).forEach((key) => {
            errors.details[key] = error.errors[key].message;
        });
        return res.status(400).json(errors);
    }
    res.status(500).send("Error: "+error.message);
}
async function renderResponse(req, res, obj) {
    if (req.query.render) {
        if(! Array.isArray(obj)) obj = [obj];
        const Shelf = await mongoose.model("Shelf");
        const shelves = await Shelf.find({});
        const shelvesNames = {};
        for(var i=0; i<shelves.length; i++){
            shelvesNames[shelves[i]._id] = shelves[i].name;
        }
        return res.render("models/book.ejs", {books:obj, shelvesNames, loggedIn: req.session.loggedIn});
    }
    res.json(obj);
}
router.get('/getAll/a', getAll);
router.post('/add/a', add);
router.post('/update/:accID/a', updateByID);
router.get('/delete/:accID/a', deleteByID);
router.get('/get/:accID', getByID);
router.get('/getByShelf/:accID', getByShelfID);

module.exports = router;