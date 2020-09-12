const { Timber } = require('@timberio/node')

let timber;
if(process.env.timberAPIKey){
  timber = new Timber(process.env.timberAPIKey, process.env.timberSourceID);
} else {
  console.log('deploying silent Timber')
  timber = {
    debug: (message) => new Promise((resolve, reject) => {
      console.log(message);
      resolve();
    }),
    info: (message) => new Promise((resolve, reject) => {
      console.log(message);
      resolve();
    }),
    warn: (message) => new Promise((resolve, reject) => {
      console.log(message);
      resolve();
    }),
    error: (message) => new Promise((resolve, reject) => {
      console.log(message);
      resolve();
    }),
  }
}

module.exports = timber;
