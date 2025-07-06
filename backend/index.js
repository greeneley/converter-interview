const express = require('express')
const app = express()
const cors = require("cors");

app.use(express.json());
app.use(cors());
const port = 3000
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "currency"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!!!")
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/converter', (req, res) => {
    
    const {fromAmount, toCurrency, converterAmount} = req.body;
    const currentDateTime = (new Date()).toString();
    
    let sql = `INSERT INTO converter (input, input_currency, output, output_currency, create_at) VALUES (${fromAmount}, 'USD', ${converterAmount}, '${toCurrency}', '${currentDateTime}');`
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.send(req.body);
})

app.get('/history', (req, res) => {
    let sql = `SELECT * FROM converter ORDER BY create_at desc LIMIT 10`
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
