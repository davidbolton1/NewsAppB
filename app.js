// Initialize the constants
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')({query:(e => console.log(e.query))});
const bcrypt = require('bcryptjs')
const session = require('express-session')
const path = require('path')
const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')
const {checkAuthorization, withRedirect} = require('./checkauth/authorization')
const mlSentiment = require('ml-sentiment')
const sentiment = mlSentiment({ lang: 'en' });
const icons = require('glyphicons'); // added this line
require('dotenv').config();

//const axios = require('axios');



const PORT = process.env.PORT || 8020
const CONNECTION_STRING = process.env.CONNECTION_STRING
//const SALT_ROUNDS = 10
// For our partials pages, join current directory name to our views folder
const VIEWS_PATH = path.join(__dirname, '/views')

// View engine config
// Use mustache as the engine
// pass in path to partials
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
// Set up views directory, views is located in the /views directory
// Changed from ./views to VIEWS PATH
app.set('views', VIEWS_PATH)
// Whatever view engine is, use mustache
app.set('view engine', 'mustache')
// Static css page, css is the alias 
app.use('/css', express.static('css'))
// Middleware to use body Parser
app.use(bodyParser.urlencoded({
    extended: false
}))
//Add middleware to handle a session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    // Only save the session when we put something (login)
    saveUninitialized: false
}))
// Setup routers
app.use('/', checkAuthorization, indexRoutes)
app.use('/users', withRedirect, userRoutes)
// Middleware to check if logged in or logged out
app.use((req, res, next) => {
    // If the user is authenticated set to false, else true
    res.locals.authenticated = req.session.user == null ? false : true
    next()
})

// Connect our DB
db = pgp(process.env.CONNECTION_STRING)

app.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid,username,password FROM users WHERE username = $1', [username])
        .then((user) => {
            // check for user's password
            if (user) {
                bcrypt.compare(password, user.password, function (error, result) {
                    // If the result does exist and the pw matches
                    if (result) {

                        // put username and userID in the session
                        if (req.session) {
                            req.session.user = {
                                userId: user.userid,
                                username: user.username
                            }
                        }
                        // Redirect to a new route
                        res.redirect('/index')
                    } else {
                        // If pw doesn't match
                        res.render('login', {
                            message: "Invalid username or password!"
                        })
                    }
                })
                // If  username deoes not exist
            } else {
                res.render('login', {
                    message: "Invalid username or password!"
                })
            }
        })

})
app.get('/all-stuff', async (req, res) => {

    let articles = await db.any('select articleid, title,body,emoji from articles')
    res.render('all-stuff', {
        articles: articles
    })
  
})


app.get('/all-stuff', async (req, res) => {
    let articles = await db.any('select articleid,title,body,emoji from articles')
    res.render('all-stuff', {
        articles: articles
    })
})

app.get('/happynews', async (req, res) => {
    let happyarticles = await db.any('select * from newsarticles where sentiment > $1', [0])
    res.render('happynews', {
        happyarticles: happyarticles
    })
})

// Listen for a specific port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})