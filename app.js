import * as dotenv from 'dotenv'
dotenv.config()
// const fs = require("fs");
import { unlink, access, constants } from 'node:fs/promises';

const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const PORT = process.env.PORT || 3002
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

import express from 'express'
const app = express()
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import * as jwt from 'jsonwebtoken'
import db from './db'
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
    if(req.headers.authorization && req.headers.authorization.split(' ').length >= 2 && req.headers.authorization !== 'Bearer unknown'){
        const headers = req.headers.authorization.split(' ')
        const headersToken = headers[1]
        if(!headersToken ){
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
app.get('/test', async (req, res) => {
    console.log(await access(__dirname + '/public/img/51_ccc.jpeg', constants.F_OK))
    return res.status(200).send('asd')
})

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
