

const express = require('express');
const formidable = require('formidable');


var con = require('./db_connect.js')
var books = require('./routes/books');
var publishers = require('./routes/publishers');
var genres = require('./routes/genres');
var authors = require('./routes/authors');
var languages = require('./routes/languages');


const app = express();
const port = 5000


app.use("/api/books", books);
app.use("/api/publishers", publishers);
app.use("/api/genres", genres);
app.use("/api/languages", languages);
app.use("/api/authors", authors);


app.listen(port, () => {
    console.log(`Server running at port ${port}`)
});

