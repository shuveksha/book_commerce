

const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const formidable = require('formidable');
var exphbs = require('express-handlebars');
const path = require('path');
const { Formidable } = require('formidable');
var con = require('./db_connect.js');
const { createSecretKey } = require('crypto');
const { connect } = require('./db_connect.js');


// var books = require('./routes/books');
// var publishers = require('./routes/publishers');
// var genres = require('./routes/genres');
// var authors = require('./routes/authors');
// var languages = require('./routes/languages');


// Create an express app.
const app = express();

// set view directory
app.set('views', path.join(__dirname, 'views'));

// Set handlebar
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

// Set handlebars as view engine
app.set('view engine', 'hbs');

// Set static dir to serve css and js
app.use(express.static(path.join(__dirname, 'public')));

// Parse json or urlencoded form
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Use session
app.use(session({
    secret: '12345',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}))

// Use cookie parser  to parse browser cookie. 
app.use(cookieParser());

// running port
const port = 5000;



app.get('/', (req, res) => {
    items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    res.render('home', { items: items });
});

app.get('/about-us', (req, res) => {
    res.render('about-us')
});

app.get('/browse/books/:type', (req, res, next) => {
    const browseType = req.params.type || null;
    if (!browseType) {
        browseType = "default";
    }

    if (browsType === "popular") {

    }
});

// Detail of a book having :id
app.get('/book/:id', (req, res) => {

    let book = { title: 'Biography' };
    items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    res.render('book/book_detail', { items: items })

});

// Authentication
app.get('/authentication', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    }
    res.render("authentication/authentication");
});

app.post('/login', (req, res, next) => {
    let formFieldError = {};
    let formError = {};
    let email = req.body.email;
    let password = req.body.password;
    let loggedInUser = {};
    var session;

    // Form fields validation
    if (email === "") {
        formFieldError["email"] = "Email is a required field";
    }

    if (password === "") {
        formFieldError["password"] = "Password is a required field"
    }

    // Check for user having email and correct password. 
    let sql = "select * from user where email=? and password=?";
    console.log(sql);
    con.query(sql, [email, password], function (err, result) {
        if (!err && result.length > 0) {
            console.log(result);

            loggedInUser.id = result[0].id;
            loggedInUser.name = result[0].name;
            loggedInUser.email = result[0].email;

            // set session key.
            req.session.user = loggedInUser;
            req.session.userId = loggedInUser.id;

            res.redirect("/dashboard");
        } else {
            console.log("error is", err);
            res.render('authentication/authentication', { error: err });
        }

    });
});

app.post('/logout', (req, res, next) => {
    // destroy the session
    console.log(req.body.logout);


    if (req.body.logout) {
        console.log("Logout request accepted inside if");
        req.session.user = null;
        res.redirect('/authentication');
    }
})

app.post('/register', (req, res, next) => {
    let error = {}
    error["registrationFormError"] = new Array();
    error["registerFormFieldError"] = {};
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let newUser = {};



    if (name == "") {
        error["registerFormFieldError"]["name"] = "Name is required";
    }
    if (email == "") {
        error["registerFormFieldError"]["email"] = "Email is required";
    }
    if (password == "") {
        error["registerFormFieldError"]["password"] = "Password is required";
    }



    if (error["registerFormFieldError"].length > 0) {
        res.render("authentication/authentication", { error: error });
    } else {
        console.log(name, email, password);
        let dbUser = con.query("select * from user where email=?", [email], function (err, result) {
            if (err) {

                error["registrationFormError"].push(err);
                console.log(err, "Error is");
                res.render("authentication/authentication", { error: error });
            } else { // User don't exist create new user. 

                let userFields = [
                    [name, email, password]
                ]

                let sql = "insert into user (name, email, password) values ?";
                con.query(sql, [userFields], function (err, result) {

                    if (!err) {
                        console.log(result);
                        newUser.name = result[0].name;
                        newUser.email = result[0].email;
                        newUser.id = result[0].id;

                        req.session.user = newUser;
                        res.redirect("/dashboard");

                    } else {
                        error["registrationFormError"].push(err);
                        console.log(err, "Error is");
                        res.render('authentication/authentication', { error: error })
                    }
                })

            }
        });
    }
});
// app.use("/api/books", books);
// app.use("/api/publishers", publishers);
// app.use("/api/genres", genres);
// app.use("/api/languages", languages);
// app.use("/api/authors", authors);

app.get('/dashboard', (req, res) => {

    // If user not logged in redirect to login page
    if (!req.session.userId) {
        res.redirect('/authentication');
    } else if (req.session.userId) {
        if (req.session.user) {
            res.render('dashboard/dashboard', { user: req.session.user });
        } else {
            let sql = "select * from user where id=?"
            con.query(sql, [req.session.userId], function (err, result) {
                console.log(result);
                loggedInUser = {};
                loggedInUser["name"] = result[0].name;
                loggedInUser["email"] = result[0].name;
                loggedInUser["id"] = result[0].id;
                res.render('dashboard/dashboard', { user: loggedInUser });
            });
        }
    }
});


app.get('/genres', (req, res) => {
    let sqlGenreList = "select * from genre";
    let bookList;
    let bookFetchMessage;

    con.query(sqlGenreList, function (err, genreList) {
        if (!err) {
            if (genreList.length > 0) {
                con.query("select book.id id, genre_id, book.title as title , book.thumbnail as thumbnail, genre.genre as genre from book book  inner join genre genre ON book.genre_id=genre.id", function (err, bookList) {
                    if (!err) {
                        if (bookList.length > 0) {
                            console.log(genreList, bookList);
                            res.render('genre/genre', {
                                genre: genreList,
                                books: bookList,
                            });
                        } else {
                            res.send("Server side error.    ")
                        }
                    }
                });


            }
        } else {
            res.sendStatus(500).send("Some server error occoured");
        }
    });


});


app.get('/genres/:genre', function (req, res) {
    let genre = req.params.genre;
    let genreSql = "select * from genre where genre like ?";
    con.query(genreSql, ['%' + genre + '%'], function (err, result) {
        if (!err) {
            if (result.length > 0) {
                let genreId = result[0].id;
                let sqlBooks = "select * from book where genre_id=?";
                con.query(sqlBooks, [genreId], function (err, result) {
                    if (!err) {
                        if (result.length > 0) {
                            res.render('genre/genre_detail', { books: result, genre: genre });
                        } else if (result.length == 0) {
                            message = `0 books on genre ${genre}`;
                            res.render('genre/genre_detail', { message: message });
                        }
                    }
                });

            } else if (result.length == 0) {
                let message = `Genre ${genre} not found`;
                res.render('genre/genre_detail', { message: message })
            }
        } else {
            message = `Server side error occoured`;
            res.send(`Genre ${genre} not found`, { message: message });
        }
    });


});
app.listen(port, () => {
    console.log(`Server running at port ${port}`)
});


