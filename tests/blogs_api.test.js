const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const {all} = require("express/lib/application");

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 100000)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test(' the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added with valid property', async () => {
    const newBlog = {
        title: "title test",
        author: "author test",
        url: "url test",
        likes: 3
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsWithNewPost = await api.get('/api/blogs')
    expect(blogsWithNewPost.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsWithNewPost.body[2].title).toBe('title test')
})

test(' likes property is missing from the request', async () => {
    const newBlog = {
        title: "title test",
        author: "author test",
        url: "url test",

    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogsWithNewPost = await Blog.find({})
    expect(blogsWithNewPost[2].likes).toBe(0)
}, 100000)

test('title or url properties are missing status code 400', async () => {
    const newBlog = {
        author: "author test",
        likes: 0
    }
    api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('remove one blog by id with 204 status', async () => {
    const allBlogs = await api.get('/api/blogs')
    const id = allBlogs.body[0].id

    await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

    const blogsAfterDelete = await api.get('/api/blogs')
    expect(blogsAfterDelete.body).toHaveLength(helper.initialBlogs.length - 1)

}, 100000)

test('update likes value', async () => {
    const allBlogs = await api.get('/api/blogs')
    oldBlog = allBlogs.body[0]

    const newBlog = {...oldBlog, likes: oldBlog.likes + 1}
    await api
        .put(`/api/blogs/${oldBlog.id}`)
        .send(newBlog)

    const result = await api.get('/api/blogs')
    expect(newBlog.likes).toBe(result.body[0].likes)

}, 100000)
afterAll(async () => {
    await mongoose.connection.close()
})