const { Router } = require('express');
const { verifyEmailExists, authenticateToken } = require('./authMiddleware.js');
const { login, logout, register } = require('./authController.js');
const { createUser } = require('./userController.js')

const router = Router();

router.post('/register', createUser, register); // NOT TESTED YET
router.post('/login', verifyEmailExists, login);
router.post('/logout', authenticateToken, logout);

module.exports = router;