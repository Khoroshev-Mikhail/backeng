const Router = require('express')
const AudioController = require("../controllers/AudioController.js");
const routerAudio = new Router();

routerAudio.get('/', AudioController.getAll)
routerAudio.get('/titles', AudioController.getAllTitles)
routerAudio.post('/', AudioController.add)
routerAudio.put('/', AudioController.update)
routerAudio.delete('/', AudioController.delete)

routerAudio.get('/no-global', AudioController.getAllNoGlobal)
routerAudio.get('/no-global/titles', AudioController.getAllNoGlobalTitles)
routerAudio.get('/titles-with-refs', AudioController.getAllTitlesWithRefs) 

routerAudio.get('/:id/references', AudioController.getReferences)
routerAudio.get('/:id', AudioController.getOne)

module.exports = routerAudio;