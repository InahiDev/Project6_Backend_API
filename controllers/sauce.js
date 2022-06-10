const Sauce = require('../models/Sauce')
const fs= require('fs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req,res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée!'}))
    .catch(error => res.status(400).json({ error }))
}

exports.updateSauce = (req, res, next) => {
  if (req.file) {
    const sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée et ancienne image supprimée!" }))
            .catch(error => res.status(400).json({ error }))
        })
      })
      .catch(error => res.status(404).json({ error }))
  } else {
    const sauceObject = { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce modifée!" }))
      .catch(error => res.status(400).json({ error }))
  }
  /*Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]
      const sauceObject = req.file ?
      fs.unlink(`images/${filename}`, () => {
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } 
      }) : { ...req.body }
  })
    .catch(error => res.status(404).json({ error }))*/
  /*const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
    .catch(error => res.status(400).json({ error }))*/
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json({ message: 'Sauce supprimée!' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.likeStatus = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id })
    .then(sauce => {                    //la logique ne se mets pas ici mais au-dessus, lors de l'update. il faut revoir ceci
      const userId = req.body.userId
      switch (req.body.like) {
        case 1:
          sauce.likes ++
          if (!sauce.usersLiked.find(userId)) {
            sauce.usersLiked.push(userId)
          }
          if (sauce.usersDisliked.find(userId)) {
              const userIndex = sauce.usersDisliked.indexOf(userId)
              sauce.usersDisliked.splice(userIndex, 1)
              sauce.dislikes --
          }
          
          res.status(200).json({ message: "Like comptabilisé!"})
          break
        case 0:
          if (sauce.usersLiked.find(userId)) {
            const userIndex = sauce.usersLiked.indexOf(userId)
            sauce.usersLiked.splice(userIndex, 1)
            sauce.likes --
          }
          if (sauce.usersDisliked.find(userId)) {
            const userIndex = sauce.usersDisliked.indexOf(userId)
            sauce.usersDisliked.splice(userIndex, 1)
            sauce.dislikes --
          }
          res.status(200).json({ message: "Like ou Dislike annulé"})
          break
        case -1:
          sauce.dislike ++
          if (!sauce.usersDisliked.find(userId)) {
            sauce.usersDisliked.push(userId)
          }
            if (sauce.usersLiked.find(userId)) {
              const userIndex = sauce.usersLiked.indexOf(userId)
              sauce.usersLiked.splice(userIndex, 1)
              sauce.likes --
            }
          res.status(200).json({ message: "Dislike comptabilisé"})
          break
        default :
          res.status(400).json({ message: "J'ai bien fait toutes les instructions switch, rien ne correspondait" })
      }
    })
    .catch(error => res.status(400).json({ error }))
}


/*exports.likeSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, 'A_SUPER_SECRET_RANDOM_DECODING_KEY')
  const userId = decodedToken.userId
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (!sauce.usersLiked.find(userId)) {
        req.body = {
          userId: userId,
          like: 1
        }
        sauce.likes = sauce.likes ++
        sauce.usersLiked.push(userId)
        if (sauce.usersDisliked.find(userId)) {
          const userIndex = sauce.usersDisliked.indexOf(userId)
          sauce.usersDisliked.splice(userIndex, 1)
        }
        res.status(200).json({ message: 'Like comptabilisé!'})
      } else {
        req.body = {
          userId: userId,
          like: 0
        }
        sauce.likes = sauce.likes --
        const userIndex = sauce.usersLiked.indexOf(userId)
        sauce.usersLiked.splice(userIndex, 1)
        res.status(200).json({ message: 'Like enlevé' })
      }
    })
    .catch(error => res.status(400).json({ error }))
}

exports.dislikeSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, 'A_SUPER_SECRET_RANDOM_DECODING_KEY')
  const userId = decodedToken.userId
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if(!sauce.usersDisliked.find(userId)) {
        req.body = {
          userId: userId,
          like: -1
        }
        sauce.dislikes = sauce.dislikes ++
        sauce.usersDisliked.push(userId)
        if (sauce.usersLiked.find(userId)) {
          const userIndex = sauce.usersLiked.indexOf(userId)
          sauce.usersLiked.splice(userIndex, 1)
        }
        res.status(200).json({ message: 'Dislike comptabilisé!' })
      } else {
        sauce.dislikes = sauce.dislikes --
        const userIndex = sauce.usersDisliked.indexOf(userId)
        sauce.usersDisliked.splice(userIndex, 1)
        res.status(200).json({ message: 'Dislike enlevé!' })
      }
    })
    .catch(error => res.status(404).json({ error }))
}*/