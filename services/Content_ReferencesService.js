const db = require("../db");
class Content_ReferencesService {
    async getGroupReferences (){
        if(!id) {
            throw new Error('Не указан id сущности.')
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

};

module.exports = new Content_ReferencesService();