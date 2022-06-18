const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const validatedEmail = validator.isEmail()
const validatedPassword = !validator.contains("$'\"\\/*")

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true/*, validate: (validator.isEmail === true)*/ },
  password: { type: String, required: true/*, validate: (!validator.contains($'"/\<>*) === true) */ }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)