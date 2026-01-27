const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/user/:userId', favoriteController.getUserFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/user/:userId/novel/:novelId', favoriteController.removeFavorite);

module.exports = router;
