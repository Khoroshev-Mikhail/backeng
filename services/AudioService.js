const db = require("../db");
//Не проверял все ендпоинты
class AudioService {
    async getAll (){
        return await db.manyOrNone('SELECT * FROM audios WHERE is_global = true');
    }
    async getAllNoGlobal (){
        return await db.manyOrNone('SELECT * FROM audios WHERE is_global <> true');
    }
    async getOne (id){
        if(!id) {
            throw new Error('Не указан id аудио.')
        }
        const data = await db.one('SELECT * FROM audios WHERE id = $1', [id]);
        const content_references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [id]);
        return {...data, content_references}

    }
    async add (title, img, audio_description){
        if(!title | !img | !audio_description) {
            throw new Error('Получены не все необходимые параметры аудио.')
        }
        const { id } = await db.one('INSERT INTO audios(title, img, audio_description) VALUES ($1, $2, $3) RETURNING id', [title, img, audio_description])
        return await db.one('SELECT * FROM audios WHERE id = $1', [id])
    }
    async update (title, img, audio_description, id){
        if(!title | !img | !audio_description | !id) {
            throw new Error('Получены не все параметры аудио.')
        }
        await db.none('UPDATE audios SET title = $1, img = $2, audio_description = $3 WHERE id = $4', [title, img, audio_description, id]);
        return await db.one('SELECT * FROM audios WHERE id = $1', [id])
    }
    async updateWithoutImg (title, audio_description, id){
        if(!title | !audio_description | !id) {
            throw new Error('Получены не все параметры аудио.')
        }
        await db.none('UPDATE audios SET title = $1, audio_description = $2 WHERE id = $3', [title, audio_description, id]);
        return await db.one('SELECT * FROM audios WHERE id = $1', [id])
    }
    async delete (id){
        if(!id) {
            throw new Error('Не указан id аудио.')
        }
        await db.none('DELETE FROM audios WHERE id = $1', [id]);
        return await db.none('SELECT * FROM audios WHERE id = $1', [id]);
    }
    async getAllTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM audios WHERE is_global = true');
        return data
    }
    async getAllNoGlobalTitles (){
        const data = await db.manyOrNone('SELECT id, title, img FROM audios WHERE is_global <> true');
        return data
    }
    async getAllTitlesWithRefs (){
        const data = await db.manyOrNone('SELECT id, title, img, id_group FROM audios LEFT JOIN content_references ON id = id_audio AND is_global = true');
        return data
    }
    async getReferences (id){
        if(!id) {
            throw new Error('Не указан id аудио.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_audio = $1', [id]);
        if(references === null){
            return null
        }
        const { id_group, id_text, id_audio, id_video } = references
        const group = id_group ? await db.oneOrNone('SELECT id, title, title_rus, img FROM word_groups WHERE id = $1', [id_group]) : null;
        const text = id_text ? await db.oneOrNone('SELECT id, title img FROM texts WHERE id = $1', [id_text]) : null;
        const audio = id_audio ? await db.oneOrNone('SELECT id, title img FROM audios WHERE id = $1', [id_audio]) : null;
        const video = id_video ? await db.oneOrNone('SELECT id, title img FROM videos WHERE id = $1', [id_video]) : null;
        return { group, text, audio, video }
    }
};

module.exports = new AudioService();