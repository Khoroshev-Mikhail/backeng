const Router = require('express')
const VocabularyController = require("../controllers/VocabularyController.js");
const routerVocabulary = new Router();

routerVocabulary.get('/:id/unlerned/spelling/group/:groupId', VocabularyController.getSpellVocabulary)
routerVocabulary.get('/:id/unlerned/:method/group/:groupId', VocabularyController.getVocabularyByMethod)
routerVocabulary.put('/:id/:method', VocabularyController.update)
routerVocabulary.get('/groups/:groupId/progress/:userId', VocabularyController.getGroupProgress)
routerVocabulary.get('/:id', VocabularyController.getUserVocabulary)

module.exports = routerVocabulary;