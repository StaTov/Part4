const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {info, error} = require('./utils/logger')
const config = require('./utils/config')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URL
info(`connecting to ${mongoUrl}`)
mongoose.connect(mongoUrl)
    .then(result => info(`Good connected to Mongodb`))
    .catch(err => error(`Bad connect to mongodb ${error.message}`))

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(200).json(result)
        })
})


app.listen(config.PORT, () => {
    info(`Server running on port ${config.PORT}`)
})