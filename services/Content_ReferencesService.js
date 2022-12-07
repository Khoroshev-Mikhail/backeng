const db = require("../db");
class Content_ReferencesService {
    async getReferences (id, content){
        if(!id || !content ) {
            throw new Error('Не указан id сущности.')
        }
        if(! ['id_group', 'id_text', 'id_audio', 'id_video'].includes(content)){
            throw new Error('Несуществующая сущность.')
        }
        const references = await db.oneOrNone('SELECT * FROM content_references WHERE $1~ = $2', [content, id]);
        if(references === null){
            return null
        }
        const { id_group, id_text, id_audio, id_video } = references
        const group = id_group ? await db.oneOrNone('SELECT id, title, title_rus, img FROM groups WHERE id = $1', [id_group]) : null;
        const text = id_text ? await db.oneOrNone('SELECT id, title, title_rus, img FROM texts WHERE id = $1', [id_text]) : null;
        const audio = id_audio ? await db.oneOrNone('SELECT id, title, title_rus, img FROM audios WHERE id = $1', [id_audio]) : null;
        const video = id_video ? await db.oneOrNone('SELECT id, title, title_rus, img FROM videos WHERE id = $1', [id_video]) : null;
        return { group, text, audio, video }
    }
    async getRefGroupId (id, content){
        if(!id || !content ) {
            throw new Error('Не указан id сущности.')
        }
        if(! ['id_group', 'id_text', 'id_audio', 'id_video'].includes(content)){
            throw new Error('Несуществующая сущность.')
        }
        return await db.oneOrNone('SELECT id_group FROM content_references WHERE $1~ = $2', [content, id]);
    }
};

module.exports = new Content_ReferencesService();