const express = require('express');
const router = express.Router();
const { create, list, read, remove } = require('../controllers/category');

const { requireSignin, adminMiddleWare } = require('../controllers/auth');

router.post('/category',  requireSignin, adminMiddleWare, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleWare, remove);

module.exports = router;
