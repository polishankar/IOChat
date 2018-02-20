var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
inputs = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running.......');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  });
app.get('/outbound', (req, res) => {
    res.send(req.query.value);
    var yyy = req.query.value
    io.sockets.emit('get inputs', yyy)
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data){
  inputs.splice(inputs.indexOf(socket.inputtype), 1);
    updateInputtypes();
  connections.splice(connections.indexOf(socket), 1);
  console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function(data){
      io.sockets.emit('new message', {msg:data, input: socket.inputtype});
      });

      socket.on('new input', function(data, callback){
        callback(true);
        socket.inputtype = data;
        inputs.push(socket.inputtype);
        updateInputtypes();
        });
        function updateInputtypes(){
          io.sockets.emit('get inputs',inputs);
        }
});
