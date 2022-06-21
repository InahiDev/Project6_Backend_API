const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const rateLimit= require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

const dotenv = require('dotenv')
dotenv.config()
const MONGODB_CONNECT = process.env.MONGODB_CONNECT


const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')

const app = express()

const limiter = rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

mongoose.connect(MONGODB_CONNECT,
  { useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(() => console.log('Connexion à MongoDB échouée!'))

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

//app.use(helmet())
//app.use(limiter)
//app.use(mongoSanitize({
//  allowDots: true
//}))

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app