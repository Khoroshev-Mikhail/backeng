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
        const data = await db.any('SELECT * FROM words');
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.post('/words', jsonParser, async (req, res) => {
    try {
        if(!req.body.eng || !req.body.eng){
            throw new Error('Пустые поля в request.body')
        }
        const data = await db.one('INSERT INTO words(eng, rus) VALUES($1, $2) RETURNING id', [req.body.eng, req.body.rus])
        return data.id >= 0 ? res.status(200).send(data) : res.sendStatus(500)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.get('/groups', async (error, res) => {
    try {
        const data = await db.any('SELECT * FROM word_groups');
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
/*
app.get('/words/group/:id', async (req, res) => {
    try {
        const data = await db.one('SELECT word_ids FROM word_groups WHERE id = $1', [req.params.id]);
        return res.status(200).send(data.word_ids)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
*/
app.get('/words/group/:id', async (req, res) => {
    try {
        const data = await db.any('SELECT words.id, words.eng, words.rus FROM words LEFT JOIN word_groups ON words.id = ANY(word_groups.word_ids) WHERE word_groups.id = $1', [req.params.id]);
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.get('/vocabulary/:id', async (req, res) => {
    try {
        const data = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [req.params.id]);
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})


app.put('/vocabulary/:id/:method', jsonParser, async (req, res) => {
    try {
        const methods = ['russian', 'english', 'spelling', 'auding']
        const method = req.params.method
        if(!methods.includes(method)) throw new Error('Неверный url')

        const data = await db.one(`UPDATE user_vocabulary SET ${method} = ${method} || $2 WHERE id_user = $3 RETURNING id_user`, [req.params.method, req.body.word_id, req.params.id])
        return data.id_user >= 0 ? res.status(200).send(data) : res.sendStatus(500)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.listen(3002, ()=>{
    console.log('Сервер ожидает запросов...')
})