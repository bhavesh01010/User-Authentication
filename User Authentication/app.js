const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http')
const server = http.createServer(app);
const cookieParser = require('cookie-parser')
const WebSocket = require('ws');
const userRouter = require('./routes/userRoute.js')
const wss = new WebSocket.Server({ server:server});

app.use(express.json())
app.use(cookieParser());

app.use("/api/user", userRouter)

// wss.on('connection', function connection(ws) {
//     console.log('A new client connected');
//     ws.send('Welcome New client');

//     ws.on('message', function incoming(message) {
//         console.log('recieved: %s', message);
//         ws.send("Got ur msg:" + message);
//     });
// });
// mongodb+srv://bhaveshgautam2302:socialmedia@cluster0.r9nwqoi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

mongoose.connect('mongodb+srv://bhaveshgautam2302:socialmedia@cluster0.r9nwqoi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then((result)=>console.log('Connected to database'))
.catch((err)=> console.log(err))

app.get('/',(req,res)=> res.send('Hello client'))

app.listen(8080, ()=> console.log('listening at port: 8080'))