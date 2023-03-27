const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findOne({username: 'StaTov'})
    const blog = new Blog({...request.body, user: user.id})

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})
blogsRouter.put('/:id', async (request, response) => {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
        context: 'query'
    })
    response.json(result)
})
blogsRouter.delete('/:id', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }
    const blog = await Blog.findById(request.params.id)
    const userId = decodedToken.id

    if (blog.user.toString() !== userId) {
        return response.status(401).json({error: 'invalid user'})
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter