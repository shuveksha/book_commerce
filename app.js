
const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const formidable = require('formidable');
var exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
var fs = require('fs');
var con = require('./db_connect.js');


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
    extname: '.hbs',
}));

// Handlebars helpers for equality checking. 
Handlebars.registerHelper('eq', function (arg1, arg2) {
    if (arg1 === arg2) {
        return true;
    }
    return false;
});

// Set handlebars as view engine
app.set('view engine', 'hbs');

// Set static dir to serve css and js
app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse json or urlencoded form
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Use session
app.use(session({
    secret: '12345',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

// passing session variable to all templates. 
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// Use cookie parser  to parse browser cookie. 
app.use(cookieParser());

// running port
const port = 5000;

app.get('/', (req, res) => {

    // new release.
    let newRelease;
    let bestSelling;
    let ebooks;

    // new releases 
    con.query("select * from book where new_release=?", [true], function (err, result) {
        if (!err) {
            if (result.length > 0) {
                newRelease = result;
            }
        }

        // best selling
        con.query("select * from book where best_selling=?", [true], function (err, result) {
            if (!err) {
                if (result.length > 0) {
                    bestSelling = result;
                }
            }

            // Ebooks.
            // Ebook id=2
            con.query("select * from book inner join book_book_type on book.id=book_book_type.book_id where book_book_type.book_type_id=?", [2], function (err, result) {
                if (!err) {
                    if (result.length > 0) {
                        ebooks = result;
                        res.render('home', {
                            bestSelling: bestSelling,
                            ebooks: ebooks,
                            newRelease: newRelease
                        });
                    }
                }
            });

        });

    });

});



app.get('/browse/books/:type/', (req, res, next) => {

    let sql;
    // audio, ebook, paperback.
    let typeId;
    let browseType = req.params.type || null;
    if (!browseType) {
        browseType = "all";
    }

    if (browseType === "all") {

        sql = "select * from book";
    } else {
        sql = "select * from book inner join book_book_type on book.id=book_book_type.book_id where book_book_type.book_type_id=?";
    }

    if (browseType === "all") {
        sql = "select * from book";
    } else if (browseType === "audio") {
        typeId = '1';
    } else if (browseType === "ebook") {
        typeId = '2';
    } else if (browseType === "paperback") {
        typeId = '3';
    }

    con.query(sql, [typeId], function (err, bookList) {
        if (!err) {
            if (bookList.length > 0) {
                res.render('book/books', { books: bookList, browseType: browseType });
            }
        }

    });

});


// Detail of a book having :id
app.get('/book/:id/:title/', (req, res) => {
    let id = req.params.id;
    let sql = "select book.*, publisher.name as publisher_name, genre.genre from book left join publisher on book.publisher_id=publisher.id left join genre on book.genre_id = genre.id where book.id=?";
    let book;
    con.query(sql, [id], function (err, result) {
        if (err) {
            res.send("Error on fetching book");
        }
        if (result.length <= 0) {
            res.send("No book found")
            return;
        }

        book = result[0];

        let bookGenreId = result[0].genre_id;

        if (book.new_release == "1") {
            book.new_release = "Yes";
        } else {
            book.new_release = "No";
        }

        if (book.best_selling == "1") {
            book.best_selling = "Yes";
        } else {
            book.best_selling = "No";
        }


        con.query("select * from book where genre_id=?", [bookGenreId], function (err, relatedBooks) {

            if (err) {
                relatedBooks = [];
            }

            if (relatedBooks.length <= 0) {
                relatedBooks = [];
            }

            res.render('book/book_detail', {
                book: book,
                relatedBooks: relatedBooks
            });
        })


    });
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
    let formError = new Array();
    let email = req.body.email;
    let password = req.body.password;
    let loggedInUser = {};
    // Form fields validation
    if (email === "") {
        formFieldError["email"] = "Email is a required field";
    }

    if (password === "") {
        formFieldError["password"] = "Password is a required field"
    }

    // Check for user having email and correct password. 
    let sql = "select * from user where email=? and password=?";
    con.query(sql, [email, password], function (err, result) {
        if (!err && result.length > 0) {
            loggedInUser.id = result[0].id;
            loggedInUser.name = result[0].name;
            loggedInUser.email = result[0].email;
            if (result[0].user_type == "admin") {
                loggedInUser.isAdmin = true;
            } else {
                loggedInUser.isAdmin = false;
            }

            // set session key.
            req.session.user = loggedInUser;
            req.session.userId = loggedInUser.id;

            res.redirect("/dashboard");
        } else if (result.length == 0) {
            formError.push("Invalid username or password");
            res.render('authentication/authentication', { formError: formError, formFieldError: formFieldError });
        }

    });
});

app.get('/login', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    }
    res.render("authentication/authentication");
});

app.post('/logout', (req, res, next) => {
    // destroy the session
    req.session.user = null;
    req.session.userId = null;
    if (req.body.logout) {
        req.session.user = null;
        return res.redirect('/authentication');
    }
})

app.post('/register', (req, res, next) => {
    let error = {}
    error["registrationFormError"] = new Array();
    error["registerFormFieldError"] = new Array();
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let newUser = {};


    if (name == "") {
        error["registerFormFieldError"].push("Name is required");
    }
    if (email == "") {
        error["registerFormFieldError"].push("Email is required");
    }
    if (password == "") {
        error["registerFormFieldError"].push("Password is required");
    }


    if (error["registerFormFieldError"].length > 0) {
        res.render("authentication/authentication", { error: error });
    } else {
        con.query("select * from user where email=?", [email], function (err, result) {

            console.log(result);
            if (err) {

                error["registrationFormError"].push(err);
                res.render("authentication/authentication", { error: error });
            } else if (result.length > 0) {

                //user exist show validation error. 
                error["registrationFormError"].push(`User having email ${email} already exist`);
                res.render("authentication/authentication", { error: error });
            } else {

                // user don't exist insert.

                let userFields = [
                    [name, email, password]
                ]

                let sql = "insert into user (name, email, password) values ?";
                con.query(sql, [userFields], function (err, result) {

                    if (!err) {
                        newUser.id = result.insertId;

                        req.session.user = newUser;
                        // req.session.userId = result.insertId;
                        res.render("authentication/authentication", {
                            signupMessage: "User created successfully, please login"
                        });

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
        return res.redirect('/authentication');
    } else if (req.session.userId) {
        if (req.session.user) {

            con.query("select * from book", function (err, bookList) {
                if (!err) {
                    if (bookList.length > 0) {
                        books = bookList;
                    }
                }
                res.render('dashboard/dashboard', {
                    books: books,
                    user: req.session.user
                });
            });

        } else {
            let sql = "select * from user where id=?"
            con.query(sql, [req.session.userId], function (err, result) {
                loggedInUser = {};
                loggedInUser["name"] = result[0].name;
                loggedInUser["email"] = result[0].name;
                loggedInUser["id"] = result[0].id;

                console.log("fetching")
                // books list. 
                con.query("select * from book", function (err, bookList) {
                    if (!err) {
                        if (bookList.length > 0) {
                            books = bookList;
                        }
                    }
                    res.render('dashboard/dashboard', {
                        books: books,
                        user: loggedInUser
                    });
                });
            });
        }
    }
});


// *******update book *****

// book list
app.get('/dashboard/books', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    } else {
        sql = "select * from book";
        con.query(sql, function (err, result) {
            if (!err) {
                if (result.length > 0) {
                    console.log("Book list is ", result);
                    res.render('dashboard/book_list', { books: result });
                }
            } else {
                res.send("Error on fetching books");
            }

        });

    }
});

// book add get form 
app.get('/dashboard/book/add', function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/authentication');
    }

    if (!req.session.user.isAdmin) {
        return res.send("Only Admin is allowed to add books");
    }

    // query genre and publisher. 
    con.query("select * from genre", function (err, genres) {
        if (!err) {
            console.log(genres);
        } else {
            genre = [];
        }

        // query publisher. 
        con.query("select * from publisher", function (err, publishers) {
            if (!err) {

            } else {
                publishers = [];
            }

            if (genres.length > 0 && publishers.length > 0) {
                return res.render('dashboard/book_add', {
                    genres: genres,
                    publishers: publishers
                });
            } else {
                return res.send("Error on fetching genres and publishers");
            }
        });

    });

});

// book add post form
app.post('/dashboard/book/add', function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/authentication');
    } else {
        let form = formidable.IncomingForm();
        form.keepExtensions = true;

        // Form parsing
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.send("Error in parsing form");
            }

            let title = fields['title'] || "";
            let description = fields['description'] || "";
            let price = fields["price"] || "";
            let author_id = fields["author"] || "";
            let genre_id = fields["genre"] || "";
            let language_id = 1;
            let edition = fields["edition"] || "";
            let isbno = fields["isbn"] || "";
            let pages = fields["pages"] || "";
            let publisher_id = fields["publisher"] || "";

            // files 
            let thumbnail_path = files.thumbnail.path;
            let thumbnail_db_path = path.join(__dirname, "public", "media", "thumbnail", files.thumbnail.name);

            let url_path = files.url.path;
            let url_db_path = path.join(__dirname, "public", "media", "files", files.url.name);


            // server side validation. 
            if (!title && !description && !price && !author_id && !genre_id && !language_id && !edition && !isbn && !pages && !publisher_id && !thumbnail_path && !url_path) {
                return res.send("Please fill up the book add form correctly.");
            }

            // rename thumbnailPath
            fs.rename(thumbnail_path, thumbnail_db_path, function (err) {
                if (err) {
                    console.log(err);
                    return res.send("File uploading error thumbnail");
                }





            });

            fs.rename(url_path, url_db_path, function (err) {
                if (err) {
                    return res.send("File uploading error doc");

                }


            });

            // Insert into db by validating data.
            console.log(thumbnail_db_path, url_db_path);
            thumbnail_db_path = path.join('/public', "media", "thumbnail", files.thumbnail.name).replace(/\\/g, '/');
            url_db_path = path.join('/public', "media", "thumbnail", files.url.name).replace(/\\/g, '/');
            tdb = path.join('/public', 'media', 'thumbnail', files.thumbnail.name);
            udb = path.join('/public', 'media', 'files', files.url.name);

            // thumbnail  db path
            tdb = tdb.replace(/\\/g, '/')
            // file db path

            udb = udb.replace(/\\/g, '/');

            console.log(tdb, udb);

            let columns = [
                title,
                description,
                price,
                author_id,
                genre_id,
                language_id,
                edition,
                isbno,
                pages,
                publisher_id,
                tdb,
                udb,
            ]

            let insertBookSql = "insert into book( title, description, price, author_id, genre_id, language_id, edition, isbno,pages,publisher_id, thumbnail,url) values (?)     ";

            con.query(insertBookSql, [columns], function (err, result) {
                if (!err) {
                    return res.send("Book Added successfully");
                } else {
                    console.log(err);
                }
            });
            if (err) {
                console.log("Error parsing the files");
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files",
                    error: err,
                });
            }
        });
    }
});

// book update get form
app.get('/dashboard/book/update/:id/:title/', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    let id = req.params.id;
    let sql = "select * from book where id=?";
    con.query(sql, [id], function (err, result) {
        let book = {};
        if (err) {
            res.send("Server error occurred while fetching book");
            return;
        }

        book.title = result[0].title || "";
        book.description = result[0].description || "";
        book.price = result[0].price || "";
        book.thumbnail = result[0].thumbnail || "";
        book.genre_id = result[0].genre_id || "";
        book.language_id = result[0].language_id || "";
        book.edition = result[0].edition || "";
        book.isbno = result[0].isbno || "";
        book.pages = result[0].pages || "";
        book.publisher_id = result[0] || "null";
        book.url = result[0].url
        book.new_selling = result[0].new_release;
        if (book.new_selling === "1") {
            book.new_selling = true;
        } else {
            book.new_selling = false;
        }
        book.best_selling = result[0].best_selling;
        if (book.best_selling == "1") {
            book.best_selling = true;
        } else {
            book.best_selling = false;
        }


        // publisher 
        con.query("select * from publisher", function (err, result) {
            if (err) {
                res.send("Error occurred while fetching publisher");
                return;
            }
            let publishers = result;

            // genres
            con.query("select * from genre", function (err, result) {
                if (err) {
                    res.send("Error occurred while fetching genres");
                    return;
                }
                let genres = result;


                console.log(book, "BOOK IS");
                res.render("dashboard/book_update", {
                    book: book,
                    genres: genres,
                    publishers: publishers

                });

            });
        });

    });
});

// book delete get form. 
app.get('/dashboard/book/delete/:id/:title/', function (req, res) {
    let id = req.params.id || null;
    let title = req.params.title || null;

    if (!id || !title) {
        res.send("Not a valid book id");
        return;
    }

    res.render("dashboard/book_delete", { title: title, book_id: id });

});

// book delete post from
app.post('/dashboard/book/delete/', function (req, res) {
    let id = req.body.book_id;
    let sql = "delete from book where id=?";
    con.query(sql, [id], function (err, result) {
        if (err) {
            res.send("Server error on deleting book with Id ${id");
            return;
        }
        console.log(result);
        res.redirect("/dashboard/books");
    });
});


// *******Publisher *****
// Publisher list . 
app.get('/dashboard/publisher', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }
    let sql = "select * from publisher";
    con.query(sql, function (err, result) {
        if (!err) {
            if (result.length > 0) {
                res.render('dashboard/publisher_list', {
                    publisher: result

                });
            } else {
                res.send("No publishers added");
                return;
            }
        }
    })
});

// Publisher get add form
app.get('/dashboard/publisher/add', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    console.log("Loaded publisher page")

    res.render('dashboard/publisher_add');
});

// Add publisher 
app.post('/dashboard/publisher/add', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }



    let name = req.body.name || "";
    let description = req.body.description || "";
    let phone = req.body.phone || "";
    let email = req.body.email || "";

    // if (email === "" || description === "" || phone === "" || name === "") {
    //     res.render('dashboard/publisher_add', { message: 'Name, email, description, phone or email required' });
    // }

    let sql = "insert into publisher(name, description, phone, email) values (?)";
    columns = [name, description, phone, email]

    // insert publisher
    con.query(sql, [columns], function (err, result) {
        if (!err) {
            console.log(result);
            res.redirect('/dashboard/publisher');
        } else {
            console.log(err)
            res.send("Server error occoured while adding publisher");
            return;
        }

    });

});

// Get publisher delete page
app.get('/dashboard/publisher/delete', function (req, res) {

    res.render('dashboard/publisher_delete', {
        publisherId: req.query.publisherId,
        title: req.query.publisherTitle
    });
});

// publisher delete action
app.post('/dashboard/publisher/delete', function (req, res) {
    let id = req.body.publisher_id;
    console.log("Delete id is", id);

    let sql = "delete from publisher where id=?";

    con.query(sql, [id], function (err, result) {
        if (err) {
            res.send("Error in deleting ${deleteSql}");
            return;
        }
        res.redirect('/dashboard/publisher');
    });
});

// Publisher get update page. 
app.get('/dashboard/publisher/update', function (req, res) {
    let publisherID = req.query.publisherId;
    let publisher = {};
    con.query("select * from publisher where id=?", [publisherID], function (err, result) {
        if (err) {
            res.send("Server error occoured");
            return;
        }
        publisher.name = result[0].name;
        publisher.description = result[0].description;
        publisher.phone = result[0].phone;
        publisher.email = result[0].email;
        publisher.id = result[0].id;


        res.render('dashboard/publisher_update', {

            publisher: publisher
        });


    });

});

// publisher update form.
app.post('/dashboard/publisher/update', function (req, res) {

    if (!req.session.userId) {
        res.redirect('/authentication');
    }
    let name = req.body.name || "";
    let description = req.body.description || "";
    let phone = req.body.phone || "";
    let email = req.body.email || "";
    let id = req.body.id;
    console.log(description);

    let sql = "update  publisher set name=?, description=?, phone=?, email=? where id=?";
    let columns = [name, description, phone, email, id]

    // update publisher
    con.query(sql, columns, function (err, result) {
        if (!err) {
            console.log("update result is", result);
            res.redirect("/dashboard/publisher");
        } else {
            console.log(err)
            res.send("Server error while updating book ${title}");
            return;
        }

    });
});


// *******Genre *****
// Genre list . 
app.get('/dashboard/genres', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }
    let sql = "select * from genre";
    con.query(sql, function (err, result) {
        if (!err) {
            if (result.length > 0) {
                res.render('dashboard/genre_list', {
                    publisher: result

                });
            } else {
                res.send("No genres found");
                return;
            }
        }
    })
});

// Genre Add form
app.get('/dashboard/genre/add', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    res.render('dashboard/genre_add');
});


// genre Add 
app.post('/dashboard/genre/add', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    let genre = req.body.genre;
    let description = req.body.description;


    let sql = "insert into genre(genre, description) values(?)";
    let columns = [genre, description];

    con.query(sql, [columns], function (err, result) {
        if (err) {
            res.send("Server error on adding genre");
            return;
        }
        res.redirect('/dashboard/genres');

    });

});


// genre update 

// Genre get update form. 
app.get('/dashboard/genre/update', function (req, res) {
    let genreId = req.query.genreId;
    let genre = {};
    con.query("select * from genre where id=?", [genreId], function (err, result) {
        if (err) {
            res.send("Server error occoured while fetching genre");
            return;
        }

        genre.genre = result[0].genre;
        genre.description = result[0].description;
        genre.id = result[0].id;

        res.render('dashboard/genre_update', {
            genre: genre
        });

    });

});

// Genre update form.
app.post('/dashboard/genre/update', function (req, res) {

    if (!req.session.userId) {
        res.redirect('/authentication');
    }
    let genre = req.body.genre || "";
    let description = req.body.description || "";
    let id = req.body.id;


    let sql = "update  genre set genre=?, description=? where id=?";
    let columns = [genre, description, id]

    // update publisher
    con.query(sql, columns, function (err, result) {
        if (!err) {
            res.redirect("/dashboard/genres");
        } else {
            res.send("Server error while updating genre ${genre}");
            return;
        }
    });
});


// genre Delete. 
app.get('/dashboard/genre/delete', function (req, res) {

    res.render('dashboard/genre_delete', {
        genreId: req.query.genreId,
        genre: req.query.genre
    });
});

// genre delete action
app.post('/dashboard/genre/delete', function (req, res) {
    let id = req.body.genreId;
    console.log("Delete id is", id);

    let sql = "delete from genre where id=?";

    con.query(sql, [id], function (err, result) {
        if (err) {
            res.send("Error in deleting ${deleteSql}");
            return;
        }
        res.redirect('/dashboard/genres');
    });
});


// *******Cart****

// cart details
app.get('/dashboard/cart/checkout', function (req, res) {
    let userId = req.session.userId;
    if (!userId) {
        res.redirect('/authentication');
    }
    // let sql = "select * from cart where user_id=?"
    let sql = "select book.title, book.price, cart.quantity, cart.quantity * book.price as sub_total from cart inner join book on cart.product_id=book.id where cart.user_id=?";
    let cart_message;
    con.query(sql, [userId], function (err, result) {
        if (err) {
            res.send("Error fetching user cart");
            return;
        }
        if (result.length <= 0) {
            cart_message = "Your cart is empty";

        }

        if (result.length >= 0) {
            total_item = result.length;
            cart_message = `You have total ${total_item} item in your cart`;

            let total_quantity = 0;
            let total_price = 0

            result.forEach(item => {
                total_quantity += item.quantity;
                total_price += item.sub_total;
            });

            res.render('dashboard/cart', {
                cart_message: cart_message,
                items: result,
                total_quantity: total_quantity,
                total_price: total_price
            });
        }
    });


});

// Process order. 
app.post('/dashboard/cart/checkout/order', function (req, res) {
    if (req.session.userId) {
        res.redirect('/authentication');
    }



    let userId = req.session.userId;

    let full_name = req.body.full_name || "";
    let email = req.body.email || "";
    let phone = req.body.phone || "";
    let street_address = req.body.street_address || "";
    let city = req.body.city || "";

    if (!full_name || !email || !phone || !street_address) {
        res.send("Please fill the shipping details completly");
    }


    let sql = "select cart.*, book.price as price from cart inner join book on cart.product_id=book.id where user_id=?";
    con.query(sql, [userId], function (err, cartItems) {


        if (err) {
            res.send("Error on fetching cart")
            return;
        }

        if (cartItems.length <= 0) {
            res.send("Your cart is empty");
        } else if (cartItems.length >= 1) {
            // create an order and invoice. 
            let shippingSql = "insert into shipping_address(full_name, email, phone, street_address, city) values(?)";
            let shippingTableColumn = [full_name, email, phone, street_address, city];

            con.query(shippingSql, [shippingTableColumn], function (err, shippingInsertResult) {
                if (err) {
                    res.send("Server error on inserting shipping address");
                    return;
                }

                let shippingId = shippingInsertResult.insertId;


                // create order.
                let createOrderSql = "insert into user_order(user_id, shipping_address_id) values(?)";

                let createOrderColumns = [req.session.userId, shippingId];
                con.query(createOrderSql, [createOrderColumns], function (err, result) {
                    if (err) {
                        res.send("error on creating orders");
                        return;
                    }
                    let orderId = result.insertId;



                    // insert items from cart to ordered items. 

                    let insertSql = "insert into ordered_items(product_id, ordered_price, ordered_quantity, user_order_id) select cart.product_id, book.price, cart.quantity, ? from cart inner join book on cart.product_id=book.id where cart.user_id=?";
                    // let insertOrderItemColumn = new Array();

                    // // multiple values. 
                    // cartItems.forEach(item => {
                    //     insertOrderItemColumn.push(orderId);
                    //     insertOrderItemColumn.push(item.product_id);
                    //     insertOrderItemColumn.push(item.price);
                    //     insertOrderItemColumn.push(item.quantity);

                    // });

                    // insert items from cart to orderedItems.
                    con.query(insertSql, [orderId, req.session.userId], function (err, result) {

                        if (err) {
                            console.log("Error while adding items form cart to ordereditems");
                        }

                        if (result) {

                            console.log("Inserted items into ordered items from cart", result);


                            // delete items from cart 
                            con.query("delete from cart where user_id=?", [req.session.userId], function (err, result) {
                                if (!err) {
                                    res.render('dashboard/order_detail')
                                }

                                if (result) {
                                    console.log("Delete from cart");
                                    return;
                                }
                            });
                        }


                    });

                });

            });
        }
    });

});
// add to cart  get
app.get('/cart/add/:productId/', function (req, res) {
    if (!req.session.userId) {
        return res.redirect('/authentication');
    }
    console.log("user is", req.session.user, "and id is", req.session.userId);
    if (req.session.user.isAdmin) {
        // Admin not allowed to add to cart. 
        res.send("Admin is not allowed for shopping, logged in as a normal user");
    }



    let productId = req.params.productId;

    console.log(req.params.productId, "Id is");
    if (!productId) {
        res.send("Product not found while adding in cart");
        return;
    }

    con.query("select * from book where id=?", [productId], function (err, result) {
        if (err) {
            res.send("Error while fetching product");
            return;
        }

        if (result.length <= 0) {
            res.send("Not able to add items in cart");
            return;
        }

        res.render('dashboard/cart_add', {
            product: result[0]
        });

    });
});


app.get('/dashboard/user/orders/', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }



    let userOrderSql = "select * from user_order where user_id=?";

    con.query(userOrderSql, [req.session.userId], function (err, result) {
        if (err) {
            res.send("Server error while fetching userOrder");
            return;
        }
        if (result.length <= 0) {

            result = [];
        }

        res.render('dashboard/order_list', {
            orders: result
        });



    });


});

app.get('/dashboard/customer/processedOrders', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    let orderStatus = 'processed';
    let sqlProcessedOrders = "select user_order.*, user.name, user.email from user_order inner join user on user_order.user_id=user.id where user_order.status=?"
    con.query(sqlProcessedOrders, [orderStatus], function (err, result) {
        if (!err) {
            let processedOrders;
            processedOrders = result;
            if (result.length <= 0) {
                processedOrders = false;

            }

            res.render("dashboard/customer_processed_order_list", {
                processedOrders: processedOrders
            });
        }
    });
});


app.get('/dashboard/processOrder/:orderId', function (req, res) {

    if (!req.session.userId) {
        res.redirect('/authentication');
        return;
    }

    console.log(req.session.user);

    if (!req.session.user.isAdmin) {
        res.send("You are not authorized to process the order");
        return;
    }

    let orderId = req.params.orderId || "";

    if (!orderId) {
        res.send("Invalid order id");
        return;
    }

    // query order details. 
    con.query("select user_order.*, shipping_address.* from user_order inner join shipping_address on user_order.shipping_address_id=shipping_address.id where user_order.id=?", [orderId], function (err, orderDetail) {
        if (err) {
            res.send("Error on fetching order");
            return;
        }

        // query shipping details. 
        let sqlShippingDetail = "select * from shipping_address where id=?";

        if (orderDetail.length > 0) {

            con.query(sqlShippingDetail, orderDetail[0].shipping_address_id, function (err, shippingAddress) {
                if (err) {
                    res.send("Error on fetching shipping details.");
                    return;
                }

                if (shippingAddress.length <= 0) {
                    res.send("No shipping details found");
                    return;
                }


                // fetch order details having order.id  
                let sqlOrderItemDetail = "select book.title, ordered_price, ordered_quantity, (ordered_quantity * ordered_price) as subtotal from ordered_items inner join user_order on ordered_items.user_order_id=user_order.id inner join book on ordered_items.product_id=book.id where  user_order.id =?";
                con.query(sqlOrderItemDetail, [orderId], function (err, order_items) {
                    if (!err) {


                        if (order_items.length <= 0) {
                            res.send(`No items found in order ${orderId}`);
                            return;
                        }

                        // calculate total quantity and total price
                        let totalPrice = 0;
                        order_items.forEach(item => {
                            totalPrice += item.subtotal;

                        });



                        res.render("dashboard/customerProcessOrder", {
                            order: orderDetail[0] || "",
                            orderId: orderId,
                            items: order_items || "",
                            shippingAddress: shippingAddress[0] || "",
                            totalPrice: totalPrice

                        });
                    }
                    if (err) {
                        res.send(`Error on fetching order items  having order id ${orderId}`);
                        return;

                    }
                });
            });

        } else {
            res.send("Error on fetching order detail");
            return;
        }

    });



});

app.get('/dashboard/customer/completedOrderDetails/:orderId', function (req, res) {

    if (!req.session.userId) {
        res.redirect('/authentication');
        return;
    }

    console.log(req.session.user);

    if (!req.session.user.isAdmin) {
        res.send("You are not authorized to process the order");
        return;
    }

    let orderId = req.params.orderId || "";

    if (!orderId) {
        res.send("Invalid order id");
        return;
    }

    // query order details. 
    con.query("select user_order.*, shipping_address.* from user_order inner join shipping_address on user_order.shipping_address_id=shipping_address.id where user_order.id=?", [orderId], function (err, orderDetail) {
        if (err) {
            res.send("Error on fetching order");
            return;
        }

        // query shipping details. 
        let sqlShippingDetail = "select * from shipping_address where id=?";

        if (orderDetail.length > 0) {

            con.query(sqlShippingDetail, orderDetail[0].shipping_address_id, function (err, shippingAddress) {
                if (err) {
                    res.send("Error on fetching shipping details.");
                    return;
                }

                if (shippingAddress.length <= 0) {
                    res.send("No shipping details found");
                    return;
                }


                // fetch order details having order.id  
                let sqlOrderItemDetail = "select book.title, ordered_price, ordered_quantity, (ordered_quantity * ordered_price) as subtotal from ordered_items inner join user_order on ordered_items.user_order_id=user_order.id inner join book on ordered_items.product_id=book.id where  user_order.id =?";
                con.query(sqlOrderItemDetail, [orderId], function (err, order_items) {
                    if (!err) {


                        if (order_items.length <= 0) {
                            res.send(`No items found in order ${orderId}`);
                            return;
                        }

                        // calculate total quantity and total price
                        let totalPrice = 0;
                        order_items.forEach(item => {
                            totalPrice += item.subtotal;

                        });



                        res.render("dashboard/completedOrderDetails", {
                            order: orderDetail[0] || "",
                            orderId: orderId,
                            items: order_items || "",
                            shippingAddress: shippingAddress[0] || "",
                            totalPrice: totalPrice

                        });
                    }
                    if (err) {
                        res.send(`Error on fetching order items  having order id ${orderId}`);
                        return;

                    }
                });
            });

        } else {
            res.send("Error on fetching order detail");
            return;
        }

    });



});



app.post('/dashboard/processOrder', function (req, res) {


    let orderId = req.body.orderId || "";

    if (!orderId) {
        res.send("Please provide a valid order ID");
        return;
    }




    let sqlUpdateOrderStatus = "update user_order set status=? where id=?";

    con.query(sqlUpdateOrderStatus, ['processed', orderId], function (err, result) {

        console.log(err, "error is ");
        console.log(result, "result is")

        if (!err) {
            res.redirect('/dashboard/customer/processedOrders');
        }

        console.log(err);
    });
});

app.get('/dashboard/customer/pendingOrders', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    let orderStatus = 'pending';
    let sqlpendingOrders = "select user_order.*, user.name, user.email from user_order inner join user on user_order.user_id=user.id where user_order.status=?"
    con.query(sqlpendingOrders, [orderStatus], function (err, result) {
        if (!err) {
            let pendingOrders;
            pendingOrders = result;
            if (result.length <= 0) {
                pendingOrders = false;

            }

            console.log(result);
            res.render("dashboard/customer_pending_order_list", {
                pendingOrders: pendingOrders
            });
        }
    });
});


app.get('/dashboard/order/detail/:orderId', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }
    let orderId = req.params.orderId;
    if (!orderId) {
        res.send("Invalid orderId");
        return;
    }


    // order detail. 
    con.query("select user_order.*, shipping_address.* from user_order inner join shipping_address on user_order.shipping_address_id=shipping_address.id where user_order.user_id=? and user_order.id=?", [req.session.userId, orderId], function (err, orderDetail) {
        if (err) {
            res.send("Error on fetching order");
            return;
        }

        // query shipping details. 
        let sqlShippingdetail = "select * from shipping_address where id=?";

        if (orderDetail.length > 0) {

            console.log("Order detail is", orderDetail);
            console.log('----');



            con.query(sqlShippingdetail, [10], function (err, shippingAddress) {
                if (err) {
                    res.send("Error on fetching shipping details.");
                    return;
                }


                if (shippingAddress.length <= 0) {
                    res.send("No shipping details found");
                    return;
                }




                // fetch order details having order.id  
                let sqlOrderItemDetail = "select book.title, ordered_price, ordered_quantity, (ordered_quantity * ordered_price) as subtotal from ordered_items inner join user_order on ordered_items.user_order_id=user_order.id inner join book on ordered_items.product_id=book.id where user_order.user_id =? and user_order.id =?";
                con.query(sqlOrderItemDetail, [req.session.userId, orderId], function (err, order_items) {
                    if (!err) {


                        if (order_items.length <= 0) {
                            res.send(`No items found in order ${orderId}`);
                            return;
                        }

                        // calculate total quantity and total price
                        let totalPrice = 0;
                        order_items.forEach(item => {
                            totalPrice += item.subtotal;

                        });

                        // render order detail page. 
                        res.render("dashboard/order_detail", {
                            order: orderDetail[0] || "",
                            items: order_items || "",
                            shippingAddress: shippingAddress[0] || "",
                            totalPrice: totalPrice
                        });
                    }
                    if (err) {
                        res.send(`Error on fetching order items  having order id ${orderId}`);
                        return;

                    }



                });



            });

        } else {
            res.send("Error on fetching order detail");
            return;
        }

    });
});

// add to cart post
app.post('/cart/add', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/authentication');
    }

    let productId = req.body.productId;
    let quantity = req.body.quantity;
    let product;

    if (!productId) {
        res.send("Please order a valid product");
        return;
    }

    if (!quantity || quantity <= 0) {
        res.send("Please input a valid quantity");
        return;
    }

    con.query("select * from book where id=?", [productId], function (err, result) {
        if (err) {
            res.send("Server error while fetching product");
            return;
        }

        if (result.length <= 0) {
            res.send("Product not found in store");
            return;
        }

        product = result[0];

        let sql = "insert into cart(user_id, product_id, quantity) values(?)";
        let columns = [req.session.userId, product.id, quantity]

        // Add to cart. 
        con.query(sql, [columns], function (err, result) {
            if (err) {
                res.send("Server error on adding to cart")
                return;
            }

            // On successful redirect to checkout page. 
            res.redirect('/dashboard/cart/checkout');
        });
    });

});

// homepage genre. 
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
                            return;
                        }
                    }
                });
            }
        } else {
            res.sendStatus(500).send("Some server error occoured");
            return;
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
            return;
        }
    });


});

/* search */
app.get('/search', function (req, res) {
    let search_query = req.query.search_query

    let sql_search_query = "select * from book where title like ?";
    con.query(sql_search_query, ['%' + search_query + '%'], function (err, result) {

        res.render('search', {
            books: result,
            searchQuery: search_query
        });

    });

});


app.listen(port, () => {
    console.log(`Server running at port ${port}`)
});


