// Initialize the constants
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"


// View engine config
// Use mustache as the engine
app.engine('mustache', mustacheExpress())
// Set up views directory, views is located in the /views directory
app.set('views', './views')
// Whatever view engine is, use mustache
app.set('view engine', 'mustache')
// Middleware to use body Parser
app.use(bodyParser.urlencoded({extended: false}))
// Connect our DB
const db = pgp(CONNECTION_STRING)

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
            db.none('INSERT INTO users(username,password) VALUES($1,$2)', [username,password])
            .then(()=> {
                res.send('SUCCESS')
            })
        }
    })
})





// Listen for a specific port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})