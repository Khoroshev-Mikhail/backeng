require('dotenv').config()
const express = require("express");
const app = express()
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');
const db = require("./db");
const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const PORT = process.env.PORT || 3002
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

const groupsModel = require("./models/groupsModel.js");
const wordsModel = require("./models/wordsModel.js");
const textsModel = require('./models/textsModel.js');
const vocabularyModel = require("./models/vocabularyModel.js");
const userModel = require('./models/userModel.js');

app.use(fileUpload({ safeFileNames: /[^a-zа-яё\d\.]/ui, limits: { fileSize: 1 * 1024 * 1024 } }));
app.use(express.static('public'));
app.use(cookieParser())
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
app.use(async function(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.split(' ').length == 3 && req.headers.authorization !== 'Bearer unknown unknown'){
        const headers = req.headers.authorization.split(' ')
        const headersToken = headers[1]
        const headersRefresh = headers[2]
        if(!headersToken || !headersRefresh){
            req.user = null;
            next()
        }
        jwt.verify(headersToken, SECRET, async function(err, decoded) {
            if(err || !decoded){
                req.user = null;
                next();
            }else{
                const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
                if(user.token === headersToken && new Date().getMinutes() - new Date(decoded.date).getMinutes() < TOKEN_LIFE_TIME){
                    req.user = user;
                    next()
                }else{
                    req.user = null;
                    next();
                }
            }
        });
    } else{
        req.user = null;
        next();
    }
});

// app.get('/get-cookie', (req, res) => {
//     console.log('Cookie: ', req.cookies)
//     res.send('Get Cookie')
//   })
  
// app.get('/set-cookie', (req, res) => {
//     res.cookie('555', '555')
//     res.send('Set Cookie')
// })

app.get('/', (req, res) => res.status(200).send(`Сервер ожидает запросов на порте ${PORT}`))

app.get('/words', wordsModel.getAllWords)
app.get('/word/:id/groups', wordsModel.getAllGroupsIncludesWord)
app.get('/words/group/:id', wordsModel.getAllWordsByGroup)
app.post('/words', wordsModel.add)
app.put('/words', wordsModel.update)
app.delete('/words', wordsModel.delete)

app.get('/groups', groupsModel.getAllGroups)
app.get('/groups/global', groupsModel.getAllGlobalGroups)
app.get('/groups/global/onlyTitles', groupsModel.getAllGlobalGroupsTitles)
app.post('/groups', groupsModel.add)
app.put('/groups', groupsModel.update)
app.delete('/groups', groupsModel.delete)
app.put('/groups/addWordToGroup', groupsModel.addWordToGroup)
app.put('/groups/deleteWordFromGroup', groupsModel.deleteWordFromGroup)
app.get('/groups/:id/references', groupsModel.getReferences)
app.get('/groups/:id', groupsModel.findOne)

app.get('/vocabulary/:id', vocabularyModel.getUserVocabulary)
app.get('/vocabulary/:id/unlerned/spelling/group/:groupId', vocabularyModel.getSpellVocabulary)
app.get('/vocabulary/:id/unlerned/:method/group/:groupId', vocabularyModel.getVocabularyByMethod)
app.put('/vocabulary/:id/:method', vocabularyModel.update)
app.get('/vocabulary/groups/:groupId/progress/:userId', vocabularyModel.getGroupProgress)

app.get('/user/:id', userModel.getData)
app.post('/auth', userModel.auth)
app.post('/authByRefreshToken', userModel.authByRefreshToken)
app.post('/refreshToken', userModel.refreshToken)
app.get('/logout/:id', userModel.logout)

app.get('/texts', textsModel.getAll)
app.get('/texts/global/titles', textsModel.getAllGlobalTextsTitles)
app.post('/texts', textsModel.add)
app.put('/texts', textsModel.update)
app.delete('/texts', textsModel.delete)
app.get('/texts/titles', textsModel.getAllTitles)
app.get('/texts/:id/references', textsModel.getReferences)
app.get('/texts/:id', textsModel.findOne)

// Аудио добавить для референсес ендпоинт
// Видео добавить для референсес ендпоинт

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
