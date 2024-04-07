const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // assuming your Express app is defined in app.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /', () => {
  it('should return 200 status and a message', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property
          done();
        })
   })
})