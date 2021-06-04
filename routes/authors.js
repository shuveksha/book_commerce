const express = require("express");
var con = require('../db_connect');
const formidable = require('formidable');

var router = express.Router();


router.get('/', function (req, res) {
    let sql = "select * from author";
    con.query(sql, (err, result) => {
        if (err) 
            throw err;
        
    

        res.send(result);
    })


});



// inserting into author
router.post('/', (req, res, next) => {

    const form = formidable({multiples: true});
    form.parse(req, (err, fields, files) => { // to store error
        let errors = Array();


        // get all the data
        let image = files.image || "";
    
        let name = fields.name || "";
        let bio = fields.bio || "";


        // perform validation before inserting in database.
        if (name === "") {
            errors.push("Name is required");
        }


        if (errors.length !== 0) {
            res.sendStatus(400).send(errors);
        } else { // Insert data into database

            let sql = "insert into author set ?";

            let values = {
                image : fields.image || "",
                name : fields.name || "",
                bio : fields.bio || "",
                

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


// Retrive the details of author having :id
router.get('/:id', function (req, res) {
    let authorId = req.params.id;
    let sql = "select * from author where id=?";
    con.query(sql, [authorId], function (err, result) {
        if (err) {
            res.sendStatus(500).send("Internal server error");
        } else {
           
            if(result.length == 0) {
                res.send(404).send("author don't exist");
            }
            res.send(result);
        }
      
    });
});


router.delete('/:id', (req, res) => { 
    // Grab the author id from url to delete
   let id = req.params.id;

   // check whether that author having that ID doesn't exist in table or not.
   let sql = "select * from author where id=?";

   con.query(sql, [id], function(err, result) {

        if (result.length == 0) {
            // author don't exist
            res.sendStatus(404);
        } else {

        

        // run delete query 
        con.query("delete from author where id=?", [id], function(err, result){
                if(err) throw err;
                res.send(result);
        });

    }

   });
});


// Export this file so that we can use router variable in app.js and plug it into. 

module.exports = router;

