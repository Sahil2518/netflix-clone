const { getSession } = require('../config/db');

const watchMovie = async (userId, movieId) => {
    const session = getSession();
    try {
        await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (m:Movie {id: $movieId})
            MERGE (u)-[r:WATCHED]->(m)
            SET r.timestamp = timestamp()
            RETURN r
            `,
            { userId, movieId }
        );
    } finally {
        await session.close();
    }
};

const likeMovie = async (userId, movieId) => {
    const session = getSession();
    try {
        await session.run(
            `
            MATCH (u:User {id: $userId})
            MATCH (m:Movie {id: $movieId})
            MERGE (u)-[r:LIKED]->(m)
            SET r.timestamp = timestamp()
            RETURN r
            `,
            { userId, movieId }
        );
    } finally {
        await session.close();
    }
};

module.exports = {
    watchMovie,
    likeMovie
};
