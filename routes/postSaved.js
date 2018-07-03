// Require our Article and comment models
var Article = require('../models/Article');

module.exports = function(req, res) {

  // Create mongoose model
  var Article = new Article({
    title: req.body.title,
    date: req.body.date,
    url: req.body.url
  });
  // Save data
  Article.save(function(err) {
    if (err) {
      // console.log(err);
      res.json({status: 'error'})
    } else {
      // console.log('Saved');
      res.json({status: 'saved'})
    }
  });
  
}