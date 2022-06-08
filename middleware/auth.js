const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.header.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, 'A_SUPER_SECRET_RANDOM_DECODING_KEY')
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Invalid request!' })
  }
}