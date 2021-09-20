"use strict";


const express = require("express");
const formidable = require('formidable');

var con = require('../db_connect');

var router = express.Router();


router.get('/', (req, res) => {
    let sql = "select * from book";
    con.query(sql, (err, result) => {
        if (err)
            throw err;
        res.send(result);
    })
})


// create new book
router.post('/', (req, res, next) => {


    const form = formidable({ multiples: true });
    form.multiples = true;
    form.uploadDir = uploadDir;
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


        // perform validation before inserting in database.
        if (title === "") {
            errors.push("title is required");
        }

        if (price === "") {
            errors.push("price is required")
        }

        // Write other if condition to check mandatory fields.

        if (language_id === "") { }

        if (errors.length !== 0) {
            res.sendStatus(400).send(errors);
        } else { // Insert data into database

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

// Retrive the details of book having :id
router.get('/:id', function (req, res) {
    let bookId = req.params.id;
    let sql = "select * from book where id=?";
    con.query(sql, [bookId], function (err, result) {
        if (err) {
            res.sendStatus(500).send("Internal server error");
        } else {

            if (result.length == 0) {
                res.send(404).send("book don't exist");
            }
            res.send(result);
        }

    });
});

router.delete('/:id', (req, res) => {
    // Grab the book id from url to delete
    let id = req.params.id;

    // check whether that book having that ID doesn't exist in table or not.
    let sql = "select * from book where id=?";

    con.query(sql, [id], function (err, result) {

        if (result.length == 0) {
            // Book don't exist
            res.sendStatus(404);
        } else {



            // run delete query 
            con.query("delete from book where id=?", [id], function (err, result) {
                if (err) throw err;
                res.send(result);
            });

        }

    });
});


// Export this file so that we can use router variable in `app`.js and plug it into. 

module.exports = router;

