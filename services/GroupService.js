const db = require("../db");
class GroupService {
    async getAll (){
        return await db.manyOrNone(`SELECT * FROM groups WHERE is_global = true`);
    }
    async getOne (id){
        if(!id) {
            throw new Error('Не указан id группы.')
        }
        return await db.one('SELECT * FROM groups WHERE id = $1', [id]);
    }

    async getAllWordsFromGroup (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        return await db.manyOrNone('SELECT words.id, words.eng, words.rus, words.audio, words.img FROM words LEFT JOIN groups ON words.id = ANY(groups.words) WHERE groups.id = $1', [id]);
    }
    async getAllWord_idsFromGroup (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        return await db.manyOrNone('SELECT words FROM groups WHERE id = $1', [id]);
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
        return await db.one('SELECT * FROM groups WHERE id = $1', [id])
    }

    async addWordIdToGroup (id, word_id){
        if(!id || !word_id) {
            throw new Error('Не указан id группы или слова.')
        }
        this.checkIncludesIntoGroup(id)
        await db.none('UPDATE groups SET words = words || $2 WHERE id = $1', [id, word_id])
        return await db.one('SELECT words FROM groups WHERE id = $1', [id]) 
    }

    async deleteWordFromGroup (id, word_id){
        if(!id || !word_id) {
            console.log(id, word_id)
            throw new Error('Не указан id группы или слова.')
        }
        this.checkIncludesIntoGroup(id)
        await db.none('UPDATE groups SET words = array_remove(words, $2) WHERE id = $1', [id, word_id])
        return this.getAllWordsFromGroup(id)
    }
    async deleteWordIdFromGroup (id, word_id){
        if(!id || !word_id) {
            throw new Error('Не указан id группы или слова.')
        }
        this.checkIncludesIntoGroup(id)
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
    async checkIncludesIntoGroup (group_id){
        const check =  await db.one('SELECT words FROM groups WHERE id = $1', [group_id])
        check.words.forEach( async (word_id) => {
            const result = await db.oneOrNone('SELECT id FROM words WHERE id = $1', [word_id]);
            if(result === null){
                await this.deleteWordIdFromGroup(group_id, word_id)
            }
        })
    }
};

module.exports = new GroupService();