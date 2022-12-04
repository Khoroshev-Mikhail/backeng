const db = require("../db");
var jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_ACCESS_SECRET
const SECRET_REFRESH = process.env.JWT_REFRESH_SECRET
const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME_MINUTES;
const REFRESH_TOKEN_LIFE_TIME = process.env.REFRESH_TOKEN_LIFE_TIME_HOURS;

class UserService {
    async getOne (id){
        if(!id){
            throw new Error('Не указан id пользователя.')
        }
        return await db.one('SELECT * FROM users WHERE id = $1', [id]);
    }
    async auth (login, password){
        if(!login || !password){
            throw new Error('Не указан пароль или логин.')
        }
        const user = await db.one('SELECT id, user_login FROM users WHERE user_login = $1 AND user_password = $2', [login, password]);
        const date = new Date();
        const token = jwt.sign({ id: user.id, date }, SECRET);   
        const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);   
        await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id])
        return {id: user.id, user_login: user.user_login, token, refresh_token, jwt_expire: date};
    }

    async authByRefreshToken (headersToken){
        if(! headersToken){
            throw new Error('Не указан токен.')
        }
        jwt.verify(headersToken, SECRET_REFRESH, async function(err, decoded) {
            if(err || !decoded){
                throw new Error('Ошибка декодирования токена.')
            }
            const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
            if(user.refresh_token === headersToken && new Date().getHours() - new Date(decoded.date).getHours() < REFRESH_TOKEN_LIFE_TIME){
                const date = new Date();
                const token = jwt.sign({ id: user.id, date }, SECRET);   
                const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);    
                await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id]);
                return {id: user.id, user_login: user.user_login, token, refresh_token, jwt_expire: date};
            }else {
                return null
            }
        });
    }
    async refreshToken (headersToken){
        if(! headersToken){
            throw new Error('Не указан токен.')
        } 
        jwt.verify(headersToken, SECRET_REFRESH, async function(err, decoded) {
            if(err || !decoded){
                throw new Error('Ошибка декодирования токена.')
            }
            const user = await db.one('SELECT id, user_login, token, refresh_token FROM users WHERE id = $1', [decoded.id]);
            if(user.refresh_token === headersToken && new Date().getHours() - new Date(decoded.date).getHours() < REFRESH_TOKEN_LIFE_TIME){
                const date = new Date()
                const token = jwt.sign({ id: user.id, date }, SECRET);  
                const refresh_token = jwt.sign({ id: user.id, date }, SECRET_REFRESH);   
                await db.none('UPDATE users SET token = $1, refresh_token = $2 WHERE id = $3', [token, refresh_token, user.id])
                return {token, refresh_token, jwt_expire: date}
            }else {
                return null
            }
        });
    }
    async registration (){
        try{
            
        } catch(e){
            
        }
    }
    async logout (id){
        if(!id){
            throw new Error('Не указан id пользователя.')
        }
        await db.none('UPDATE users SET token = $1, refresh_token = $1 WHERE id = $2', [null, id])
        return {id: 0, login: 'unknown', token: null, refreshToken: null};
    }
};

module.exports = new UserService();