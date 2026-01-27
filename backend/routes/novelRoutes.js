const express = require('express');
const router = express.Router();
const novelController = require('../controllers/novelController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Author = 2, User = 3
const authorAndAdmin = [authorizeRole([1, 2])];

// Public
router.get('/', novelController.getAllNovels);
router.get('/:id', novelController.getNovelById);

// Author & Admin
router.post('/', authenticateToken, authorAndAdmin, upload.single('coverImage'), novelController.createNovel);
router.put('/:id', authenticateToken, authorAndAdmin, upload.single('coverImage'), novelController.updateNovel);
router.delete('/:id', authenticateToken, authorAndAdmin, novelController.deleteNovel);

module.exports = router;
