const axios = require('axios');
const { getSession } = require('../config/db');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchAndStoreMovies = async () => {
    const session = getSession();
    try {
        let movies;
        if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === 'your_tmdb_api_key') {
            console.log('Using mock movie data for seeding...');
            movies = [
                { id: 1, title: 'Inception', overview: 'A thief who steals corporate secrets through the use of dream-sharing technology...', vote_average: 8.8, poster_path: '/edvB2sL3BD79URbi67vPzS1pSfj.jpg', genres: ['Action', 'Sci-Fi'], trailer: 'YoHD9XEInc0', poster: 'assets/posters/inception.png' },
                { id: 2, title: 'The Matrix', overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality...', vote_average: 8.7, poster_path: '/f89U3Y9L9uS0SsyZ6A0Oc9Ym.jpg', genres: ['Action', 'Sci-Fi'], trailer: 'vKQi3bBA1y8', poster: 'assets/posters/matrix.png' },
                { id: 3, title: 'Interstellar', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival...', vote_average: 8.6, poster_path: '/gEU2Q634tU7I6qzH2vSbeH9vPao.jpg', genres: ['Adventure', 'Drama', 'Sci-Fi'], trailer: 'UDVtMYqUAyw', poster: 'assets/posters/interstellar.png' }
            ];
        } else {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                    page: 1
                }
            });
            movies = response.data.results;
        }

        for (const movie of movies) {
            // Use trailer from mock data if present, otherwise look it up or use default
            let trailerKey = movie.trailer || 'YoHD9XEInc0';

            if (!movie.trailer && process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key') {
                try {
                    const videoResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
                        params: { api_key: process.env.TMDB_API_KEY }
                    });
                    const trailer = videoResponse.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                    if (trailer) trailerKey = trailer.key;
                } catch (err) {
                    console.error(`Error fetching trailer for ${movie.title}:`, err.message);
                }
            }

            await session.run(
                `
                MERGE (m:Movie {id: $id})
                SET m.title = $title,
                    m.overview = $overview,
                    m.rating = $rating,
                    m.poster = $poster,
                    m.trailer = $trailer
                WITH m
                UNWIND $genres as genreName
                MERGE (g:Genre {name: genreName})
                MERGE (m)-[:IN_GENRE]->(g)
                `,
                {
                    id: movie.id.toString(),
                    title: movie.title,
                    overview: movie.overview,
                    rating: movie.vote_average,
                    poster: movie.poster ||
                        (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === 'your_tmdb_api_key'
                            ? `assets/posters/${movie.title.toLowerCase()}.png`
                            : (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)),
                    genres: movie.genres || [],
                    trailer: trailerKey
                }
            );
        }
        return movies.length;
    } finally {
        await session.close();
    }
};

const getExternalMovies = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
            api_key: process.env.TMDB_API_KEY,
            language: 'en-US',
            page: 1
        }
    });
    return response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        rating: movie.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    }));
};

const getAllMovies = async () => {
    const session = getSession();
    try {
        const result = await session.run('MATCH (m:Movie) RETURN m');
        return result.records.map(record => record.get('m').properties);
    } finally {
        await session.close();
    }
};

const getMovieById = async (id) => {
    const session = getSession();
    try {
        const result = await session.run('MATCH (m:Movie {id: $id}) RETURN m', { id });
        return result.records.length > 0 ? result.records[0].get('m').properties : null;
    } finally {
        await session.close();
    }
};

module.exports = {
    fetchAndStoreMovies,
    getExternalMovies,
    getAllMovies,
    getMovieById
};
