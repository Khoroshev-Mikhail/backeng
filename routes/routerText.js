const Router = require('express')
const TextController = require("../controllers/TextController.js");
const routerText = new Router();

routerText.get('/', TextController.getAll)
routerText.post('/', TextController.add)
routerText.put('/', TextController.update)
routerText.delete('/', TextController.delete)
routerText.get('/titles', TextController.getAllTitles)
routerText.get('/global/titles', TextController.getAllGlobalTextsTitles)
routerText.get('/:id/references', TextController.getReferences)
routerText.get('/:id', TextController.findOne)

module.exports = routerText;