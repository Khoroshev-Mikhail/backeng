const AudioService = require('../services/AudioService')
const Content_ReferencesService = require('../services/Content_ReferencesService')

class AudioController {
    async getAll (_, res){
        try {
            const data = await AudioService.getAll()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllNoGlobal (_, res){
        try {
            const data = await AudioService.getAllNoGlobal()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getOne (req, res){
        try {
            const data = await AudioService.getOne(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async add (req, res){
        try {
            await AudioService.add(req.body.title, req.body.img, req.body.text_body)
            return res.sendStatus(200)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async update (req, res){
        try {
            const data = await AudioService.update(req.body.title, req.body.img, req.body.text_body, req.body.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async updateWithoutImg (req, res){
        try {
            const data = await AudioService.updateWithoutImg(req.body.title, req.body.text_body, req.body.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async delete (req, res){
        try {
            await AudioService.delete(req.body.id)
            return res.sendStatus(204)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllTitles (_, res){
        try {
            const data = await AudioService.getAllTitles()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllNoGlobalTitles (_, res){
        try {
            const data = await AudioService.getAllNoGlobalTitles()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllTitlesWithRefs (_, res){
        try {
            const data = await AudioService.getAllTitlesWithRefs()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getReferences (req, res){
        try {
            const data = await Content_ReferencesService.getReferences(req.params.id, 'id_audio');
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }    
}

module.exports = new AudioController();