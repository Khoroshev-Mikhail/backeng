require('dotenv').config()
const express = require("express");
const app = express()
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
const groupsModel = require("./models/groupsModel.js");
const wordsModel = require("./models/wordsModel.js");
const vocabularyModel = require("./models/vocabularyModel.js");
const userModel = require('./models/userModel.js');
const PORT = process.env.PORT || 3002

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(function(req, res, next) {
    if(req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'){
        console.log(req.headers.authorization)
    }
    next();
});
app.use(fileUpload({
    safeFileNames: /[^a-zа-яё\d\.]/ui,
    limits: { fileSize: 1 * 1024 * 1024 },
}));

app.use(express.static('public'));
app.use(cookieParser())
app.use(express.json())
app.get('/', (req, res) => res.status(200).send(`Сервер ожидает запросов на порте ${PORT}`))

app.get('/words', wordsModel.getAllWords)
app.get('/word/:id/groups', wordsModel.getAllGroupsIncludesWord)
app.get('/words/group/:id', wordsModel.getAllWordsByGroup)
app.post('/words', wordsModel.add)
app.put('/words', wordsModel.update)
app.delete('/words', wordsModel.delete)

app.get('/groups', groupsModel.getAllGroups)
app.post('/groups', groupsModel.add)
app.put('/groups', groupsModel.update)
app.delete('/groups', groupsModel.delete)
app.put('/groups/addWordToGroup', groupsModel.addWordToGroup)
app.put('/groups/deleteWordFromGroup', groupsModel.deleteWordFromGroup)

app.get('/vocabulary/:id', vocabularyModel.getUserVocabulary)
app.get('/vocabulary/:id/unlerned/spelling/group/:groupId', vocabularyModel.getSpellVocabulary)
app.get('/vocabulary/:id/unlerned/:method/group/:groupId', vocabularyModel.getVocabularyByMethod)
app.put('/vocabulary/:id/:method', vocabularyModel.update)
app.get('/vocabulary/groups/:groupId/progress/:userId', groupsModel.getGroupProgress)

app.get('/user/:id', userModel.getData)
app.post('/user/auth', userModel.auth)

app.use(function(error, req, res, next) {
    if(error){
        return res.status(500).send('Something is broke')
    }
    next()
});
const start = async () => {
    try{
        app.listen(PORT, ()=>{
            console.log(`Сервер ожидает запросов на порте ${PORT}`)
        })
    }catch(e){
        console.error(e)
    }
}
start()
