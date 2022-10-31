const jwt = require('jsonwebtoken');
const db = require('../db');

class Token{
    generateTokens(payload){
        const acessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            acessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken){
       try{
            const token = await db.one('SELECT * FROM user_tokens WHERE id_user = $1', [userId]);
       }catch(e){

       }
            
    }
}
module.exports = new Token()