const express = require('express');

const campaignCTRRouter = require('./routes/campaignCTRRoutes');
const dailyStatsRouter = require('./routes/dailyStatsRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/campaignCTR', campaignCTRRouter);
app.use('/api/v1/dailyStats', dailyStatsRouter);

app.all('*', (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
