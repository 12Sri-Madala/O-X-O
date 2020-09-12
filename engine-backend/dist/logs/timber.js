"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("@timberio/node");
let timber;
if (process.env.timberAPIKey) {
    console.log('Using real timber');
    timber = new node_1.Timber(process.env.timberAPIKey, process.env.timberSourceID);
}
else {
    console.log('deploying silent Timber');
    timber = {
        debug: (message) => new Promise((resolve) => {
            console.log(message);
            resolve();
        }),
        info: (message) => new Promise((resolve) => {
            console.log(message);
            resolve();
        }),
        warn: (message) => new Promise((resolve) => {
            console.log(message);
            resolve();
        }),
        error: (message) => new Promise((resolve) => {
            console.log(message);
            resolve();
        }),
    };
}
module.exports = timber;
//# sourceMappingURL=timber.js.map