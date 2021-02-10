const testMiddleware = (req, res, next)=>{
    console.log("hello from middleware")
    next()
}

module.exports = testMiddleware