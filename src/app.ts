import type { Express, Request } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import requestIp from 'request-ip'
import morgan from 'morgan'
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
import 'dotenv/config'

const app: Express = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
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

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

export default app;