const db = require("../db");

class Groups {
    static async getAllGroups (req, res, next){
        try {
            const data = await db.any('SELECT * FROM word_groups');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async findOne (req, res, next){
        try {
            const data = await db.any('SELECT * FROM word_groups WHERE id = $1', [req.params.id]);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async add (req, res, next){
        try {
            if(!req.body.title || !req.body.title_rus){
                throw new Error('Пустые поля в request.body')
            }
            await db.none('INSERT INTO word_groups(title, title_rus, word_ids) VALUES($1, $2, array[]::integer[])', [req.body.title, req.body.title_rus])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }

    static async delete (req, res, next){
        try {
            await db.none('DELETE FROM word_groups WHERE id = $1', [req.body.id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async update (req, res, next){
        try {
            await db.none('UPDATE word_groups SET title = $2, title_rus = $3 WHERE id = $1', [req.body.id, req.body.title, req.body.title_rus])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async addWordToGroup (req, res, next){
        try {
            await db.none('UPDATE word_groups SET word_ids = word_ids || $2 WHERE id = $1', [req.body.id, req.body.word_id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async deleteWordFromGroup (req, res, next){
        try {
            await db.none('UPDATE word_groups SET word_ids = array_remove(word_ids, $2) WHERE id = $1', [req.body.id, req.body.word_id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async getAllGlobalGroups (req, res, next){
        try {
            const data = await db.any('SELECT * FROM word_groups WHERE is_global = true');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async getAllGlobalGroupsTitles (req, res, next){
        try {
            const data = await db.any('SELECT id, title, title_rus FROM word_groups WHERE is_global = true');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async getReferences (req, res, next){
        try {
            const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_group = $1', [req.params.id]);
            if(references === null){
                return res.status(200).send(null)
            }
            const { id_text, id_audio, id_video } = references
            const text = id_text ? await db.oneOrNone('SELECT * FROM texts WHERE id = $1', [id_text]) : null;
            const audio = id_audio ? await db.oneOrNone('SELECT * FROM audios WHERE id = $1', [id_audio]) : null;
            const video = id_video ? await db.oneOrNone('SELECT * FROM videos WHERE id = $1', [id_video]) : null;
            return res.status(200).send({text, audio, video})
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = Groups