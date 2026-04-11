require('dotenv').config();
const http = require('http');
const https = require('https');

const RENDER_BASE = 'https://netflix-clone-1fki.onrender.com';

function apiCall(path, method, body) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${RENDER_BASE}${path}`);
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: method || 'GET',
            headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) }
        };
        const req = https.request(options, res => {
            let out = '';
            res.on('data', c => out += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(out) }); }
                catch { resolve({ status: res.statusCode, body: out }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function run() {
    console.log('Testing Live Render Backend:', RENDER_BASE);

    // 1. Create 3 new live users
    const users = [];
    for (let i = 1; i <= 3; i++) {
        const email = `live_user_${i}_${Date.now()}@netflix.com`;
        const res = await apiCall('/api/auth/signup', 'POST', { email, password: 'pass123' });
        if (res.status === 201) {
            console.log(`✅ Created user: ${email} [id=${res.body.id}]`);
            users.push(res.body);
        } else {
            console.error(`❌ Failed to create user ${i}:`, res.body);
        }
    }

    // 2. Fetch movies from live API
    const movieRes = await apiCall('/api/movies', 'GET');
    const movies = movieRes.body;
    if (!movies || movies.length === 0) {
        console.log('No movies found, seeding first...');
        await apiCall('/api/movies/seed', 'POST');
    }
    const movieIds = (movies || []).slice(0, 5).map(m => m.id);
    console.log(`✅ Found ${movieIds.length} movies on live DB`);

    // 3. Create WATCHED + LIKED relationships
    for (const user of users) {
        if (!user.id) continue;
        for (let j = 0; j < 2; j++) {
            const movieId = movieIds[Math.floor(Math.random() * movieIds.length)];
            const watchRes = await apiCall(`/api/watch`, 'POST', { userId: user.id, movieId });
            console.log(`✅ ${user.email} WATCHED movie ${movieId} [${watchRes.status}]`);
            if (Math.random() > 0.5) {
                const likeRes = await apiCall(`/api/like`, 'POST', { userId: user.id, movieId });
                console.log(`✅ ${user.email} LIKED movie ${movieId} [${likeRes.status}]`);
            }
        }
    }

    console.log('\n🎉 Live end-to-end test complete! Check Neo4j Aura to see users, movies, and relationships.');
}

run().catch(console.error);
