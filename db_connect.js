const mysql = require('mysql');
var con = mysql.createConnection({host: "localhost", user: "root", password: "", database: 'book_commerce'});

con.connect((err) => {
    if (err) 
        throw err;
    console.log("Database connected successfully");
})


module.exports = con;
