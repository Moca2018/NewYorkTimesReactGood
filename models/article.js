// require mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//New Schema
const articleSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  url: { type: String, required:true },
});

// use the above schema to make the SavedArticle model
const Article = mongoose.model("Article", articleSchema);

// export the model so the server can use it
module.exports = Article;

