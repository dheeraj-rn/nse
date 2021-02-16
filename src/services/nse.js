const { Container } = require('typedi');
const moment = require('moment');
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const csv = require('csvtojson');
const cheerio = require('cheerio');
const extract = require('extract-zip');

module.exports = class NseService {
  constructor() {
    this.stocks = Container.get('stocks');
    this.downloadPath = Path.resolve('downloads');
    this.RedisClient = Container.get('RedisClient');
  }

  async generateDownloadURL() {
    try {
      const year = moment().utcOffset('Asia/Kolkata').year();
      const month = moment().utcOffset('Asia/Kolkata').format('MMM').toUpperCase();
      const date = moment().utcOffset('Asia/Kolkata').format('DDMMMYYYY').toUpperCase();
      const downloadURL = `https://archives.nseindia.com/content/historical/EQUITIES/${year}/${month}/cm${date}bhav.csv.zip`;
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }

  async downloadZip(url) {
    // url = 'https://archives.nseindia.com/content/historical/EQUITIES/2021/FEB/cm05FEB2021bhav.csv.zip';
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Axios.get(
          url,
          { responseType: 'stream' },
        );
        const fileName = url.split('/').pop();
        const dir = Path.resolve(this.downloadPath, fileName);
        response.data.pipe(Fs.createWriteStream(dir));
        response.data.on('end', () => {
          console.log(`${fileName}: Download Completed`);
          resolve(dir);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async extractZip(zipPath) {
    try {
      await extract(zipPath, { dir: this.downloadPath });
      const csvFilePath = zipPath.replace('.zip', '');
      return csvFilePath;
    } catch (err) {
      throw (err);
    }
  }

  htmlParse(data) {
    const $ = cheerio.load(data);
    const newHtmlData = $('#content').html();
    const $2 = cheerio.load(newHtmlData);
    let rawData = [];
    $2('td').each(function (i, e) {
      rawData[i] = $(this).text().trim().includes('\n') ? $(this).text().trim().split('\n')
        .map((el) => el.trim())
        .join(' ') : $(this).text().trim();
    });
    rawData = rawData.filter((el) => el !== '');
    const nseSymbolInfo = {};
    for (let i = 0; i < rawData.length - 2; i += 3) {
      nseSymbolInfo[rawData[i + 1].trim()] = rawData[i + 2].trim();
    }
    return nseSymbolInfo;
  }

  async scrap() {
    const url = 'https://www1.nseindia.com/education/content/reports/eq_research_reports_listed.htm';
    const response = await Axios.get(url);
    const { data } = response;
    const url2 = 'https://www1.nseindia.com/education/content/reports/eq_rrl_m2z.htm';
    const response2 = await Axios.get(url2);
    const data2 = response2.data;
    const json1 = this.htmlParse(data);
    const json2 = this.htmlParse(data2);
    const finalOut = { ...json1, ...json2 };
    return finalOut;
  }

  async execute() {
    try {
      const downloadUrl = await this.generateDownloadURL();
      const zipPath = await this.downloadZip(downloadUrl);
      const csvPath = await this.extractZip(zipPath);
      const nseJsonData = await csv().fromFile(csvPath);
      const symbolInfo = await this.scrap();
      const stocksInfo = nseJsonData.map((el) => ({
        SYMBOL: el.SYMBOL,
        NAME: symbolInfo[el.SYMBOL] ? symbolInfo[el.SYMBOL] : '',
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
        ISIN: el.ISIN,
      }));
      const stockPromise = [];
      for (const stock of stocksInfo) {
        const dbdata = this.stocks.upsert(stock);
        stockPromise.push(dbdata);
      }
      const dbResponse = await Promise.all(stockPromise);
      if (dbResponse) {
        await this.RedisClient.flushall();
        console.log('Flushing Redis');
      }
      return null;
    } catch (err) {
      return null;
    }
  }
};
