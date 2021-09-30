
const express = require('express');
const index = require('./routes/index');
const update = require('./routes/update');
const find = require('./routes/find');
const findAll = require('./routes/findall');
const morgan = require('morgan');
const rm = require('./routes/delete');
const port = process.env.PORT || 1337;

var app = express();
const httpServer = require("http").createServer(app);

var cors = require('cors');

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

 // don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());

// app.use((req, res, next) => {
//     console.log(req.method);
//     console.log(req.path);
//     next();
// });

// index route
app.use('/', index);
app.use('/update', update);
app.use('/delete', rm);
app.use('/findall', findAll);
app.use('/find', find);
// app.use('/update', update);
// app.use('/update', update);

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