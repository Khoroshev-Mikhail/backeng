const Router = require('express')
const TextController = require("../controllers/TextController.js");
const routerText = new Router();

routerText.get('/', TextController.getAll)
routerText.get('/titles', TextController.getAllTitles)
routerText.post('/', TextController.add)
routerText.put('/', TextController.update)
routerText.delete('/', TextController.delete)

routerText.get('/no-global', TextController.getAllNoGlobal)
routerText.get('/no-global/titles', TextController.getAllNoGlobalTitles)

routerText.get('/:id/references', TextController.getReferences)
routerText.get('/:id', TextController.getOne)
routerText.get('/:id/ref-group-id', TextController.getRefGroupId)

module.exports = routerText;