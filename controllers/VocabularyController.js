const db = require("../db");
const VocabularyService = require('../services/VocabularyService.js');

class VocabularyController {
    //при записи слова в вокабуляр надо возвращать новый вокабуляр
    //может быть отдельной строкой для каждого метода и отдельно их и хранить в бд и сторе. Но наверно это имеет смысл делать для оптимизации когда проект уже будет большой и важна будет скорость, пока что можно и так
    async getOne(req, res){
        try {
            const data = await VocabularyService.getOne(req.params.id);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getSpellVocabulary (req, res){
        try {
            const data = await VocabularyService.getSpellVocabulary(req.params.id, req.params.groupId)
            if(! data){
                return res.status(204).send(null)
            }
            return res.status(200).send(data)            
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
    async getGroupProgress (req, res, next){
        try {

            const vocabulary = await db.one('SELECT english, russian, auding, spelling FROM user_vocabulary WHERE id_user = $1', [req.params.userId]);
            const { word_ids: groupWords } = await db.one('SELECT word_ids FROM word_groups WHERE id = $1', [req.params.groupId]);
            const result = {}
            const idsLerned = {}
            for(const key in vocabulary){
                const lerned = groupWords.filter(el => vocabulary[key].includes(el))
                result[key] = Math.round(lerned.length / (groupWords.length) * 100)
                idsLerned[key] = lerned
            }
            const total = []
            for(let key in groupWords){
                const x = groupWords[key]
                if(idsLerned.english.includes(x) && idsLerned.russian.includes(x) && idsLerned.auding.includes(x) && idsLerned.spelling.includes(x)){
                    total.push(x)
                }
            }
            result.total = Math.round(total.length / (groupWords.length) * 100)
            return res.status(200).send(result)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getVocabularyByMethod (req, res){
        try {
            const data = await VocabularyService.getVocabularyByMethod(req.params.id, req.params.method, req.params.groupId)
            if(! data){
                return res.status(204).send(null)
            }
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async update (req, res, next){
        try {
            if(!req.user || req.user && req.user.id != req.params.id){
                throw new Error('Не авторизирован.')
            }
            const data = await VocabularyService.update(req.params.id, req.body.word_id, req.params.method)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
    async delete (req, res, next){
        try {
            if(!req.user || req.user && req.user.id != req.params.id){
                throw new Error('Не авторизирован.')
            }
            const data = await VocabularyService.delete(req.params.id, req.body.word_id, req.params.method)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
}

module.exports = new VocabularyController();