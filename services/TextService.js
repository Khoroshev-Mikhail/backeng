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
        const content_references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [id]);
        return {...data, content_references}

    }
    async add (title, img, text_body){
        if(!title | !img | !text_body) {
            throw new Error('Получены не все необходимые параметры текста.')
        }
        await db.none('INSERT INTO texts(title, img, text_body) VALUES ($1, $2, $3)', [title, img, text_body])
        return 1
    }
    async update (title, img, text_body, id){
        if(!title | !img | !text_body | !id) {
            throw new Error('Получены не все параметры текста.')
        }
        await db.none('UPDATE texts SET title = $1, img = $2, text_body = $3 WHERE id = $4', [title, img, text_body, id]);
        return 1
    }
    async updateWithoutImg (title, text_body, id){
        if(!title | !text_body | !id) {
            throw new Error('Получены не все параметры текста.')
        }
        await db.none('UPDATE texts SET title = $1, text_body = $2 WHERE id = $3', [title, text_body, id]);
        return 1
    }
    async delete (id){
        if(!id) {
            throw new Error('Не указан id текста.')
        }
        await db.none('DELETE FROM texts WHERE id = $1', [id]);
        return 1
    }
    async getAllTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM texts WHERE is_global = true');
        return data
    }
    async getAllNoGlobalTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM texts WHERE is_global <> true');
        return data
    }
    async getAllTitlesWithRefs (){
        const data = await db.manyOrNone('SELECT id, title, img, id_group FROM texts LEFT JOIN content_references ON id = id_text AND is_global = true');
        return data
    }
    async getReferences (id){
        if(!id) {
            throw new Error('Не указан id текста.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [id]);
        if(references === null){
            return null
        }
        const { id_group, id_text, id_audio, id_video } = references
        const group = id_text ? await db.oneOrNone('SELECT * FROM word_groups WHERE id = $1', [id_group]) : null;
        const text = id_text ? await db.oneOrNone('SELECT * FROM texts WHERE id = $1', [id_text]) : null;
        const audio = id_audio ? await db.oneOrNone('SELECT * FROM audios WHERE id = $1', [id_audio]) : null;
        const video = id_video ? await db.oneOrNone('SELECT * FROM videos WHERE id = $1', [id_video]) : null;
        return { group, text, audio, video }
    }
    async getIdReferences (id){
        if(!id) {
            throw new Error('Не указан id текста.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [id]);
        if(references === null){
            return null
        }
        const { id_group, id_text, id_audio, id_video } = references
        const group = id_text ? await db.oneOrNone('SELECT id FROM word_groups WHERE id = $1', [id_group]) : null;
        const text = id_text ? await db.oneOrNone('SELECT id FROM texts WHERE id = $1', [id_text]) : null;
        const audio = id_audio ? await db.oneOrNone('SELECT id FROM audios WHERE id = $1', [id_audio]) : null;
        const video = id_video ? await db.oneOrNone('SELECT id FROM videos WHERE id = $1', [id_video]) : null;
        return { group, text, audio, video }
    }
};

module.exports = new TextService();