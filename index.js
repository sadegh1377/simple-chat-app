let app = require('express')(); // initial express

let http = require('http').Server(app); // initial server

let io = require('socket.io')(http); // initial socket.io


app.get('/', (req, res) => {
    // to make node js use external html
    res.sendFile(__dirname + '/index.html');
})

// initial io request section
io.on('connection', (socket) => {
    // sent the number of connection to the all client side
    // that listening for noOfConnections answer
    io.emit('noOfConnections', Object.keys(io.sockets.connected).length);

    // for listening to the disconnect request
    // that the client send to server side
    socket.on('disconnect', () => {
        // sent the number of connection to the other clients side
        // that listening for noOfConnections answer
        io.emit('noOfConnections', Object.keys(io.sockets.connected).length)
    });

    // for listening to the chatMessage request
    // that the client send to server side
    socket.on('chatMessage', (msg) => {
        // to broadcast the Message that the user send to other users
        socket.broadcast.emit('chatMessage', msg)
        console.log("Public message from " + msg.user + ', ' + "length =" + msg.message.length + ": \r\n" + msg.message)
    });

    // for listening to the onlineUsers request
    // that the client send to server side
    socket.on('onlineUsers', (data) => {
        // to broadcast the online users to other users
        socket.broadcast.emit('onlineUsers', data);
        console.log("list of online users : " + data);
    });

    // for listening to the joined request
    // that the client send to server side
    socket.on('joined', (name) => {
        // to broadcast the name of the user
        // that joint to the sever to other users
        socket.broadcast.emit('joined', name)
        console.log(name + " join the chatroom")
    });

    // for listening to the leaved request
    // that the client send to server side
    socket.on('leaved', (name) => {
        // to broadcast the name of the user
        // that left the sever to other users
        socket.broadcast.emit('leaved', name)
        console.log(name + " left the chat room.")
    });

    // for listening to the typing request
    // that the client send to server side
    socket.on('typing', (data) => {
        // to broadcast the name of the user
        // that start to type to other users
        socket.broadcast.emit('typing', data)
    });

    // for listening to the stoptyping request
    // that the client send to server side
    socket.on('stoptyping', () => {
        // to broadcast the name of the user
        // that stop typing to other users
        socket.broadcast.emit('stoptyping')
    })

    // private part is same as public part

    socket.on('startPrivate', (data) => {
        socket.broadcast.emit('startPrivate', data);
        console.log("Private message, length=" + data.length + " to " + ": " + data)
    })

    socket.on('privateChatMessage', (msg) => {
        socket.broadcast.emit('privateChatMessage', msg)
        console.log("private message from " + msg.user + ', ' + "length =" + msg.message.length + ": \r\n" + msg.message)
    })

    socket.on('privateTyping', (data) => {
        socket.broadcast.emit('privateTyping', data)
    })
    socket.on('privateStopTyping', () => {
        socket.broadcast.emit('privateStopTyping')
    })

})

// make server to work on port 15000
http.listen(15000, () => {
    console.log('Server is started at http://localhost:15000')
})
