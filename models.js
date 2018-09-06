
const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({ 
  content: 'string' 
});

//why don't we just do [authorSchema] for author like we did [commentSchema] for comments?
const BlogPostsSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [commentSchema]
});

//?
BlogPostsSchema.virtual("fullName").get(function(){
  return `${this.author.firstName} ${this.author.lastName}`;
});

//pre-hook tells code to grab author object and put it in the blog post
BlogPostsSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

BlogPostsSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

BlogPostsSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.fullName
  }
}


const Author = mongoose.model('Author', authorSchema);

const BlogPosts = mongoose.model("BlogPosts", BlogPostsSchema);

module.exports = { BlogPosts, Author };