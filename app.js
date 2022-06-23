const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const rateLimit= require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const cors =require('cors')

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

mongoose.connect(MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie!'))
  .catch(() => console.log('Connexion à MongoDB échouée!'))

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(cors())

app.use(helmet({crossOriginEmbedderPolicy: false}))
app.use(limiter)
app.use(mongoSanitize({
  allowDots: true
}))

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app