const db = require("../db");

class Words {
    async getAllWords (req, res, next){
        try {
            const data = await db.any('SELECT * FROM words');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
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
    async update (req, res, next){
        try {
            //Либо переписать это чтобы в postgress удалялось каскадом из массива idшник слова
            const { id } = await db.one('DELETE FROM words WHERE id = $1 RETURNING id', [req.body.id])
            await db.none('UPDATE word_groups SET word_ids = array_remove(word_ids, $2) WHERE id = $1', [req.body.id, id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async delete (req, res, next){
        try {
            await db.none('DELETE FROM words WHERE id = $1', [req.body.id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllGroupsIncludesWord (req, res, next){
        try {
            const groups = await db.any('SELECT * FROM word_groups WHERE $1 = ANY(word_ids)', [req.params.id]);
            return res.status(200).send(groups)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllWordsByGroup (req, res, next){
        try {
            const data = await db.any('SELECT words.id, words.eng, words.rus FROM words LEFT JOIN word_groups ON words.id = ANY(word_groups.word_ids) WHERE word_groups.id = $1', [req.params.id]);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new Words()