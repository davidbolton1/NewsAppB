// Initialize the constants
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const bcrypt = require('bcryptjs')
const session = require('express-session')
const path = require('path')

const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const SALT_ROUNDS = 10
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
// Middleware to use body Parser
app.use(bodyParser.urlencoded({extended: false}))
//Add middleware to handle a session
app.use(session({
    secret: 'aljfajejsj',
    resave: false,
    // Only save the session when we put something (login)
    saveUninitialized: false
}))
// Connect our DB
const db = pgp(CONNECTION_STRING)
//Add a route to articles page
app.get('/users/articles',(req,res)=> {
    res.render('articles', {username: req.session.user.username})
})
// Add a route to the login page
app.get('/login', (req,res) => {
    res.render('login')
})
// Add a post route to login that connects to our DB
app.post('/login', (req,res) => {
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid,username,password FROM users WHERE username = $1',[username])
    .then((user) => {
        // check for user's password
        if(user) {
            bcrypt.compare(password,user.password,function(error,result) {
                // If the result does exist and the pw matches
                if(result) {

                    // put username and userID in the session
                    if(req.session) {
                        req.session.user = {userId: user.userID, username: user.username}
                    }
                    // Redirect to a new route
                    res.redirect('/users/articles')
                } else {
                    // If pw doesn't match
                    res.render('login', {message: "Invalid username or password!"})
                }
            })
            // If  username deoes not exist
        } else {
            res.render('login', {message: "Invalid username or password!"})
        }
    })

})
// Add a route to the 'register page' if the user visits /register
app.get('/register', (req,res) => {
    res.render('register')
})
// Add a post route for the register form
app.post('/register', (req,res) => {

    let username = req.body.username
    let password = req.body.password

    // Check if the user already exists in the database
    db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
    .then((user) => {
        // If user exists, return a message
        if(user) {
            res.render('register', {message: "Username exists"})
        } else {
            // insert user into the users table
            bcrypt.hash(password, SALT_ROUNDS,function(error, hash) {
                if(error == null){
                    // instead of [username, password] we use the has of the password
                    db.none('INSERT INTO users(username,password) VALUES($1,$2)', [username,hash])
                    .then(()=> {
                        res.send('SUCCESS')
                    })
                }
            })
        }
    })
})





// Listen for a specific port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})