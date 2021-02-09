const { Container } = require('typedi');
const { CronJob } = require('cron');

module.exports = () => {
  const NseServiceInstance = Container.get('NseServiceInstance');
  const jobSchedule = '0 21 * * 1-5';
  const job = new CronJob(jobSchedule, async () => {
    await NseServiceInstance.execute();
  }, null, true, 'Asia/Kolkata');
  job.start();
};
