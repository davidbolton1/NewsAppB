const express = require('express')
const router = express.Router()


/*
router.post('/delete-article', (req,res) => {
  let articleId = req.body.articleId
  // Delete article
  db.none('delete from articles where articleid = $1', [articleId])
  .then(() => {
      // Redirect user to article page
      res.redirect('/users/articles')
  })
})
*/
// async version
router.post('/delete-article', async (req,res) => {
  let articleId = req.body.articleId

  await db.none('delete from articles where articleid = $1', [articleId])
  res.redirect('/users/articles')
})


router.get('/all-stuff', async (req, res) => {
  let articles = await db.any('select articleid,title,body from articles')
  res.render('all-stuff', {articles: articles})
})



router.get('/add-stuff', (req, res) => {
res.render('add-stuff')
});

//Add a post route to the add stuff
router.post('/add-stuff', (req, res) => {
  let title = req.body.title
  let description = req.body.description
  let userId = req.session.user.userId
  // Insert stuff into our database
  db.none('insert into articles(title,body,userid) VALUES($1,$2,$3)', [title, description, userId])
      .then(() => {
          res.redirect('/users/articles')
      })
});


// Add a post route to the article edit page
router.post('/update-article', (req, res) => {
    
  let title = req.body.title
  let description = req.body.description
  let articleId = req.body.articleId
  // Set the article in the DB to what is submitted in the edit field
  db.none('update articles set title = $1, body = $2 where articleid = $3', [title, description, articleId])
  .then(() => {
      res.redirect('/users/articles')
  })
})

// Add a route for the article edit page
router.get('/articles/edit/:articleId', (req, res) => {
  // reference the parameter to get the article id
  let articleId = req.params.articleId
  db.one('select articleid,title,body from articles where articleid = $1', [articleId])
  .then((article) => {
      //Send it to a new page to edit the article
      res.render('edit-article', article)
  })
})

//Add a route to articles page
router.get('/articles', (req, res) => {
  // If a user is logged in, show their articles
     let userId = req.session.user.userId
   //let userId = 8
   // Show articles for a user
     db.any('select articleid,title,body from articles where userid = $1', [userId])
      .then((articles) => { 
          res.render('articles', {articles: articles})
      })
  
})


module.exports = router