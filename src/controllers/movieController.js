const movieService = require('../services/movieService');

const seedMovies = async (req, res) => {
    try {
        const count = await movieService.fetchAndStoreMovies();
        res.status(200).json({ message: `Successfully seeded ${count} movies.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getExternalMovies = async (req, res) => {
    try {
        const movies = await movieService.getExternalMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    seedMovies,
    getExternalMovies,
    getAllMovies,
    getMovieById
};
