const db = require("../db");
const UserService = require('../services/UserService')
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

class UserController {
    async getOne (req, res){
        try {
            const data = await UserService.getOne(req.params.id);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async auth (req, res){
        try {
            const data = await UserService.auth(req.body.login, req.body.password)
            return res.status(200).send(data);
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }

    async authByRefreshToken (req, res){
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
    async refreshToken (req, res){
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
    async registration (req, res){
        try{
            const data = await UserService.registration(req.body.login, req.body.password, req.body.name, req.body.email, req.body.birth)
            return res.status(200).send(data)
        } catch(e){
            return res.status(500).send(e.message)
        }
    }
    async logout (req, res){
        try {
            const data = await UserService.logout(req.params.id)
            return res.status(200).send(data);
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new UserController()