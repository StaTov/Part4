const Blog = require('../models/blog')

const userInfo = {
    username: 'StaTov',
    name: 'Stanislav Tovch',
    password: 'Master'
}

const newBlog = {
    title: "title 3",
    author: "author 3",
    url: "url three",
    likes: 3
}

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

module.exports = {initialBlogs, blogsInDb, initialUsers, userInfo, newBlog}