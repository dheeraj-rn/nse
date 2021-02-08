const { Container } = require('typedi');
const moment = require('moment');
const Fs = require('fs')
const Path = require('path')
const Axios = require('axios');
const csv = require('csvtojson');
const extract = require('extract-zip')

module.exports = class NseService {
    constructor() {
        this.stocks = Container.get('stocks');
        this.downloadPath = Path.resolve('downloads');
    }

    async generateDownloadURL() {
        try {
            let year = moment().utcOffset("Asia/Kolkata").year()
            let month = moment().utcOffset("Asia/Kolkata").format('MMM').toUpperCase()
            let date = moment().utcOffset("Asia/Kolkata").format('DDMMMYYYY').toUpperCase()
            let downloadURL = `https://archives.nseindia.com/content/historical/EQUITIES/${year}/${month}/cm${date}bhav.csv.zip`;
            return downloadURL;
        } catch (error) {
            throw error;
        }
    }

    async downloadZip(url) {
        url = 'https://archives.nseindia.com/content/historical/EQUITIES/2021/FEB/cm05FEB2021bhav.csv.zip';
        return new Promise(async (resolve, reject) => {
            try {
                let response = await Axios.get(
                    url,
                    { responseType: 'stream' }
                );
                let fileName = url.split("/").pop();
                const dir = Path.resolve(this.downloadPath, fileName);
                response.data.pipe(Fs.createWriteStream(dir));
                response.data.on("end", () => {
                    console.log(`${fileName}: Download Completed`);
                    resolve(dir);
                });
            } catch (error) {
                reject(error);
            }
        })
    }

    async extractZip(zipPath) {
        try {
            await extract(zipPath, { dir: this.downloadPath });
            let csvFilePath = zipPath.replace(".zip", "");
            return csvFilePath;
        } catch (err) {
            throw (err);
        }
    }


    async execute() {
        try {
            let downloadUrl = await this.generateDownloadURL();
            let zipPath = await this.downloadZip(downloadUrl);
            let csvPath = await this.extractZip(zipPath);
            const nseJsonData = await csv().fromFile(csvPath);
            let stocksInfo = nseJsonData.map((el) => {
                return {
                    SYMBOL: el.SYMBOL,
                    NAME: '',
                    SERIES: el.SERIES,
                    OPEN: el.OPEN,
                    HIGH: el.HIGH,
                    LOW: el.LOW,
                    CLOSE: el.CLOSE,
                    LAST: el.LAST,
                    PREVCLOSE: el.PREVCLOSE,
                    TOTTRDQTY: el.TOTTRDQTY,
                    TOTTRDVAL: el.TOTTRDVAL,
                    TIMESTAMP: el.TIMESTAMP,
                    TOTALTRADES: el.TOTALTRADES,
                    ISIN: el.ISIN
                }
            });
            let stockPromise = [];
            for (let stock of stocksInfo) {
                let dbdata = this.stocks.upsert(stock);
                stockPromise.push(dbdata);
            }
            let dbResponse = await Promise.all(stockPromise);
            return null;
        } catch (err) {
            return null;
        }

    }
}