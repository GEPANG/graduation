const mysql=require('mysql');

const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456",
    port:"3308",
    database:"graduation"
});

con.connect();



module.exports = con

