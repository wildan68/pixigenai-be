import type { Express, Request } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import requestIp from 'request-ip'
import morgan from 'morgan'
import http from 'http'
import url from 'url'
import { WebSocketServer } from 'ws'
import ServicesRoutes from './routes/services.routes.js'
import AuthRoutes from './routes/auth.routes.js'
import CryptoRoutes from './routes/crypto.routes.js'
import SeederRoutes from './routes/seeder.routes.js'
import UserRoutes from './routes/user.routes.js'
import { limiter } from './utils/helper.js';
import AuthMiddleware from './middleware/auth.js'
import DiscoverRoutes from './routes/discover.routes.js'
import TestingRoutes from './routes/testing.routes.js'
import ModelsRoutes from './routes/models.routes.js'
import TripoModules from './modules/TripoModules.js'
import 'dotenv/config'

const app: Express = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true })
const PORT = process.env.PORT || 3001

// cors enable all origins
app.use(cors())
app.use(requestIp.mw())

// Assign IP in Morgan
morgan.token('ip', (req: Request) => req.clientIp)

// Morgan Logging
app.use(morgan(':ip :method :url :status :response-time ms - :res[content-length]', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// limiter 1 minutes 100 request
const excludeLimiterPath = ['/assets/webp']

app.use((req, res, next) => {
  // console.log('masuk 1', req.path)
  if (excludeLimiterPath.find((path) => req.path.includes(path))) {
    next()
  }
  else {
    limiter(req, res, next)
  }
})

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    data: {
      message: 'PixigenAI Application was running!',
      date: new Date()
    }
  })
})

// Routes No Middleware
app.use('/auth', AuthRoutes)
app.use(SeederRoutes)
app.use(ServicesRoutes)

// Middleware
app.use(AuthMiddleware)

// Routes With Middleware
app.use('/user', UserRoutes)
app.use('/discover', DiscoverRoutes)
app.use(CryptoRoutes)
app.use('/testing', TestingRoutes)
app.use('/models', ModelsRoutes)

wss.on('connection', (ws, req) => {
  console.log('Websocket Connected')
  const tripoModules = new TripoModules()
  const getTaskId = (): string => {
    const pathname = url.parse(req.url as string).pathname as string
    const taskId = pathname.split('/')[2]

    return taskId
  }
  
  const setIntervalTask = setInterval(async() => {
    tripoModules.taskWatcher(getTaskId())
      .then((data) => ws.send(JSON.stringify(data)))
      .catch((error) => ws.send(JSON.stringify(error)))
  }, 1000)

  // Websocket Received Message
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`)
  });

  // Websocket Destroy
  ws.on('close', () => {
    console.log('WebSocket connection closed')
    clearInterval(setIntervalTask)
  })
})

// Event upgrade untuk WebSocket route di `/ws`
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url as string).pathname as string

  if (pathname.startsWith('/task/')) {
    return wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } 
  
  return socket.destroy();
})

server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`)
})

export default app;