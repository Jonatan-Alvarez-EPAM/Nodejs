const fs = require('fs');

const csv = require('csvtojson');

const csvFilePath = './csv/file.csv';

const readStream = fs.createReadStream(csvFilePath);

const writeStream = fs.createWriteStream('./new_file.txt');

readStream.pipe(csv()).pipe(writeStream);

readStream.on('error', function (err) {
    console.log('READ ERROR:', err);
});

writeStream.on('error', function (err) {
    console.log('WRITE ERROR:', err);
});
