const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('When there is initially some blogs saved:', () => {
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
    describe('Addition of a new note:', () => {
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

            const blogsWithNewPost = await helper.blogsInDb()
            expect(blogsWithNewPost).toHaveLength(helper.initialBlogs.length + 1)
            expect(blogsWithNewPost[2].title).toBe('title test')
        })
    })
    describe('When missing some field:', () => {
        test('likes property is missing from the request', async () => {
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
            const blogsWithNewPost = await helper.blogsInDb()
            expect(blogsWithNewPost[2].likes).toBe(0)
        }, 100000)

        test('title or url properties are missing with status code 400', async () => {
            const newBlog = {
                author: "author test",
                likes: 0
            }
            api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        })
    })
    describe('Update some value:', () => {
        test('update likes value', async () => {
            const allBlogs = await helper.blogsInDb()
            oldBlog = allBlogs[0]

            const newBlog = {...oldBlog, likes: oldBlog.likes + 1}
            await api
                .put(`/api/blogs/${oldBlog.id}`)
                .send(newBlog)

            const resultBlogs = await helper.blogsInDb()
            expect(newBlog.likes).toBe(resultBlogs[0].likes)

        }, 100000)
    })
    describe('Deletion some blog:', () => {
        test('remove one blog by id with 204 status', async () => {
            const allBlogs = await helper.blogsInDb()
            const id = allBlogs[0].id

            await api
                .delete(`/api/blogs/${id}`)
                .expect(204)

            const blogsAfterDelete = await helper.blogsInDb()
            expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)

        }, 100000)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})