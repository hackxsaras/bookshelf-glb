const express = require("express");
const mongoose = require('mongoose');
const { bookDescriptionSchema } = require('../models/bookDescription');
const Fuse = require('fuse.js');

const BookDescription = mongoose.model("BookDescription", bookDescriptionSchema);

allBooks = [];
var bookFuse = null;

const router = express.Router();
const fuseOptions = {
    includeScore: true,
    keys: [{
        name: 'keywords',
        weight: 2
    },{
        name: 'title',
        weight: 2.1
    }, {
        name: 'author',
        weight: 0.7
    }, {
        name: 'publisher',
        weight: 0.7
    }]
}
async function updateFuse() {
    let obj = await BookDescription.find({});
    for(var i =0; i < obj.length; i++) {
        let bd = obj[i];
        bd.keywords = [];
        bd.keywords.push(...bd.title.split(" "));
        bd.keywords.push(...bd.author.split(" "));
        bd.keywords.push(...bd.publisher.split(" "));
    }
    bookFuse = new Fuse(obj, fuseOptions);
}
setInterval(updateFuse, 12000);


const add = (req, res) => {
    const newBookDescription = new BookDescription(req.body);
    const promise = newBookDescription.save();
    renderResponse(req, res, promise)
        .catch(e => responseFromError(e, res));
}

const getAll = (req, res) => {
    renderResponse(req, res, BookDescription.find({}))
        .catch(e => responseFromError(e, res));
}
const getOneByFilter = (req, res) => {
    renderResponse(req, res, BookDescription.findOne(req.body))
        .catch(e => responseFromError(e, res));
}
const getByID = (req, res) => {

    renderResponse(req, res, BookDescription.findOne({ _id: req.params.accID }))
        .catch(e => responseFromError(e, res));
}

const updateByID = async (req, res) => {
    try {
        const { accID } = req.params;
        const updatedBookDescription = req.body;
        // Update the bookDescription
        await renderResponse(req, res, BookDescription.findByIdAndUpdate(
            accID,
            updatedBookDescription,
            { new: true, upsert: true}
        ));
    } catch (error) {
        responseFromError(error, res);
    }
};


const deleteByID = async (req, res) => {
    try {
        const { accID } = req.params;

        // Find the existing bookDescription
        const existingBookDescription = await BookDescription.findById(accID);
        if (!existingBookDescription) {
            return res.status(404).json({ error: "BookDescription not found" });
        }

        // Delete references from relevant tags
        await RelevantTag.model.updateMany(
            {
                _id: { $in: existingBookDescription.relevantTags },
                bookDescriptions: existingBookDescription._id,
            },
            { $pull: { bookDescriptions: existingBookDescription._id } }
        );

        // Delete the bookDescription
        await renderResponse(req, res, BookDescription.findByIdAndRemove(accID));
    } catch (error) {
        responseFromError(error, res);
    }
}

const search = (req, res) => {
    renderResponse(req, res, bookFuse.search(req.query.q, {limit:10}))
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
    console.error(error);
    res.status(500).send("Error: " + error.message);
}

async function renderResponse(req, res, query) {

    let obj;
    if ((req.query.render || (req.query.populate !== "false")) && query.populate)
        obj = await query.populate([]);
    else
        obj = await query;

    if (req.query.render) {
        if (!Array.isArray(obj)) obj = [obj];
        const Book = await mongoose.model("Book");

        for (var i = 0; i < obj.length; i++) {
            obj[i].books = await Book.find({ bookDescription: obj[i]._id }).sort({ row: 1 });
        }
        return res.render("models/bookDescription.ejs", { loggedIn: req.session.loggedIn });
    }
    res.json(obj);
}

router.get('/getAll', getAll);
router.post('/add/a', add);
router.post('/update/:accID/a', updateByID);
router.get('/delete/:accID/a', deleteByID);
router.get('/get/:accID', getByID);
router.post('/getonebyfilter', getOneByFilter);
router.get('/search', search);

module.exports = router;