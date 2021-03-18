// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

// app.get('/', function(req, res){
//     res.send('server is running');
// })

const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

var clients = {};

//socketio
io.on("connection", function (client) {  
    client.on("join", function(name){
    	console.log(name + " joined");
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.")
    });

    client.on("send", function(msg){
    	//console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log(clients[client.id]+ " left");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
});


server.listen(process.env.PORT || 3000, function(){
  console.log('listening on port 3000');
});
//PARA RODAR: node app.js