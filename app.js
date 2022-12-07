require('dotenv').config()

const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const PORT = process.env.PORT || 3002
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

const express = require("express");
const app = express()
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const db = require("./db");
const routerGroup = require('./routes/routerGroup.js')
const routerText = require('./routes/routerText.js')
const routerWord = require('./routes/routerWord.js');
const routerUser = require('./routes/routerUser.js');
const routerAudio = require('./routes/routerAudio.js');
const routerVocabulary = require('./routes/routerVocabulary.js');

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

app.get('/', (req, res) => res.status(200).send(`Сервер ожидает запросов на порте ${PORT}`))

app.use('/groups', routerGroup)
app.use('/texts', routerText)
app.use('/words', routerWord)
app.use('/user', routerUser)
app.use('/audios', routerAudio)
app.use('/vocabulary', routerVocabulary)


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
