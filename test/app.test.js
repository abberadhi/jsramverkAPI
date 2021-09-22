process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const database = require('../src/db/database');

chai.should();

chai.use(chaiHttp);


after(async() => {
    let db = await database.getDb();
    db.collection.deleteMany({});
})

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

// rewrite
describe('app', () => {
    describe('POST /', () => {
        it('test fetching all data', (done) => {
            chai.request(server)
                .post("/findall")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.a("string");

                    console.log(res);

                    done();
                });
        });
    });
});

describe('app', () => {
    describe('POST /create', () => {
        it('creating new ', (done) => {
            chai.request(server)
                .post("/update")
                .send({})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.text.should.be.a("string");

                    done();
                });
        });
    });
});