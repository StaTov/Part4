const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body
    if(!password || password.length < 3){
        return res.status(400).json({error: 'Password is shorter than the minimum allowed length (3)'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const allUsers = await User.find({}).populate('blogs',{title: 1, author: 1, url: 1})
    res.json(allUsers)
})

module.exports = usersRouter