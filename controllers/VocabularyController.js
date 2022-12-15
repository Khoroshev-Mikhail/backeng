const VocabularyService = require('../services/VocabularyService.js');

class VocabularyController {
    async getOne(req, res){
        try {
            const data = await VocabularyService.getOne(req.params.id);
            return res.status(200).send(data)
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
    async update (req, res){
        try {
            if(!req.user || req.user && req.user.id != req.params.id){
                return res.status(401).send('Не авторизирован.')
            }
            const data = await VocabularyService.update(req.params.id, req.body.word_id, req.params.method)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    
    async delete (req, res){
        try {
            if(!req.user || req.user && req.user.id != req.params.id){
                return res.status(401).send('Не авторизирован.')
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