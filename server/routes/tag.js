const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleWare } = require('../controllers/auth');
const { create, list, read, remove } = require('../controllers/tag');


// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/tag',  requireSignin, adminMiddleWare, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, adminMiddleWare, remove);

module.exports = router; 
