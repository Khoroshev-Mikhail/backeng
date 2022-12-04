const db = require("../db");
const WordService = require("../services/WordService");

class WordController {
    async getAll (req, res, next){
        try {
            const data = await WordService.getAll()
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
            const data = await WordService.update()
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async updateText (req, res, next){
        try {
            const data = await WordService.updateText(req.params.id, req.body.eng, req.body.rus)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async delete (req, res, next){
        try {
            const data = await WordService.delete(req.body.id)
            console.log('data', data)
            return res.sendStatus(200) //может 204?
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllGroupsIncludesWord (req, res, next){
        try {
            const data = WordService.getAllGroupsIncludesWord(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllWordsFromGroup (req, res, next){
        try {
            const data = WordService.getAllWordsFromGroup(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new WordController();