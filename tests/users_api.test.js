const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('When there is initially some users saved: ', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    describe('When invalid users are not created :', () => {
        test('wrong username length (2)', async () => {
            const wrongUser = {
                username: 'Fa',
                name: 'TestName',
                passworHash: 'password'
            }

            const allUsersAtStart = await User.find({})

            await api
                .post('api/users')
                .send(wrongUser)
                .expect(400)

            const allUsersAtEnd = await User.find({})
expect(allUsersAtEnd).toHaveLength(allUsersAtStart.length)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})