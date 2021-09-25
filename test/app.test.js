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
    describe('POST /findall', () => {
        it('should be nothing in the result', (done) => {
            chai.request(server)
                .post("/findall")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.length.should.be.below(1);

                    done();
                });
        });
    });

    describe('POST /update', () => {
        it('did not specify id so should create new doc', (done) => {
            chai.request(server)
                .post("/update")
                .send({})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.acknowledged.should.equal(true);
                    res.body.insertedId.should.be.an("string");

                    done();
                });
        });
    });

    let entryId;

    describe('POST /findall', () => {
        it('accoring to previous test there should be exactly one untitled entry', (done) => {
            chai.request(server)
                .post("/findall")
                .send({})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.equal(1);
                    res.body[0].name.should.equal("Untitled");

                    entryId = res.body[0]._id;

                    done();
                });
        });
    });

    describe('POST /find', () => {
        it('get the untitled entry by id', (done) => {
            chai.request(server)
                .post("/find")
                .send({"id": entryId})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.name.should.equal("Untitled");

                    done();
                });
        });
    });

    describe('POST /update', () => {
        it('update the content of the document and look for modified docs', (done) => {
            chai.request(server)
                .post("/update")
                .send({"id": entryId, "name": "new name", "content": "<h1>hello</h1>"})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.acknowledged.should.equal(true);
                    res.body.modifiedCount.should.equal(1);

                    done();
                });
        });
    });

    describe('POST /find', () => {
        it('checking that doc is updated with correct content', (done) => {
            chai.request(server)
                .post("/find")
                .send({"id": entryId})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.name.should.equal("new name");
                    res.body.content.should.equal("<h1>hello</h1>");

                    done();
                });
        });
    });

    describe('POST /delete', () => {
        it('deleting a doc by id', (done) => {
            chai.request(server)
                .post("/delete")
                .send({"id": entryId})
                .end((err, res) => {
                    res.should.have.status(201);

                    res.body.deletedCount.should.equal(1);
                    res.body.acknowledged.should.equal(true);

                    done();
                });
        });
    });


    describe('POST /delete', () => {
        it('delete a non existent document. should result in failure', (done) => {
            chai.request(server)
                .post("/delete")
                .send({"id": "non existnt"})
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.msg.should.be.a("string", "could not find what u were looking for");

                    done();
                });
        });
    });
});

