const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.resolve('data', 'events');

const readCSVFile = async (fileName) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(path.join(DATA_PATH, fileName))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const readDirectory = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
            }

            resolve(files);
        });
    });
};

exports.getCSVFilesLogData = async (date) => {
    const logData = [];
    const filesList = await readDirectory(DATA_PATH);
    const filesListByDate = filesList.filter((file) => file.includes(date));

    for (const file of filesListByDate) {
        const data = await readCSVFile(file);
        logData.push(...data);
    }

    return logData;
};
