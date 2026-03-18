const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');

router.post('/watch', interactionController.watchMovie);
router.post('/like', interactionController.likeMovie);
router.get('/recommend/:userId', interactionController.getRecommendations);

module.exports = router;
