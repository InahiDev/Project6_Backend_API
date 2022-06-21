const Password = require('../models/Password')

module.exports = (req, res, next) => {
  if (!Password.validate(req.body.password)) {
    res.status(400).json({ message: "Need a stronger password, including one uppercase, one lowercase, one digit, being between 4 and 16 of length, and not including spaces nor special characters!"})
  } else {
    next()
  }
}