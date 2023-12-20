const { getCSVFilesLogData } = require('../helpers/CSVHelpers');

exports.getCampaignCTRsByDate = async (req, res, next) => {
    try {
        const date = req.query.date;
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (!regex.test(date)) {
            throw new Error(
                'Something went wrong, please check the date (example: 2023-12-07)'
            );
        }

        const fileData = await getCSVFilesLogData(date);

        if (!fileData.length) {
            throw new Error('The log file is absent');
        }

        const groupedData = fileData.reduce(function (campaign, log) {
            if (!campaign[log.campaign]) {
                campaign[log.campaign] = {
                    adClick: parseInt(log.ad_click),
                    sessions: [log.session],
                };
            } else {
                campaign[log.campaign].adClick += parseInt(log.ad_click);

                if (campaign[log.campaign].sessions.indexOf(log.session) === -1) {
                    campaign[log.campaign].sessions.push(log.session);
                }
            }

            return campaign;
        }, {});

        const CTRsByDate = Object.keys(groupedData).map((elem) => {
            const adClick = groupedData[elem].adClick;
            const sessionCount = groupedData[elem].sessions.length;
            const ctr = parseFloat(adClick / sessionCount).toFixed(1);

            return {
                camapign: elem,
                ctr: ctr,
            };
        });

        res.json(CTRsByDate);
    } catch (error) {
        next(error);
    }
};
