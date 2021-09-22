process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');

chai.should();

chai.use(chaiHttp);


describe('app', () => {
    describe('get /', () => {
        it('test index hello world', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.a("string");
                    done();
                });
        });
    });
});

describe('app', () => {
    describe('POST /', () => {
        it('test fetching all data', (done) => {
            chai.request(server)
                .post("/findall")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.a("string");

                    done();
                });
        });
    });
});