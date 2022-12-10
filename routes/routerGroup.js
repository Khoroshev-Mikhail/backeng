const Router = require('express')
const GroupController = require("../controllers/GroupController.js");
const routerGroup = new Router();

routerGroup.get('/', GroupController.getAll);
routerGroup.get('/titles', GroupController.getAllTitles);
routerGroup.get('/:id/words', GroupController.getAllWordsFromGroup);
routerGroup.post('/', GroupController.add);
routerGroup.put('/', GroupController.update);
routerGroup.delete('/', GroupController.delete);

routerGroup.get('/no-global', GroupController.getAllNoGlobal);
routerGroup.get('/no-global/title', GroupController.getAllNoGlobalTitles);
routerGroup.put('/add-word', GroupController.addWordToGroup);
routerGroup.put('/delete-word', GroupController.deleteWordFromGroup);

routerGroup.get('/:id/references', GroupController.getReferences);
routerGroup.get('/:id', GroupController.getOne); //Здесь наверно тоже нужно условие чтобы не возвращать группы с пустым массивом, а на клиенте обрабатывать варианты когда ничего не приходит, особенно касается случаев с content_references

module.exports = routerGroup;