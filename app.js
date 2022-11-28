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
const TOKEN_LIFE_TIME = 1;
const REFRESH_LIFE_HOURS = 100;

const groupsModel = require("./models/groupsModel.js");
const wordsModel = require("./models/wordsModel.js");
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
    console.log('headers^^ ', req.headers.authorization)
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
app.post('/checkToken', (req, res) => {
    try {
        console.log('/checkToken', req.user)
        if(req.body.token){
            const headersToken = req.body.token
            jwt.verify(headersToken, SECRET, async function(err, decoded) {
                if(err || !decoded){
                    return res.sendStatus(500)
                }
                const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
                if(user.token === headersToken && new Date().getMinutes() - new Date(decoded.date).getMinutes() < TOKEN_LIFE_TIME){
                    return res.sendStatus(200)
                }else{
                    return res.sendStatus(401)
                }
            });
        } else{
            return res.sendStatus(500)
        }
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.post('/refreshToken', (req, res) => {
    try {
        if(req.body.token && req.body.refreshToken){
            const headersRefresh = req.body.refreshToken
            jwt.verify(headersRefresh, SECRET_REFRESH, async function(err, decoded) {
                if(err || !decoded){
                    return res.sendStatus(500)
                }
                const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
                if(user.refresh_token === headersRefresh && new Date().getHours() - new Date(decoded.date).getHours() < REFRESH_LIFE_HOURS){
                    const date = new Date()
                    const newToken = jwt.sign({ id: user.id, date }, SECRET);  
                    const newRefresh = jwt.sign({ id: user.id, date }, SECRET_REFRESH);   
                    await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [newToken, newRefresh, user.id])
                    return res.status(200).send({newToken, newRefresh, jwtExpire: date})
                }else{
                    return res.sendStatus(426)
                }
                
            });
        } else{
            return res.sendStatus(400)
        }
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
app.get('/checkAuth', (req, res) => {
    try {
        console.log('/checkauth', req.user)
        if(!req.user){
            return res.sendStatus(401)
        }
        return res.status(200).json('Авторизирован!')
    } 
    catch(e) {
        return res.status(500).send(e.message)
    }
})
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
app.post('/auth', userModel.auth)
app.post('/authByRefreshToken', userModel.authByRefreshToken)
app.get('/logout/:id', userModel.logout)

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
