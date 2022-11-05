const db = require("../db");

class Vocabulary {
    static async getUserVocabulary (req, res, next){
        try {
            const data = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [req.params.id]);
            console.log(data)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async getSpellVocabulary (req, res, next){
        try {
            const vocabulary = await db.one('SELECT spelling FROM user_vocabulary WHERE id_user = $1', [req.params.id]);
            const group = await db.any('SELECT words.id, words.eng, words.rus, words.img, words.audio FROM words LEFT JOIN word_groups ON words.id = ANY(word_groups.word_ids) WHERE word_groups.id = $1', [req.params.groupId]);
            const unlernedGroup = group.filter(el => !vocabulary.spelling.includes(el.id) && el.rus && el.eng)
            if(unlernedGroup.length !== 0){
                const index = Math.floor(Math.random() * unlernedGroup.length)
                const trueVariant = unlernedGroup[index]
                return res.status(200).send(trueVariant)
            }
            return res.status(204).send('the end')
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async getVocabularyByMethod (req, res, next){
        function falseVariants(vocabular, trueVariant){
            const count = vocabular.length - 1 <= 3 ? vocabular.length - 1 : 3 //Может быть в будущем предоставить на выбор клиенту количество вариантов для ответа
            let uniqueSet = new Set();
            uniqueSet.add(trueVariant)
            while(uniqueSet.size <= count){
                const item = vocabular[Math.floor(Math.random() * vocabular.length)]
                if(item.eng && item.rus){
                    uniqueSet.add(item)
                }
            }
            return Array.from(uniqueSet).sort(() => Math.random() - 0.5)
        }
        try {
            const vocabulary = await db.one('SELECT $1~ FROM user_vocabulary WHERE id_user = $2', [req.params.method, req.params.id]);
            const group = await db.any('SELECT words.id, words.eng, words.rus, words.img, words.audio FROM words LEFT JOIN word_groups ON words.id = ANY(word_groups.word_ids) WHERE word_groups.id = $1', [req.params.groupId]);
            const unlernedGroup = group.filter(el => !vocabulary[req.params.method].includes(el.id) && el.rus && el.eng)
            if(unlernedGroup.length !== 0){
                const index = Math.floor(Math.random() * unlernedGroup.length)
                const trueVariant = unlernedGroup[index]
                const falseVariant = falseVariants(group, trueVariant)
                return res.status(200).send({trueVariant, falseVariant})
            }
            return res.status(204).send('the end')
            
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    static async update (req, res, next){
        try {
            if(!req.body.word_id || !req.body.userId){
                return res.sendStatus(400)
            }
            const methods = ['russian', 'english', 'spelling', 'auding']
            const method = req.params.method
            if(!methods.includes(method)){ 
                throw new Error('Неверный url')
            }
            await db.none('UPDATE user_vocabulary SET $1~ = $1~ || $2 WHERE id_user = $3', [req.params.method, req.body.word_id, req.params.id])
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
}

module.exports = Vocabulary