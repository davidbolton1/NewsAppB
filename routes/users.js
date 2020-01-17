const express = require('express')
const router = express.Router()
const mlSentiment = require('ml-sentiment')
const sentiment = mlSentiment({ lang: 'en' })



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
  let articles = await db.any('select articleid,title,body,emoji from articles')
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

  let itemsentiment = sentiment.classify(title);
  if (itemsentiment >= 5) {
    emoji = "😃";
  } else if (itemsentiment > 0) {
    emoji = "🙂";
  } else if (itemsentiment == 0) {
    emoji = "😐";
  } else {
    emoji = "😕";
  }
  db.none('insert into articles(title,body,userid, emoji) VALUES($1,$2,$3, $4)', [title, description, userId, emoji])
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
    db.any('select articleid,title,body,emoji from articles where userid = $1', [userId])
      .then((articles) => { 
          res.render('articles', {articles: articles})
      })
  
})

// Add a route for user favorites
router.get('/favorites', async (req, res) => {
  let usnewsarticles = await db.manyOrNone(`
  SELECT newsarticles.title, newsarticles.newsid, newsarticles.url, newsarticles.sentimentemoji, users.userid 
  FROM users, newsarticles, favorites
  WHERE users.userid=favorites.userid and newsarticles.newsid=favorites.articleid and users.userid=$1`, [req.session.user.userId])
  res.render('favorites', {usnewsarticles: usnewsarticles})

})

router.get('/favorites/add/:newsid', async (req, res) => {
  //console.log(req.params.newsid)
  //console.log(req.session.user.userId)
  db.none('insert into favorites(articleid, userid) VALUES($1,$2)', [req.params.newsid, req.session.user.userId])
  res.redirect('/topnews')
})

router.post('/delete-favorite-article', async (req,res) => {
  //let articleId = req.body.articleId
  let newsid = req.body.newsid
  console.log(newsid)

  await db.none('delete from favorites where articleid= $1', [newsid])
  res.redirect('/users/favorites')
})

module.exports = router