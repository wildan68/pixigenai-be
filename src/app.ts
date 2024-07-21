import type { Express } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import requestIp from 'request-ip'
import morgan from 'morgan'
import ServicesRoutes from './routes/services.routes.js'
import 'dotenv/config'

const app: Express = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
const PORT = process.env.PORT || 3001

// cors enable all origins
app.use(cors())
app.use(requestIp.mw())
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(ServicesRoutes)


app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

export default app;