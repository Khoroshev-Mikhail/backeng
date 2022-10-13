//Подключаем express
const express = require("express");
const jsonParser = express.json()
const app = express()
const db = require('./db.js')

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    next();
});

app.get('/', (error, res) => {
    return res.status(200).send("Сервер ожидает запросов...")
})
app.get('/words', async (error, res) => {
    try {
        const data = await db.any('SELECT * FROM words', [true]);
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.post('/words', jsonParser, async (req, res) => {
    try {
        const data = await db.one('INSERT INTO  words(eng, rus) VALUES($1, $2) RETURNING id', [req.body.eng, req.body.rus])
        return data === 1 ? res.status(200).send(data) : res.sendStatus(500)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.listen(3002, ()=>{
    console.log('Сервер ожидает запросов...')
})