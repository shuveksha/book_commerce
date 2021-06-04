

"use strict";


const express = require("express");
const formidable = require('formidable');
var con = require('../db_connect');
var router = express.Router();




router.get('/', function (req, res) {
    let sql = "select * from genre";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        

        res.send(result);
    })


});

router.post('/', (req, res, next) => {

    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => { // to store error
        let errors = Array();


        // get all the data
        let genre = fields.genre || "";
        let description = fields.description || "";


        // perform validation before inserting in database.
        if (genre === "") {
            errors.push("Name is required");
        }


        if (errors.length !== 0) {
            res.sendStatus(400).send(errors);
        } else { // Insert data into database

            let sql = "insert into genre set ?"

            let values = {
                genre: fields.genre || "",
                description: fields.description || ""

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


});


router.get('/:id', function (req, res) {
    let genreId = req.params.id;
    let sql = "select * from genre where id=?";
    con.query(sql, [genreId], function (err, result) {
        console.log(result);
        if (err) {
            res.sendStatus(500).send("Internal server error");
        } else {
           
            if(result.length == 0) {
                res.send(404).send("genre don't exist");
            }
            res.send(result);
        }
      
    });
});

router.delete('/:id', (req, res) => { 
    // Grab the genre id from url to delete
   let id = req.params.id;

   // check whether that genre having that ID doesn't exist in table or not.
   let sql = "select * from genre where id=?";

   con.query(sql, [id], function(err, result) {

        if (result.length == 0) {
            // genre don't exist
            res.sendStatus(404);
        } else {

        

        // run delete query 
        con.query("delete from genre where id=?", [id], function(err, result){
                if(err) throw err;
                res.send(result);
        });

    }

   });
});


// Export this file so that we can use router variable in app.js and plug it into. 

module.exports = router;


