const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js')
const { requireAuth } = require('../middlewares/authmiddleware.js')

//Protection Routes
router.use('/changepassword', requireAuth)
router.use('/loggeduser', requireAuth)

//Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-link', UserController.sendUserPasswordResetLink)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

//Protected Routes
router.post('/changepassword', UserController.changePassword)
router.get('/loggeduser', UserController.loggedUser)

module.exports = router;