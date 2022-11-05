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
        try{
            const data = await db.one('SELECT * FROM users WHERE user_login = $1 AND user_password = $2', [req.body.login, req.body.pwd]);
            data.jwt = 'token dlya ara'
            return res.status(200).send(data)
        } catch(e){
            return res.status(500).send(e.message)
        }
    }
    static async registration (req, res, next){
        try{
            
        } catch(e){
            
        }
    }
    async logout (req, res, next){
        try{
            
        } catch(e){
            
        }
    }
}

module.exports = UserModel