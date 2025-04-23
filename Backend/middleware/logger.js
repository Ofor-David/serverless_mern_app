const logger = ((req, res, next) => {
    const logReq =
        console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
})
export default logger