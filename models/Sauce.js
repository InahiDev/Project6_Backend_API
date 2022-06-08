const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
  userId: { typeof: String, required: true },
  name: { typeof: String, required: true },
  manufacturer: { typeof: String, required: true },
  description: { typeof: String, required: true },
  imageUrl: { typeof: String, required: true },
  heat: { typeof: Number, required: true },
  likes: { typeof: Number, required: true },
  dislikes: { typeof: Number, required: true },
  usersLiked: { typeof: Array, required: true},
  usersDiliked: {typeof: Array, required: true }
})

module.exports = mongoose.model('Sauce', sauceSchema)