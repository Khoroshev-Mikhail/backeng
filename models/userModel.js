const db = require("../db");
var jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

class UserModel {
    static async getData (req, res, next){
        try {
            //Здесь проверка JWT
            const data = await db.one('SELECT * FROM users WHERE id = $1', [req.params.id]);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async auth (req, res, next){
        try {
            const { password, login } = req.body
            const user = await db.one('SELECT id, user_login FROM users WHERE user_login = $1 AND user_password = $2', [login, password]);
            const date = new Date();
            const token = jwt.sign({ id: user.id, date }, SECRET);   
            const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);   
            await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id])
            return res.status(200).send({id: user.id, user_login: user.user_login, token, refresh_token, jwt_expire: date});
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async authByRefreshToken (req, res, next){
        try {
            if(req.body.refreshToken){
                const headersRefresh = req.body.refreshToken
                jwt.verify(headersRefresh, SECRET_REFRESH, async function(err, decoded) {
                    if(err || !decoded){
                        return res.sendStatus(500)
                    }
                    const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
                    console.log('ara', user.refresh_token, headersRefresh)
                    if(user.refresh_token === headersRefresh && new Date().getHours() - new Date(decoded.date).getHours() < REFRESH_TOKEN_LIFE_TIME){
                        const date = new Date()
                        const token = jwt.sign({ id: user.id, date }, SECRET);   
                        const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);    
                        await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id])
                        return res.status(200).send({id: user.id, user_login: user.user_login, token, refresh_token, jwt_expire: date})
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
    }
    static async refreshToken (req, res, next){
        try {
            if(req.body.refreshToken){
                const headersRefresh = req.body.refreshToken
                jwt.verify(headersRefresh, SECRET_REFRESH, async function(err, decoded) {
                    if(err || !decoded){
                        return res.sendStatus(500)
                    }
                    const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
                    if(user.refresh_token === headersRefresh && new Date().getHours() - new Date(decoded.date).getHours() < REFRESH_TOKEN_LIFE_TIME){
                        const date = new Date()
                        const token = jwt.sign({ id: user.id, date }, SECRET);  
                        const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);   
                        await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id])
                        return res.status(200).send({token, refresh_token, jwt_expire: date})
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
    }
    static async registration (req, res, next){
        try{
            
        } catch(e){
            
        }
    }
    static async logout (req, res, next){
        //Добавить проверку на соотетветствие id
        try {
            // console.log('/logout', req.user)
            await db.none('UPDATE users SET token = $1, refresh_token = $1 WHERE id = $2', [null, req.params.id])
            return res.status(200).send({id: 0, login: 'unknown', token: null, refreshToken: null});
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = UserModel