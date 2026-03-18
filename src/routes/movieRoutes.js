const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.post('/seed', movieController.seedMovies);
router.get('/external', movieController.getExternalMovies);
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

module.exports = router;
