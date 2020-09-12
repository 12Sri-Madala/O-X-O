var request = require('request');

console.log('Testing server-database interactions');

const body = {
    token: 1,
    /*payload: {
        firstName: 'Buzz',
        lastName: 'Aldrin'
    }*/
}



const options = {
    url: 'http://localhost:5000/dash/1',
    method: 'GET',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(body),
};


let t0 = new Date().getTime();
request(options, function(err, res, body){
    if(err){
        console.log(err);
    } else {
        console.log('statusCode:', res && res.statusCode);
        body = JSON.parse(body);
        if(Object.keys(body)[0] === 'error'){
            console.log('error:', body.error);
        } else {
            console.log('matches:', body.matches.length);
            console.log('paired owners:', body.owners);
        }
    }
    let t1 = new Date().getTime();
    console.log("Call to request took " + (t1 - t0) + " milliseconds.");
});
