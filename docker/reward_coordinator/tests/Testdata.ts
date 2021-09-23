const axios = require("axios");
const msg = require("./mockData.json");

const getRewards = () => {
  axios
    .post(`http://127.0.0.1:5000/calculate-reward`, {
      msg,
    })
    .then((res: any) => {
      console.log(
        `calculate-reward statusCode: ${res.status}\nresponse: ${JSON.stringify(
          res.data
        )}`
      );
    })
    .catch((error: any) => {
      console.error(`error getting rewards`, error);
    });

  axios
    .get(`http://127.0.0.1:5000/ping-me`, {
      msg,
    })
    .then((res: any) => {
      console.log(
        `ping-me statusCode: ${res.status}\nresponse: ${JSON.stringify(
          res.data
        )}`
      );
    })
    .catch((error: any) => {
      console.error(`error getting rewards`, error);
    });
};

getRewards();
