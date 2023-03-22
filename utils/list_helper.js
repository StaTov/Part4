const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {

    if (blogs.length === 0) {
        return 0
    }

    const a = [...blogs].sort((a, b) => {
        return b.likes - a.likes
    });
    const {title, author, likes} = a[0]
    return {title, author, likes}
}

const mostBlogs = (blogs) => {
    let resultArr = [];

    for (let i = 0; i < blogs.length; i++) {
        let filteredBlogs = blogs.filter(blog =>
            blog.author === blogs[i].author)
        if (filteredBlogs.length > resultArr.length) {
            resultArr = filteredBlogs
        }
    }
    return {
        author: resultArr[0].author,
        blogs: resultArr.length
    }
}

const mostLikes = (blogs) => {

    let result = {likes: 0};

    for (let i = 0; i < blogs.length; i++) {
        let filtBlogs = blogs.filter(blog => blog.author === blogs[i].author)

        let obj = {
            author: filtBlogs[0].author,
            likes: filtBlogs.reduce((acc, item) => {
                return acc + item.likes
            }, 0)
        }
        if (result.likes < obj.likes) {
            result = obj
        }
    }
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}