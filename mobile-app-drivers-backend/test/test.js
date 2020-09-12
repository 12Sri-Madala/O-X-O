const chai = require('chai');
const app = require('../server.js');
const expect = chai.expect;
const supertest = require('supertest');
const request = supertest(app);

describe('Twilio Send Code', function() {
  it('Sends verification code to phone number', async function(done) {
    const body = await JSON.stringify({
      "ISOCode": "us",
      "countryCode": "1",
      "phoneNumber": "16305447512",
    });
    request.post('/login/twilio/sendCode')
    .send(body)
    .expect(200)
    .end(function(err, res) {
      console.log(res);
      done(err);
    });
  });
});