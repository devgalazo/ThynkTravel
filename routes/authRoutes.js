const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');


//Rotas de authentificação
router.post('/cadastrar', authController.cadastrar);
router.post('/login', authController.login);
router.post('/google', authController.loginComGoogle);
router.get("/voos", authController.buscarVoos);

module.exports = router;
