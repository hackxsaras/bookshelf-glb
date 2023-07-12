const express = require("express");

const mongoose = require('mongoose');
const { bookSchema } = require('../models/book');

const Book = mongoose.model("Book", bookSchema)

const router = express.Router();


const add = (req, res) => {
    let newBook = new Book(req.body);
    renderResponse(req, res, newBook.save())
        .catch (e => responseFromError(e, res));
}

const getAll = async (req, res) => {

    renderResponse(req, res, Book.find({}))
        .catch(e => responseFromError(e, res));
}

const getByID = async (req, res) => {

    renderResponse(req, res, Book.findOne({ accID: req.params.accID }))
        .catch(e => responseFromError(e, res));
}

const updateByID = async (req, res) => {
    // console.log("update", req.body, req.params.accID);
    renderResponse(req, res, Book.findOneAndUpdate({ accID: req.params.accID }, req.body, { new: true }))
        .catch(e => responseFromError(e, res));
}

const deleteByID = async (req, res) => {
    renderResponse(req, res, Book.findOneAndRemove({ accID: req.params.accID }))
        .catch(e => responseFromError(e, res));
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
    res.status(500).send("Error: " + error.message);
}
async function renderResponse(req, res, query) {
    let obj;
    if ((req.query.render || (req.query.populate !== "false")) && query.populate)
        obj = await query.populate(["description", "shelf"]);
    else
        obj = await query;

    if (req.query.render) {
        if (!Array.isArray(obj)) obj = [obj];
        return res.render("models/book.ejs", { books: obj, loggedIn: req.session.loggedIn });
    }
    res.json(obj);
}
router.get('/getAll/a', getAll);
router.post('/add/a', add);
router.post('/update/:accID/a', updateByID);
router.get('/delete/:accID/a', deleteByID);
router.get('/get/:accID', getByID);

module.exports = router;