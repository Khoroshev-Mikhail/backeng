const Router = require('express')
const UserController = require("../controllers/UserController.js");
const routerUser = new Router();

routerUser.post('/auth', UserController.auth)
routerUser.post('/authByRefreshToken', UserController.authByRefreshToken)
routerUser.post('/refreshToken', UserController.refreshToken)
routerUser.get('/logout/:id', UserController.logout)
routerUser.get('/:id', UserController.getData)

module.exports = routerUser;