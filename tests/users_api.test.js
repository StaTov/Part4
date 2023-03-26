const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
}, 100000)

describe('When there is initially some users saved: ', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    })
    describe('When invalid users are not added // with 400 code:', () => {
        test('wrong username length < (3)', async () => {
            const wrongUser = {
                username: 'Fa',
                name: 'TestName',
                password: 'password'
            }

            const allUsersAtStart = await User.find({})

            const result = await api
                .post('/api/users')
                .send(wrongUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const allUsersAtEnd = await User.find({})
            expect(result.body.error).toContain('User validation failed')
            expect(allUsersAtEnd).toHaveLength(allUsersAtStart.length)
        })

        test('username is not unique', async () => {
            const wrongUser = {
                username: 'StaTov',
                name: 'TestName',
                password: 'password'
            }

            const allUsersAtStart = await User.find({})

            const result = await api
                .post('/api/users')
                .send(wrongUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const allUsersAtEnd = await User.find({})
            expect(result.body.error).toContain('Error, expected `username` to be unique')
            expect(allUsersAtEnd).toHaveLength(allUsersAtStart.length)
        })

        test('password require minimum allowed length (3)', async () => {
            const wrongUser = {
                username: 'TestUser',
                name: 'TestName',
                password: 'pa'
            }

            const allUsersAtStart = await User.find({})

            const result = await api
                .post('/api/users')
                .send(wrongUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const allUsersAtEnd = await User.find({})
            expect(result.body.error).toContain('Password is shorter than the minimum allowed length (3)')
            expect(allUsersAtEnd).toHaveLength(allUsersAtStart.length)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})