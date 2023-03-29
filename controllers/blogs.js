const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {userExtractor} = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {

    const body = request.body
    const userId = request.user.id

    if (!userId) {
        return response.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(userId)
    const blog = new Blog({...body, user: user.id})
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
blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const user = request.user
    if (!user.id) {
        return response.status(401).json({error: 'token invalid'})
    }
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({error: 'invalid user'})
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter