const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const socket = require('socket.io')

const app = express()
const routes = require('./routes/routes')
const corsOptions = require('./config/corsOptions')
const credentialsOptions = require('./config/credentialsOptions')
const pool = require('./dbConfig')

dotenv.config({path:__dirname+'/.env'})
app.use(credentialsOptions)
app.use(cors({origin: corsOptions}))
app.use(cookieParser())
app.use(express.json())

routes(app)
const server = app.listen(process.env.PORT, () => {console.log(`Server is running on port ${process.env.PORT}`)})

const io = socket(server, {
    cors: {
        origin: corsOptions,
        credentials: credentialsOptions
    },
})
global.onlineUsers = new Map()

io.on('connection', (socket) => {
    global.chatSocket = socket
    socket.on('add-user', (userID) => {
        onlineUsers.set(userID, socket.id)
    })

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        sendUserSocket && socket.to(sendUserSocket).emit('msg-receive', data.message)
    })
})

pool.connect((err, client, done) => {
    if (err) throw err
    console.log('Connected to database')
    io.on('connection', (socket) => {
        client.on('notification', (msg) => {
            switch (msg.channel) {
                case 'nguoisudung':
                    return socket.emit('updated-user', JSON.parse(msg.payload))
                case 'danhsachtruonghoc':
                    return socket.emit('updated-school', JSON.parse(msg.payload))
                case 'chitieu':
                    return socket.emit('updated-statistic', JSON.parse(msg.payload))
                case 'diemchuan':
                    return socket.emit('updated-score', JSON.parse(msg.payload))
            
                default:
                    throw new Error('Action not supported')
            }
        })
    })
    client.query("LISTEN nguoisudung")
    client.query("LISTEN danhsachtruonghoc")
    client.query("LISTEN chitieu")
    client.query("LISTEN diemchuan")
})