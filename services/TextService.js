const db = require("../db");

class TextService {
    async getAll (){
        return await db.manyOrNone('SELECT * FROM texts WHERE is_global = true');
    }
    async getAllNoGlobal (){
        return await db.manyOrNone('SELECT * FROM texts WHERE is_global <> true');
    }
    async getOne (id){
        if(!id) {
            throw new Error('Не указан id текста.')
        }
        const data = await db.one('SELECT * FROM texts WHERE id = $1', [id]);
        return data

    }
    async add (title, img, text_body){
        if(!title | !img | !text_body) {
            throw new Error('Получены не все необходимые параметры текста.')
        }
        const { id } = await db.one('INSERT INTO texts(title, img, text_body) VALUES ($1, $2, $3) RETURNING id', [title, img, text_body])
        return await db.one('SELECT * FROM texts WHERE id = $1', [id])
    }
    async update (title, img, text_body, id){
        if(!title | !img | !text_body | !id) {
            throw new Error('Получены не все параметры текста.')
        }
        await db.none('UPDATE texts SET title = $1, img = $2, text_body = $3 WHERE id = $4', [title, img, text_body, id]);
        return await db.one('SELECT * FROM texts WHERE id = $1', [id])
    }
    async updateWithoutImg (title, text_body, id){
        if(!title | !text_body | !id) {
            throw new Error('Получены не все параметры текста.')
        }
        await db.none('UPDATE texts SET title = $1, text_body = $2 WHERE id = $3', [title, text_body, id]);
        return await db.one('SELECT * FROM texts WHERE id = $1', [id])
    }
    async delete (id){
        if(!id) {
            throw new Error('Не указан id текста.')
        }
        await db.none('DELETE FROM texts WHERE id = $1', [id]);
        return await db.none('SELECT * FROM texts WHERE id = $1', [id]);
    }
    async getAllTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM texts WHERE is_global = true AND visible = true');
        return data
    }
    async getAllNoGlobalTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM texts WHERE is_global <> true');
        return data
    }
    async getRefGroupId (id){
        const data = await db.oneOrNone('SELECT id_group FROM content_references WHERE id_text = $1', [id])
        return data
    }
};

module.exports = new TextService();