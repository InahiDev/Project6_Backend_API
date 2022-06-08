const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')

const app = express()

mongoose.connect('mongodb+srv://InahiDeveloper:CXWbGLKJsR3BYbZ@inahidev.nbb9z.mongodb.net/?retryWrites=true&w=majority',
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

app.use('/api/auth', (req,res, next) => {
  res.json({ message: "C'est bien la route d'authentification!" })
})
app.use('/api/sauces', (req, res) => {
  res.json({ message: "C'est bien la route des sauces!" })
})

module.exports = app