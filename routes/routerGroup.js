const Router = require('express')
const GroupController = require("../controllers/GroupController.js");
const routerGroup = new Router();

routerGroup.get('/', GroupController.getAllGroups);
routerGroup.post('/', GroupController.add);
routerGroup.put('/', GroupController.update);
routerGroup.delete('/', GroupController.delete);
routerGroup.get('/global', GroupController.getAllGlobalGroups);
routerGroup.get('/global/onlyTitles', GroupController.getAllGlobalGroupsTitles);
routerGroup.put('/addWordToGroup', GroupController.addWordToGroup);
routerGroup.put('/deleteWordFromGroup', GroupController.deleteWordFromGroup);
routerGroup.get('/:id/references', GroupController.getReferences);
routerGroup.get('/:id', GroupController.findOne);

module.exports = routerGroup;