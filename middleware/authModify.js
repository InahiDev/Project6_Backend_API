const jwt = require('jsonwebtoken')
const TOKEN_KEY = process.env.TOKEN_KEY

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, TOKEN_KEY)
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ message: 'Seul le propriétaire de cette sauce peut la modifier!' })
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: error | "Unauthorized request, need authentification!" })
  }
}