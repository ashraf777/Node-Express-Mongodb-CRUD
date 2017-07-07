const express = require('express');
const router = express.Router();
// Bring in Models
let Article = require('../models/article');
let User = require('../models/user');
// Get all Articles
router.get('/all', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else{
      res.render('articles', {
        title: 'All Articles',
        articles: articles
      });
    }
  });
});
// Article Add Form
router.get('/addArticles', checkAuth, function(req, res){
      res.render('addArticle', {
        title: 'Add Articles'
      });
});
// Route for saving new article
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is requred').notEmpty();
  // req.checkBody('author', 'Author is requred').notEmpty();
  req.checkBody('title', 'Body is requred').notEmpty();
  // Get Error
  let errors = req.validationErrors();

  if(errors){
    res.render('addArticle', {
      title: 'Add Articles',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        res.redirect('/articles/all');
      }
    });
  }
});
// Load edit Form
router.get('/edit/:id', checkAuth, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('denger', 'Not Authorized');
      res.redirect('/')
    }
    res.render('editArticle', {
      title: 'Edit Article',
      article: article
    });
  });
});
// Edit Submitted New Article
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated')
      res.redirect('/articles/all');
    }
  });
});
// Route for performing ajax delete request
router.delete('/:id', checkAuth, function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});
// single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('detailArticle', {
        article: article,
        author:user.name
      });
    });
  });
});

// Acces control
function checkAuth(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('denger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
