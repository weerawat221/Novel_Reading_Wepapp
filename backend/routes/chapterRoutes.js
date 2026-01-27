const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Author = 2, Admin = 1
const authorAndAdmin = [authorizeRole([1, 2])];

// Public
router.get('/', chapterController.getAllChapters);
router.get('/:id', chapterController.getChapterById);

// Author & Admin
router.post('/', authenticateToken, authorAndAdmin, chapterController.createChapter);
router.put('/:id', authenticateToken, authorAndAdmin, chapterController.updateChapter);
router.delete('/:id', authenticateToken, authorAndAdmin, chapterController.deleteChapter);

module.exports = router;
