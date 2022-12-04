const Router = require('express')
const WordController = require("../controllers/WordController.js");
const routerWord = new Router();

routerWord.get('/', WordController.getAll)
routerWord.post('/', WordController.add)
routerWord.put('/', WordController.update)
routerWord.delete('/', WordController.delete)
routerWord.get('/:id/groups', WordController.getAllGroupsIncludesWord)
routerWord.get('/group/:id', WordController.getAllWordsFromGroup)

module.exports = routerWord;