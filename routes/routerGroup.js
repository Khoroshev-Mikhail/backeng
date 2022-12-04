const Router = require('express')
const GroupController = require("../controllers/GroupController.js");
const routerGroup = new Router();

routerGroup.get('/', GroupController.getAll);
routerGroup.get('/titles', GroupController.getAllTitles);
routerGroup.post('/', GroupController.add);
routerGroup.put('/', GroupController.update);
routerGroup.delete('/', GroupController.delete);

routerGroup.get('/no-global', GroupController.getAllNoGlobal);
routerGroup.get('/no-global/title', GroupController.getAllNoGlobalTitles);
routerGroup.put('/add-word', GroupController.addWordToGroup);
routerGroup.put('/delete-word', GroupController.deleteWordFromGroup);

routerGroup.get('/:id/references', GroupController.getReferences);
routerGroup.get('/:id/id-references', GroupController.getIdReferences);
routerGroup.get('/:id', GroupController.getOne);

module.exports = routerGroup;