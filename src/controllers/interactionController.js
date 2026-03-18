const interactionService = require('../services/interactionService');
const recommendationService = require('../services/recommendationService');

const watchMovie = async (req, res) => {
    try {
        await interactionService.watchMovie(req.body.userId, req.body.movieId);
        res.status(200).json({ message: 'Movie marked as watched' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likeMovie = async (req, res) => {
    try {
        await interactionService.likeMovie(req.body.userId, req.body.movieId);
        res.status(200).json({ message: 'Movie liked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const recommendations = await recommendationService.getRecommendations(req.params.userId);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    watchMovie,
    likeMovie,
    getRecommendations
};
