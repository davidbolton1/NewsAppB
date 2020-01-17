function withRedirect(req, res, next) {
    if (req.session) {
        if(req.session.user) {
            res.locals.authenticated = true
            res.locals.userId = req.session.user.userId
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

function checkAuthorization(req, res, next) {
    if (req.session) {
        if(req.session.user) {
            res.locals.authenticated = true
            next()
        } else {
            res.locals.autheticated = false
            next()
        }
    } else {
            res.locals.autheticated = false
            next()
    }
}
module.exports = {checkAuthorization, withRedirect}