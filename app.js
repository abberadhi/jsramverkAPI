
const express = require('express');
const morgan = require('morgan');
const rm = require('./src/routes/delete');
const port = process.env.PORT || 1337;
var app = express();
const httpServer = require("http").createServer(app);
var cors = require('cors');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./src/config');



// routes
const index = require('./src/routes/index');
const update = require('./src/routes/update');
const find = require('./src/routes/find');
const findAll = require('./src/routes/findall');


app.use(cors());


const io = require("socket.io")(httpServer, { 
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.sockets.on('connection', function(socket) {
    socket.on('create', function(room) {
        socket.join(room);
    });

    socket.on('sync', function(data) {
        socket.to(data.id).emit("doc", {content: data.content, name: data.name});
    });
});

// Connect to Mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

 // don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());

// index route
app.use('/', index);
app.use('/update', update);
app.use('/delete', rm);
app.use('/findall', findAll);
app.use('/find', find);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;