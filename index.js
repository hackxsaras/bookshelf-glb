const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.MONGO_URL;
const BookDescription = require('./controller/bookDescription.js');
const Book = require('./controller/book.js');
const Shelf = require('./controller/shelf.js');
const bodyParser = require('body-parser');
const session = require('express-session');


const fs = require('fs');

mongoose.connect(mongoString);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});


database.once('connected', () => {
    console.log('Database Connected');
});

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.use(session({
    secret: 'glb bookshelf',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(express.static('public'));


app.use(function (req, res, next) {
    if (req.path.endsWith("/a")) {
        if(! req.session.loggedIn){
            // return res.redirect("/login");
        }
    } else if( req.method == "GET" && (! req.path.startsWith("/api")) ){ 
        let formPath = __dirname + "/views/forms" + req.path + ".ejs";
        if( fs.existsSync(formPath) ) {
            return res.render(__dirname + "/views/showform.ejs", {formPath, loggedIn: req.session.loggedIn});
        }
    }
    next();
})

app.use('/api/book', Book);
app.use('/api/shelf', Shelf);
app.use('/api/bookDescription', BookDescription);

app.get('/', (req, res) => {
    res.redirect("/shelf/get");
})
app.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/login");
})

app.post('/login', (req, res) => {
    if(req.body.pass === process.env.PASSCODE){
        req.session.loggedIn = true;
        return res.redirect("/book/get");
    }
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})

debugg = function (...args){
    if(debugging)
        console.error(...args);
}

debugging = true;