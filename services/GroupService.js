const db = require("../db");
class GroupService {
    async getAll (){
        return await db.manyOrNone(`SELECT * FROM groups WHERE is_global = true`);
    }
    async getOne (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        return await db.one('SELECT id, title, title_rus, words FROM groups WHERE id = $1', [id]);
    }

    async getAllWordsFromGroup (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        return await db.manyOrNone('SELECT words.id, words.eng, words.rus, words.audio, words.img FROM words LEFT JOIN groups ON words.id = ANY(groups.words) WHERE groups.id = $1', [id]);
    }
    async add (title, title_rus){
        if(!title || !title_rus) {
            throw new Error('Не указаны заголовки.')
        }
        //перепиши чтобы группа которую заинсертили - она и возвращалась из бд
        const { id } = await db.one('INSERT INTO groups(title, title_rus, words) VALUES($1, $2, array[]::integer[]) RETURNING id', [title, title_rus])
        return await db.one('SELECT * FROM groups WHERE id = $1', [id]) //или можно использовать метод этого же класса?
    }

    async delete (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        return await db.none('DELETE FROM groups WHERE id = $1', [id])
    }
    async update (id, title, title_rus){
        if(!id || !title || !title_rus) {
            throw new Error('Не указан id группы либо заголовок.')
        }
        await db.none('UPDATE groups SET title = $2, title_rus = $3 WHERE id = $1', [id, title, title_rus])
        const data = await db.one('SELECT * FROM word_group WHERE id = $1', [id])
        return data
        
    }
    async addWordToGroup (id, id_word){
        if(!id || !id_word) {
            throw new Error('Не указан id группы или слова.')
        }
        await db.none('UPDATE groups SET words = words || $2 WHERE id = $1', [id, word_id])
        return await db.one('SELECT words FROM groups WHERE id = $1', [id])
    }
    async deleteWordFromGroup (id, id_word){
        if(!id || !id_word) {
            throw new Error('Не указан id группы или слова.')
        }
        await db.none('UPDATE groups SET words = array_remove(words, $2) WHERE id = $1', [id, word_id])
        return await db.one('SELECT words FROM groups WHERE id = $1', [id])

    }
    async getAllNoGlobal (){
        return await db.any('SELECT * FROM groups WHERE is_global <> true');
    }
    async getAllNoGlobalTitles (){
        return await db.any(`SELECT id, title, title_rus FROM groups WHERE is_global <> true AND words <> '{}'`);
    }
    async getAllTitles (){
        return await db.any(`SELECT id, title, title_rus FROM groups WHERE is_global = true AND words <> '{}'`);
    }

};

module.exports = new GroupService();