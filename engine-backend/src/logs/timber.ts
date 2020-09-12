import { Timber } from '@timberio/node';

let timber: any;
if(process.env.timberAPIKey){
  console.log('Using real timber');
  timber = new Timber(process.env.timberAPIKey, process.env.timberSourceID);
} else{
  console.log('deploying silent Timber')
  timber = {
    debug: (message: string) => new Promise((resolve) => {
      console.log(message);
      resolve();
    }),
    info: (message: string) => new Promise((resolve) => {
      console.log(message);
      resolve();
    }),
    warn: (message: string) => new Promise((resolve) => {
      console.log(message);
      resolve();
    }),
    error: (message: string) => new Promise((resolve) => {
      console.log(message);
      resolve();
    }),
  }
}

module.exports = timber;
