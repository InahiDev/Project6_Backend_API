const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const TOKEN_KEY = process.env.TOKEN_KEY

exports.signup = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée!' }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
  } else {
    res.status(400).json({ message: "Unvalid email"})
  }
}

exports.login = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non inscrit!"})
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe eronné!" })
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              TOKEN_KEY,
              { expiresIn: '3h' }
            )
          })
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
  } else {
    res.status(400).json({ message: "Unvalid Email!" })
  }
}