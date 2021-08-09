const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/users');

router.get('/dashboard', adminControllers.getAdminDashboard);

router.get('/dashboard/details/:id', adminControllers.getUserDetails);

router.get('/dashboard/edit/:id', adminControllers.getEditUser);

router.post('/dashboard/update/:id', adminControllers.putEditUser);

router.get('/dashboard/delete/:id', adminControllers.getDeleteUser);

module.exports = router;
