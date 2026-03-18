const { getSession } = require('../config/db');

const initDb = async () => {
    const session = getSession();
    try {
        await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
        await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE');
        console.log('Database constraints initialized');
    } catch (error) {
        console.error('Error initializing constraints:', error);
    } finally {
        await session.close();
    }
};

module.exports = initDb;
