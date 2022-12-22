const Router = require('express')
const WordController = require("../controllers/WordController.js");
const routerWord = new Router();

routerWord.get('/', WordController.getAll)
routerWord.post('/search', WordController.searchWords)
routerWord.post('/', WordController.add)
routerWord.put('/', WordController.update)
routerWord.delete('/', WordController.delete)
routerWord.get('/:id/groups', WordController.getAllGroupsIncludesWord)
routerWord.get('/:id', WordController.getOne)

module.exports = routerWord;