const { getSession } = require('../config/db');

const createUser = async (user) => {
    const session = getSession();
    try {
        const result = await session.run(
            `
            MERGE (u:User {email: $email})
            ON CREATE SET u.id = $id, u.name = $name, u.password = $password
            RETURN u
            `,
            user
        );
        return result.records[0].get('u').properties;
    } finally {
        await session.close();
    }
};

const getUserByEmail = async (email) => {
    const session = getSession();
    try {
        const result = await session.run('MATCH (u:User {email: $email}) RETURN u', { email });
        return result.records.length > 0 ? result.records[0].get('u').properties : null;
    } finally {
        await session.close();
    }
};

const getUserById = async (id) => {
    const session = getSession();
    try {
        const result = await session.run('MATCH (u:User {id: $id}) RETURN u', { id });
        return result.records.length > 0 ? result.records[0].get('u').properties : null;
    } finally {
        await session.close();
    }
};

const setOTP = async (email, otp) => {
    const session = getSession();
    try {
        await session.run(
            'MATCH (u:User {email: $email}) SET u.otp = $otp, u.otpExpires = $expires',
            { email, otp, expires: Date.now() + 600000 } // 10 minutes
        );
    } finally {
        await session.close();
    }
};

const resetPassword = async (email, otp, newPassword) => {
    const session = getSession();
    try {
        const result = await session.run(
            'MATCH (u:User {email: $email}) WHERE u.otp = $otp AND u.otpExpires > $now SET u.password = $newPassword, u.otp = null, u.otpExpires = null RETURN u',
            { email, otp, newPassword, now: Date.now() }
        );
        return result.records.length > 0;
    } finally {
        await session.close();
    }
};

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    setOTP,
    resetPassword
};
