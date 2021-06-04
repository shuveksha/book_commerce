"use strict";


const express = require("express");
const formidable = require('formidable');
var con = require('../db_connect');
var router = express.Router();




router.get('/', function (req, res) {
    let sql = "select * from language";
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
        let language = fields.language || "";
        let code1 = fields.code1 || "";


        // perform validation before inserting in database.
        if (code1 === "") {
            errors.push("code is required");
        }
        if(language === ""){
            errors.push("language is required");
        }


        if (errors.length !== 0) {
            res.sendStatus(400).send(errors);
        } else { // Insert data into database

            let sql = "insert into language set ?"

            let values = {
                language : fields.language || "",
                code1 : fields.code1 || "",
                code2 : fields.code2 || ""

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




router.get('/:id', function (req, res) {
    let languageId = req.params.id;
    let sql = "select * from language where id=?";
    con.query(sql, [languageId], function (err, result) {
        if (err) {
            res.sendStatus(500).send("Internal server error");
        } else {
           
            if(result.length == 0) {
                res.send(404).send("language don't exist");
            }
            res.send(result);
        }
      
    });
});

router.delete('/:id', (req, res) => { 
    // Grab the language id from url to delete
   let id = req.params.id;

   // check whether that ;angauge having that ID doesn't exist in table or not.
   let sql = "select * from language where id=?";

   con.query(sql, [id], function(err, result) {

        if (result.length == 0) {
            // language don't exist
            res.sendStatus(404);
        } else {

        

        // run delete query 
        con.query("delete from language where id=?", [id], function(err, result){
                if(err) throw err;
                res.send(result);
        });

    }

   });
});


// Export this file so that we can use router variable in app.js and plug it into. 

module.exports = router;

