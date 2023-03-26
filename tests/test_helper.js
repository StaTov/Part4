const Blog = require('../models/blog')

const initialUsers = [{
    username: "StaTov",
    name: "Stanislav Tovch",
    passwordHash: "Master"
},{
    username: "OlyaTovA",
    name: "Olya Tovch",
    passwordHash: "Sweet"
}
]

const initialBlogs = [
    {
        title: "title one",
        author: "author one",
        url: "url one",
        likes: 1
    },{
        title: "title two",
        author: "author two",
        url: "url two",
        likes: 2
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {initialBlogs, blogsInDb, initialUsers}