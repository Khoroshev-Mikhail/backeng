const db = require("../db");
const GroupService = require('../services/GroupService.js')
class GroupController {
    async getAll (req, res, next){
        try {
            const data = await GroupService.getAll();
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllTitles (req, res, next){
        try {
            const data = await GroupService.getAllTitles()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getOne (req, res, next){
        try {
            const data = await GroupService.getOne(req.params.id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async add (req, res, next){
        try {
            //Send a new added group
            const data = await GroupService.add(req.body.title, req.body.title_rus)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }

    async delete (req, res){
        try {
            await GroupService.delete(req.body.id)
            return res.sendStatus(204)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    // почемуто при апдейте нарушилась сортировка групп при переименовании upd может на клиенте
    async update (req, res){
        try {
            const data = await GroupService.update(req.body.id, req.body.title, req.body.title_rus)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async addWordToGroup (req, res){
        try {
            const data = await GroupService.addWordToGroup(req.body.id, req.body.word_id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async deleteWordFromGroup (req, res){
        try {
            const data = await GroupService.deleteWordFromGroup(req.body.id, req.body.word_id)
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllNoGlobal (req, res){
        try {
            const data = await GroupService.getAllNoGlobal()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getAllNoGlobalTitles (req, res){
        try {
            const data = await GroupService.getAllNoGlobalTitles()
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }

    async getReferences (req, res){
        try {
            const data = await GroupService.getReferences(req.params.id);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
    async getIdReferences (req, res){
        try {
            const data = await GroupService.getIdReferences(req.params.id);
            return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new GroupController()