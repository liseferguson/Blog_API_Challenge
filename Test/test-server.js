const chai = require('chai');
const chaiHttp = require('chai-http');

//the solution doesn't have this, but uses expect instead of should
const should = chai.should();

const { app, runServer, closeServer } = require('../server');


chai.use(chaiHttp);

describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

   it('should retrieve blog posts on GET', function() {
    // since we're returning `chai.request.get.then...`
    // we don't need a `done` call back
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.length.of.at.least(1);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys('id','title', 'content', 'author', 'publishDate');
        });
      });
  	});

	it('should add a blog entry on POST', function() {
    	const newBlogPost = {
        	title: 'title', 
        	content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 
        	author: 'authorName'
	};

    return chai.request(app)
      .post('/blog-posts')
      .send(newBlogPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys('id', 'title', 'content', 'author', 'publishDate');
        res.body.title.should.equal(newBlogPost.title);
        res.body.author.should.equal(newBlogPost.author);
        res.body.content.should.equal(newBlogPost.content);
        res.body.content.should.be.a('string');
      });
 	 });

  it('should update blog posts on PUT', function() {

    const updatePost = {
      title: 'updated title here',
      content: 'updated content here',
      author: 'updated author here'
    };

    return chai.request(app)
      // first have to get recipes so have `id` for one we
      // want to update. Note that once we're working with databases later
      // in this course get the `id` of an existing instance from the database,
      // which will allow us to isolate the PUT logic under test from our
      // GET interface.
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost)
      })
      .then(function(res) {
        res.should.have.status(204);
        //why 204? 204 is no content...
      });
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      // first have to get rblog posts so have `id` for one we want
      // to delete. Note that once we're working with databases later
      // in this course, we'll be able get the `id` of an existing instance
      // directly from the database, which will allow us to isolate the DELETE
      // logic under test from our GET interface
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});