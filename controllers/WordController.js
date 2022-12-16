const db = require("../db");
const WordService = require("../services/WordService");

class WordController {
    async getAll (req, res){
        try {
            const data = await WordService.getAll()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async searchWords (req, res){
        try {
            const data = await WordService.searchWords(req.body.str)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getOne (req, res){
        try {
            const data = await WordService.getOne(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async add (req, res){
        try {
            const data = await WordService.add(req.body.eng, req.body.rus, req.files.img, req.files.audio)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async update (req, res){
        try {
            const data = await WordService.update(req.body.id, req.body.eng, req.body.rus, req.files?.img || undefined, req.files?.audio || undefined)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async updateText (req, res){
        try {
            const data = await WordService.updateText(req.params.id, req.body.eng, req.body.rus)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async delete (req, res){
        try {
            await WordService.delete(req.body.id)
            return res.sendStatus(204)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllGroupsIncludesWord (req, res){
        try {
            const data = WordService.getAllGroupsIncludesWord(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new WordController();