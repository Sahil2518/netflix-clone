const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./services/initDbService');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/movies', movieRoutes);
app.use('/api/auth', userRoutes);
app.use('/api', interactionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, async () => {
    await initDb();
    console.log(`Server running on port ${PORT}`);
});
