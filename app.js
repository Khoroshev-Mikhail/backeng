//Подключаем express
const express = require("express");
const jsonParser = express.json()
const app = express()
const db = require('./db.js')
const fileUpload = require('express-fileupload');


//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(fileUpload());

app.get('/', (req, res) => {
    return res.status(200).send("Сервер ожидает запросов...")
})
app.get('/words', async (req, res) => {
    try {
        const data = await db.any('SELECT * FROM words');
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.get('/word/:id/groups', async (req, res) => {
    try {
        const groups = await db.any('SELECT * FROM word_groups WHERE $1 = ANY(word_ids)', [req.params.id]);
        return res.status(200).send(groups)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.put('/words', jsonParser, async (req, res) => {
    try {
        await db.none('UPDATE words SET eng = $2, rus = $3 WHERE id = $1', [req.body.id, req.body.eng, req.body.rus])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

app.delete('/words', jsonParser, async (req, res) => {
    try {
        await db.none('DELETE FROM words WHERE id = $1', [req.body.id])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})


app.post('/words', jsonParser, async (req, res) => {
    if(req.files){
        const sampleFile = req.files.img;
        const uploadPath = __dirname + '/images/' + sampleFile.name;
        sampleFile.mv(uploadPath, function(err) {
            if (err) throw new Error('Чёта с файлами')
        });
    }
    console.log(req.body, req.files)
    try {
        await db.none('INSERT INTO words(eng, rus, img, audio) VALUES($1, $2, $3, $4)', [req.body.eng, req.body.rus, req.body.img, req.body.audio])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.get('/groups', async (req, res) => {
    try {
        const data = await db.any('SELECT * FROM word_groups');
        return res.status(200).send(data)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.delete('/groups', jsonParser, async (req, res) => {
    try {
        await db.none('DELETE FROM word_groups WHERE id = $1', [req.body.id])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.put('/groups', jsonParser, async (req, res) => {
    try {
        await db.none('UPDATE word_groups SET title = $2, title_rus = $3 WHERE id = $1', [req.body.id, req.body.title, req.body.title_rus])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.put('/addWordToGroup', jsonParser, async (req, res) => {
    try {
        await db.none('UPDATE word_groups SET word_ids = word_ids || $2 WHERE id = $1', [req.body.id, req.body.word_id])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.put('/deleteWordFromGroup', jsonParser, async (req, res) => {
    try {
        await db.none('UPDATE word_groups SET word_ids = array_remove(word_ids, $2) WHERE id = $1', [req.body.id, req.body.word_id])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})

        
app.post('/groups', jsonParser, async (req, res) => {
    try {
        if(!req.body.title || !req.body.title_rus){
            throw new Error('Пустые поля в request.body')
        }
        await db.none('INSERT INTO word_groups(title, title_rus) VALUES($1, $2)', [req.body.title, req.body.title_rus])
        return res.sendStatus(200)
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

function falseVariants(vocabular, trueVariant){
    const count = 3 //Может быть в будущем предоставить на выбор клиенту количество вариантов для ответа
    let uniqueSet = new Set();
    uniqueSet.add(trueVariant)
    while(uniqueSet.size <= count){
        const item = vocabular[Math.floor(Math.random() * vocabular.length)]
        uniqueSet.add(item)
    }
    return Array.from(uniqueSet).sort(() => Math.random() - 0.5)
}
app.get('/vocabulary/:id/unlerned/:method/group/:groupId', async (req, res) => {
    try {
        const vocabulary = await db.one('SELECT $1~ FROM user_vocabulary WHERE id_user = $2', [req.params.method, req.params.id]);
        const group = await db.any('SELECT words.id, words.eng, words.rus FROM words LEFT JOIN word_groups ON words.id = ANY(word_groups.word_ids) WHERE word_groups.id = $1', [req.params.groupId]);
        const unlernedGroup = group.filter(el => !vocabulary[req.params.method].includes(el.id))
        const index = Math.floor(Math.random() * unlernedGroup.length)
        const trueVariant = unlernedGroup[index]
        const falseVariant = falseVariants(group, trueVariant)
        return res.status(200).send({trueVariant, falseVariant})
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})


app.put('/vocabulary/:id/:method', jsonParser, async (req, res) => {
    try {
        if(req.body.word_id === 0){
            return res.sendStatus(200)
        }
        const methods = ['russian', 'english', 'spelling', 'auding']
        const method = req.params.method
        if(!methods.includes(method)) throw new Error('Неверный url')
        await db.none('UPDATE user_vocabulary SET $1~ = $1~ || $2 WHERE id_user = $3', [req.params.method, req.body.word_id, req.params.id])
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.put('/vocabulary/wrong', jsonParser, async (req, res) => {
    try {
        return res.sendStatus(200)
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.listen(3002, ()=>{
    console.log('Сервер ожидает запросов...')
})