const db = require("../db");

class Content_ReferencesController {
    async getReferences (req, res, next){
        try {
            // const data =
            // return res.status(200).send(data)
        } 
        catch(e) {
            return res.status(500).send(e.message)
        }
    }
}

module.exports = new Content_ReferencesController();