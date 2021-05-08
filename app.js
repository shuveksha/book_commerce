const mysql = require('mysql');
const express = require('express');
const formidable = require('formidable');


// Database connection
var con = mysql.createConnection({host: "localhost", user: "root", password: "", database: 'book_commerce'});


// connection string
con.connect((err) => {
    if (err) 
        throw err;
    
    console.log("Databae connected successfully");
})


// Express setup
const app = express();
const port = 5000

app.get('/', (req, res) => {
    res.send("Index page");
})


// Book resource
app.get('/api/books', (req, res) => {
    let sql = "select * from book";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        

        res.send(result);
    })
})

app.post('/api/books', (req, res, next) => {
    // Add new record and return the success result
    // 1. Grab the data send by the user from browser
    // 2. Insert the new record based on the user provided data
    // 3. return the success result.
    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => { // to store error
        let errors = Array();


        // get all the data
        let title = fields.title || "";
        let description = fields.description || "";
        let price = fields.price || "";
        let author_id = fields.author_id || "";
        let thumbnail = fields.thumbnail || "";
        let genre_id = fields.genre_id || "";
        let language_id = fields.language_id || "";
        let edition = fields.edition || "";
        let isbno = fields.isbno || "";
        let pages = fields.pages || "";
        let publisher_id = fields.publisher_id || "";
        let url = fields.url || "";


        console.log(fields.title);
        // perform validation before inserting in database.
        if (title === "") {
            errors.push("title is required");
        }

        if (price === "") {
            errors.push("price is required")
        }

        // Write other if condition to check mandatory fields. 

        if (errors.length !== 0) {
            res.sendStatus(400).send(errors);
        } else { 


            // Insert data into database

            let sql = "insert into book set ?"

            let values = {
                title: title,
                description: description,
                price: price,
                author_id: author_id,
                thumbnail: thumbnail,
                genre_id: genre_id,
                language_id: language_id,
                edition: edition,
                isbno: isbno,
                pages: pages,
                publisher_id: publisher_id,
                url: url
            };

            con.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400).send("Bad Request" + err);
                } else {
                    res.sendStatus(201).send(result.affectedRows);
                }

            });
        }


    });


})

app.put('/api/books/:id', (req, res) => {
    let id = req.params.id

    // write update query to update the record having id = 1
})

app.delete('/api/books/:id', (req, res) => { // write a query to delete the book having :id and return result
})

app.get('/api/books/:id', (req, res) => { // write  a query to retrive the details of a book and return the record
})


// app.post  -- create new boo
// app.update  -- update extng boo
// app.delete  -- delete extng boo.


app.get('/publishers', (req, res) => {

    let sql = "select * from publisher";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
        res.send(result);
    })


});


// Genre
app.get('/genre', function (req, res) {
    let sql = "select * from genre";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
        res.send(result);
    })


});


// language


app.get('/language', function (req, res) {
    let sql = "select * from language";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
        res.send(result);
    })


});


// author


app.get('/author', function (req, res) {
    let sql = "select * from author";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
        res.send(result);
    })


});
// updating into exising book

app.get('/book', function (req, res) {
    let sql = "update  book  set genre_id = '3' where id='1'";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
        console.log(result.affectedRows)
        res.send(result);

    })
});

app.get('/book', function (req, res) {
    let sql = "insert into book(id,name) values('20','hello')";
    con.query(sql, (err, result) => {

        if (err) 
            throw err;
        
        res.send(result);
    })


});


app.listen(port, () => {
    console.log(`Server running at port ${port}`)
});
