const Router = require('express')
const VocabularyController = require("../controllers/VocabularyController.js");
const routerVocabulary = new Router();

routerVocabulary.get('/:id/unlerned/spelling/group/:groupId', VocabularyController.getSpellVocabulary)
routerVocabulary.get('/:id/unlerned/:method/group/:groupId', VocabularyController.getVocabularyByMethod)
routerVocabulary.put('/:id/:method', VocabularyController.update)
routerVocabulary.get('/delete/:id', VocabularyController.delete)
routerVocabulary.get('/:id', VocabularyController.getOne)

module.exports = routerVocabulary;