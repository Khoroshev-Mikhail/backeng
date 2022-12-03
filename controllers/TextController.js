const db = require("../db");

class TextController {
    async getAll (req, res, next){
        try {
            const data = await db.any('SELECT * FROM texts');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async findOne (req, res, next){
        try {
            const { id } = req.params
            const data = await db.one('SELECT id, title, img, text_body FROM texts WHERE id = $1', [id]);
            const content_references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [id]);
            return res.status(200).send({...data, content_references})
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async add (req, res, next){
        try {
            const { title, img, text_body } = req.body
            await db.none('INSERT INTO texts(title, img, text_body) VALUES ($1, $2, $3)', [title, img, text_body])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async update (req, res, next){
        try {
            const { title, img, text_body, id } = req.body
            await db.none('UPDATE texts SET title = $1, img = $2, text_body = $3 WHERE id = $4', [title, img, text_body, id]);
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async delete (req, res, next){
        try {
            const { id } = req.body
            await db.none('DELETE FROM texts WHERE id = $1', [id]);
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllGlobalTextsTitles (req, res, next){
        try {
            const data = await db.any('SELECT id, title, img FROM texts'); //Дописать ис глобал тру
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllTitles (req, res, next){
        try {
            const data = await db.manyOrNone('SELECT id, title, img, id_group FROM texts LEFT JOIN content_references ON id = id_text');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getReferences (req, res, next){
        try {
            const references = await db.oneOrNone('SELECT * FROM content_references WHERE id_text = $1', [req.params.id]);
            if(references === null){
                return res.status(200).send(null)
            }
            const { id_group, id_audio, id_video } = references
            const group = id_group ? await db.oneOrNone('SELECT * FROM word_groups WHERE id = $1', [id_group]) : null;
            const audio = id_audio ? await db.oneOrNone('SELECT * FROM audios WHERE id = $1', [id_audio]) : null;
            const video = id_video ? await db.oneOrNone('SELECT * FROM videos WHERE id = $1', [id_video]) : null;
            return res.status(200).send({group, audio, video})
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
}

module.exports = new TextController();