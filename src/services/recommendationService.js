const { getSession } = require('../config/db');

const getRecommendations = async (userId) => {
    const session = getSession();
    try {
        const result = await session.run(
            `
            MATCH (u:User {id: $userId})-[:WATCHED]->(m:Movie)-[:IN_GENRE]->(g:Genre)
            MATCH (other:Movie)-[:IN_GENRE]->(g)
            WHERE NOT (u)-[:WATCHED]->(other)
            RETURN DISTINCT other
            LIMIT 10
            `,
            { userId }
        );
        return result.records.map(record => record.get('other').properties);
    } finally {
        await session.close();
    }
};

module.exports = {
    getRecommendations
};
