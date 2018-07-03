// Require our Article and comment models
var Article = require('../models/Article');

module.exports = function(req, res) {
  Article
    .find()
    .exec(function(err,data) {
      if (err) {
      // console.log(err);
      res.json({status: 'error'})
    } else {
      // console.log(data);
      res.json(data)
    }
  })
}