// isAuthenticated,
// Used as a middleware on routes to see if user is logged in or not.
module.exports = (req, res, next) => {
    // console.log('CHECKING', req.user, req.isAuthenticated())
    if(!req.isAuthenticated()) {
        res.status(401).json({
            status: 'error',
            code: res.statusCode,
            message: 'You must be logged in for this request to be processed.',
            result: {}
        });
    } else {
        next()
    }
}