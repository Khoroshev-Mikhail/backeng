const db = require("../db");
class GroupService {
    async getAll (){
        return await db.manyOrNone('SELECT * FROM word_groups WHERE is_global = true');
    }
    async getOne (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        const data = await db.one('SELECT id, title, title_rus, word_ids FROM word_groups WHERE id = $1', [id]);
        const content_references = await db.oneOrNone('SELECT * FROM content_references WHERE id_group = $1', [id]);
        return { ...data, content_references }
    }
    async add (title, title_rus){
        if(!title || !title_rus) {
            throw new Error('Не указаны заголовки.')
        }
        //перепиши чтобы группа которую заинсертили - она и возвращалась из бд
        const { id } = await db.one('INSERT INTO word_groups(title, title_rus, word_ids) VALUES($1, $2, array[]::integer[]) RETURNING id', [title, title_rus])
        return await db.one('SELECT * FROM word_groups WHERE id = $1', [id]) //или можно использовать метод этого же класса?
    }

    async delete (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        return await db.none('DELETE FROM word_groups WHERE id = $1', [id])
    }
    async update (id, title, title_rus){
        if(!id || !title || !title_rus) {
            throw new Error('Не указан id группы либо заголовок.')
        }
        await db.none('UPDATE word_groups SET title = $2, title_rus = $3 WHERE id = $1', [id, title, title_rus])
        const data = await db.one('SELECT * FROM word_group WHERE id = $1', [id])
        return data
        
    }
    async addWordToGroup (id, id_word){
        if(!id || !id_word) {
            throw new Error('Не указан id группы или слова.')
        }
        await db.none('UPDATE word_groups SET word_ids = word_ids || $2 WHERE id = $1', [id, word_id])
        return await db.one('SELECT word_ids FROM word_groups WHERE id = $1', [id])
    }
    async deleteWordFromGroup (id, id_word){
        if(!id || !id_word) {
            throw new Error('Не указан id группы или слова.')
        }
        await db.none('UPDATE word_groups SET word_ids = array_remove(word_ids, $2) WHERE id = $1', [id, word_id])
        return await db.one('SELECT word_ids FROM word_groups WHERE id = $1', [id])

    }
    async getAllNoGlobal (){
        return await db.any('SELECT * FROM word_groups WHERE is_global <> true');
    }
    async getAllNoGlobalTitles (){
        return await db.any('SELECT id, title, title_rus FROM word_groups WHERE is_global <> true');
    }
    async getAllTitles (){
        return await db.any('SELECT id, title, title_rus FROM word_groups WHERE is_global = true');
    }
    async getReferences (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_group = $1', [id]);
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
            throw new Error('Не указан id группы.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_group = $1', [id]);
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

module.exports = new GroupService();