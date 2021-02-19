// File not used, might remove later
const { Container } = require('typedi');
const { CronJob } = require('cron');

module.exports = () => {
  const NseServiceInstance = Container.get('NseServiceInstance');
  // const jobSchedule = '*/2 * * * *'; // At every 2nd minute.
  const jobSchedule = '0 21 * * 1-5'; // At 21:00 on every day-of-week from Monday through Friday.
  const job = new CronJob(jobSchedule, async () => {
    await NseServiceInstance.execute();
  }, null, true, 'Asia/Kolkata');
  job.start();
};
