// Initialize the constants
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const bcrypt = require('bcryptjs')
const session = require('express-session')
const path = require('path')
const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')
const checkAuthorization = require('./checkauth/authorization')
const axios = require('axios');


const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
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
    secret: 'aljfajejsj',
    resave: false,
    // Only save the session when we put something (login)
    saveUninitialized: false
}))
// Setup routers
app.use('/', indexRoutes)
app.use('/users', checkAuthorization, userRoutes)
// Middleware to check if logged in or logged out
app.use((req, res, next) => {
    // If the user is authenticated set to false, else true
    res.locals.authenticated = req.session.user == null ? false : true
    next()
})

// Connect our DB
db = pgp(CONNECTION_STRING)

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
                        res.redirect('/users/articles')
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
    let articles = await db.any('select articleid,title,body from articles')
    res.render('all-stuff', {
        articles: articles
    })
})
/*
app.get('/quoteSearch', (req, res) => {

    async function findNewsArticles() {
        searchAddress = 'https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=8346c55c4813473f8f29da212e2e02fe'
        const data = await axios.get(`${searchAddress}`, {
                headers: {
                    "Accept": "application/json",
                    "pageSize": "10",
                    "X-Api-Key": "8346c55c4813473f8f29da212e2e02fe"
                }
            })
            .then((data) => {
                console.log(data.data.articles)
                console.log(data.data.articles.body)
                console.log(data.data.articles.author)
            })
            .catch((error) => {
                this.showErrors(error.response.data.error)
            })
        return data;
    }
    findNewsArticles();
    res.render('quoteSearch')
})

//Add a post route to the add stuff
app.post('/quoteSearch', (req, res) => {
    console.log(data.data)
    let title = data.data.title
    console.log(title)
    let description = data.data.body
    console.log(description)
    let authorId = data.data.author
    console.log(userId)
    // Insert stuff into our database
    // db.none('insert into news(title,body,userid) VALUES($1,$2,$3)', [title, description, userId])
    // db.none('insert into news(title,body,userid) VALUES($1,$2,$3)', [title, description, userId])
    //     .then(() => {
    //         res.redirect('/quoteSearch')
    //     })
});
*/
/*
app.get('/quoteSearch', (req, res) => {
  const query = 'Trump'; // Date parameter
  
  
   async function findSimilarQuotes() {
  
      const searchAddress = `https://quotes.rest/quote/search?&minlength=30&maxlength=800&query=${query}&private=false`

  const quoteResponse = await axios.get(`${searchAddress}`, 
  {headers: {
    "Accept": "application/json",
    "X-TheySaidSo-Api-Secret": "B_amwVnizcdaqfBbr1uboAeF"
  }})
  .then((quoteResponse) => {
      console.log(quoteResponse)
  })
  .catch((error) => {
      this.showErrors(error.response.data.error)
  })
  return quoteResponse;
  }
  findSimilarQuotes();
})
*/
// Listen for a specific port
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})