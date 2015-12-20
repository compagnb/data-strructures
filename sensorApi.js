var pg = require('pg');

var conString = "postgres://barb:pgdvdataviz@pgdv-data-structures.cruj1d5neyqx.us-west-2.rds.amazonaws.com:5432/postgres";
var client = new pg.Client(conString);
client.connect();

var io = require('socket.io').listen(8888);

io.sockets.on('connection', function (socket) {
    socket.on('sql', function (data) {
        var query = client.query(data.sql, data.values);
        query.on('row', function(row) {
            socket.emit('sql', row);
        });
    });
});
