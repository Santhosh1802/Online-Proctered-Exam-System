const moment = require("moment-timezone");

const IST = "Asia/Kolkata";
const convertToIST = (date) => {
  const ISTDate = moment.tz(date, IST).toDate();

  return moment(ISTDate).format("DD/MM/YYYY");
};
const convertToISTWithTime = (utcString) => {
  const desiredFormat = "DD/MM/YYYY hh:mm A";

  const convertedMoment = moment.utc(utcString).tz(IST);
  const formattedDate = convertedMoment.format(desiredFormat);

  return formattedDate;
};

module.exports = { convertToIST, convertToISTWithTime };
