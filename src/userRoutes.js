// accept http requests, interact with user model, and send responses back to client

const { Router } = require('express');
const router = Router();
const userController = require('./userController.js');
const userMiddleware = require('./userMiddleware.js');

router.post("/", userController.createUser);
router.get("/", userController.findAllUsers);
router.get("/:id", userMiddleware.checkUserExists, userController.findUserById);
router.patch("/:id", userMiddleware.checkUserExists, userController.findUserByIdAndUpdate);
router.delete("/:id", userMiddleware.checkUserExists, userController.findUserByIdAndDelete);

module.exports = router;