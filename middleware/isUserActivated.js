module.exports = (req, res, next) => {
    if(!req.user || !req.user.active) {
        res.status(401).json({
            status: 'error',
            code: res.statusCode,
            message: 'User\'s account is not yet activated.',
            result: {}
        });
    } else {
        next()
    }
}