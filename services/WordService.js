const db = require("../db");

class WordService {
    async getAll (){
        return await db.manyOrNone('SELECT * FROM words');
    }
    async add (req, res, next){
        try {
            const { id } = await db.one('INSERT INTO words(eng, rus) VALUES($1, $2) RETURNING id', [req.body.eng, req.body.rus])
            if(req.files.img !== undefined){
                const img = req.files.img;
                const imgTypes = ['image/jpeg', 'image/png', 'image/jp2']
                if(!imgTypes.includes(img.mimetype)){
                    throw new Error('Не подходящий формат изображения')
                }
                const imgFileName = id + '_' + req.body.eng + img.name.match(/\.[\w\d]+$/i)[0]
                const imgUploadPath = __dirname + '/../public/img/' + imgFileName;
                await img.mv(imgUploadPath, function(err) {
                    if (err) {
                        throw new Error('Ошибка при загрузке изображения.')
                    }
                });
                await db.none('UPDATE words SET img = $2 WHERE id = $1', [id, imgFileName])
            }
            if(req.files.audio !== undefined){
                const audio = req.files.audio;
                const audioTypes = ['audio/wave', 'audio/wav', 'audio/x-wav', 'audio/x-pn-wav', 'audio/webm', 'audio/ogg']
                if(!audioTypes.includes(audio.mimetype)){
                    throw new Error('Не подходящий формат аудио')
                }
                const audioFileName = id + '_' + req.body.eng + audio.name.match(/\.[\w\d]+$/i)[0]
                const audioUploadPath = __dirname + '/../public/audio/' + audioFileName;
                await audio.mv(audioUploadPath, function(err) {
                    if (err) {
                        throw new Error('Ошибка при загрузке аудио файла.')
                    }
                });
                await db.none('UPDATE words SET audio = $2 WHERE id = $1', [id, audioFileName])
            }
            return res.status(200).send(`${id}`)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async update (id, rus, eng){
        // Здесь добавь обновление с картинками
        return 1

    }
    async updateText (id, eng, rus){
        if(!id || !eng || !rus){
            throw new Error('Не указан id или текстовые значения.')
        }
        await db.none('UPDATE words SET eng = $1, rus = $2 WHERE id = $3', [eng, rus, id])
        return await db.one('SELECT * FROM words WHERE id = $1', [id])

    }
    async delete (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        await db.none('DELETE FROM words WHERE id = $1', [id])

        // Может добавить условие там где есть?
        await db.none('UPDATE user_vocabulary SET english = array_remove(english, $1)', [id])
        await db.none('UPDATE user_vocabulary SET russian = array_remove(russian, $1)', [id])
        await db.none('UPDATE user_vocabulary SET spelling = array_remove(spelling, $1)', [id])
        await db.none('UPDATE user_vocabulary SET auding = array_remove(auding, $1)', [id])
        // Удалить из всех групп
        await db.none('UPDATE groups SET words = array_remove(words, $1)', [id])

        return await db.none('SELECT id FROM words WHERE id = $1', [id])
    }
    async getAllGroupsIncludesWord (id){
        if(!id){
            throw new Error('Не указан id.')
        }
        return await db.manyOrNone('SELECT * FROM groups WHERE $1 = ANY(words)', [id]);
    }
};

module.exports = new WordService();