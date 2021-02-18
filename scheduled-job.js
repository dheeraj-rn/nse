const { Container } = require('typedi');
const moment = require('moment');
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');
const csv = require('csvtojson');
const cheerio = require('cheerio');
const extract = require('extract-zip');
const DependencyInjectorLoader = require('./src/loaders/dependencyInjector');

DependencyInjectorLoader();

const stocks = Container.get('stocks');
const downloadPath = Path.resolve('downloads');
const RedisClient = Container.get('RedisClient');
const AxiosProxyConfig = Container.get('AxiosProxy');
const AxiosConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
    Referer: 'https://www1.nseindia.com/education/content/reports/eq_research_reports_listed.htm',
  },
  proxy: AxiosProxyConfig,
};

async function generateDownloadURL() {
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

async function downloadZip(url) {
  url = 'https://archives.nseindia.com/content/historical/EQUITIES/2021/FEB/cm16FEB2021bhav.csv.zip';
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Axios.get(
        url,
        {
          responseType: 'stream',
        },
        AxiosConfig,
      );
      const fileName = url.split('/').pop();
      const dir = Path.resolve(downloadPath, fileName);
      response.data.pipe(Fs.createWriteStream(dir));
      response.data.on('end', () => {
        console.log(`${fileName}: Download Completed`);
        resolve(dir);
      });
    } catch (error) {
      console.log(error.response.data);
      reject(error);
    }
  });
}

async function extractZip(zipPath) {
  try {
    await extract(zipPath, { dir: downloadPath });
    const csvFilePath = zipPath.replace('.zip', '');
    return csvFilePath;
  } catch (err) {
    throw (err);
  }
}

function htmlParse(data) {
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

async function scrap() {
  const url = 'https://www1.nseindia.com/education/content/reports/eq_research_reports_listed.htm';
  const response = await Axios.get(url, {}, AxiosConfig);
  const { data } = response;
  const url2 = 'https://www1.nseindia.com/education/content/reports/eq_rrl_m2z.htm';
  const response2 = await Axios.get(url2, {}, AxiosConfig);
  const data2 = response2.data;
  const json1 = htmlParse(data);
  const json2 = htmlParse(data2);
  const finalOut = { ...json1, ...json2 };
  return finalOut;
}

async function execute() {
  try {
    const downloadUrl = await generateDownloadURL();
    downloadUrl ? console.log('downloadUrl success') : "";
    const zipPath = await downloadZip(downloadUrl);
    zipPath ? console.log('zipPath success') : "";
    const csvPath = await extractZip(zipPath);
    csvPath ? console.log('csvPath success') : "";
    const nseJsonData = await csv().fromFile(csvPath);
    nseJsonData ? console.log('nseJsonData success') : "";
    const symbolInfo = await scrap();
    symbolInfo ? console.log('symbolInfo success') : "";
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
    stocksInfo ? console.log('stocksInfo success') : "";
    const distinctStocksInfo = [];
    const map = new Map();
    for (const item of stocksInfo) {
      if (!map.has(item.SYMBOL)) {
        map.set(item.SYMBOL, true); // set any value to Map
        distinctStocksInfo.push(item);
      }
    }
    const dbResponse = await stocks.bulkCreate(distinctStocksInfo,
      {
        fields: Object.keys(distinctStocksInfo[0]),
        updateOnDuplicate: Object.keys(distinctStocksInfo[0]),
      });

    if (dbResponse) {
      await RedisClient.flushall();
      console.log('Flushing Redis');
    }
    return null;
  } catch (err) {
    console.log(err.message);
    console.log(err.response.data ? err.response.data : '');
    return null;
  }
}

execute();
