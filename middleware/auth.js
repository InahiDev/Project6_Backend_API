const jwt = require('jsonwebtoken')
const TOKEN_KEY = process.env.TOKEN_KEY

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, TOKEN_KEY)
    const userId = decodedToken.userId
    req.userId = userId  //Modification de req, c'est req qui est transmise tout au long des middlewares. Enrichissement de req avec une nouvelle paire clé/valeur user.id = userId
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized request, need authentification!' })
  }
}