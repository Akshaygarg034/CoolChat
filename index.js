// Node server which will handle socket io connections
const express = require('express');
const path = require("path");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 3000;
const users = {};
console.log("Server Online");
app.use('/static', express.static(path.join(__dirname, 'static')));

 // Set the template engine as pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
})
server.listen(port, ()=>{
    console.log(`The application started successfully on http://localhost:${port}`);
})
