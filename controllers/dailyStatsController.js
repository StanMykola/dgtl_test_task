const { getCSVFilesLogData } = require('../helpers/CSVHelpers');
const { getDateArrayBetween } = require('../helpers/dateHelpers');

exports.getDailyStatsFromRange = async (req, res, next) => {
    try {
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const logData = [];

        if (!regex.test(dateFrom)) {
            throw new Error(
                'Something went wrong, please check the date from (example: 2023-12-07)'
            );
        }

        if (!regex.test(dateTo)) {
            throw new Error(
                'Something went wrong, please check the date to (example: 2023-12-07)'
            );
        }

        const dateList = getDateArrayBetween(new Date(dateFrom), new Date(dateTo));

        for (const date of dateList) {
            const fileData = await getCSVFilesLogData(date);

            if (!fileData.length) {
                logData.push({
                    day: date,
                });
            } else {
                logData.push(...fileData);
            }
        }

        const groupedData = logData.reduce(function (stats, log) {
            if (!stats[log.day]) {
                stats[log.day] = {
                    date: log.day,
                    clicks: parseInt(log.ad_click) || 0,
                    views: parseInt(log.view) || 0,
                    uniqueSessions: [],
                };

                if (log.session) {
                    stats[log.day].uniqueSessions.push(log.session);
                }
            } else {
                stats[log.day].clicks += parseInt(log.ad_click);
                stats[log.day].views += parseInt(log.view);

                if (stats[log.day].uniqueSessions.indexOf(log.session) === -1) {
                    stats[log.day].uniqueSessions.push(log.session);
                }
            }

            return stats;
        }, {});

        const dailyStats = Object.keys(groupedData).map((elem) => {
            return {
                date: groupedData[elem].date,
                clicks: groupedData[elem].clicks,
                views: groupedData[elem].views,
                uniqueSessions: groupedData[elem].uniqueSessions.length,
            };
        });

        res.json(dailyStats);
    } catch (error) {
        next(error);
    }
};
