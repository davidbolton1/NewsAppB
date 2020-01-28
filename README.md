# MY NEWS STAND (mynewsstand.net)

### Description

My News Stand is a program that lets the user create, save, and share their favorite news articles. 
A frequent problem people face is being bombarded by a single news source or being unable to find articles that they would either like to reread or show others. My News Stand hopes to aliviate to issue of limited resources to find informative pages and use them later. It can also be used as a news comparison, making bias or misinformation more apparent.

The application is made in Bootstrap/CSS, Mustache, Javascript, HTML, Express, and Node.
Javascript, Express, and Node are the backend while Bootstrap/CSS, Mustache, and HTML are front end.

### Prerequisites
```
- Express
- Mustache-Express
- Body-Parser
- Bcrypt
- Dotenv
- Axios
- Bootstrap
- Node
- mlSentiment
```

In the terminal, "npm i (Insert software name here. No capitalization)" for all prerequsites except bootstrap.
Make sure in the /views/partials/header.mustache file, the following HTML and links are present so that the program can run bootstrap and any other styling elements:
<!-- <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great&display=swap" rel="stylesheet">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/styles.css"></link> -->

### APIs Used:
- https://newsapi.org/: Where we pull the news articles to appear on the site

### Future Possible Features:
- Search bar to quickly find certain topics.
- Have the Top News page react and change in real time to news updates
- Yodify
- A "Trust/Prefered" rating for news authors and hosts that present the articles.

### Created By:
David Bolton
Veronica Kemp



