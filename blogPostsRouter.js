//tells app to use express
const express = require("express");

const router = express.Router();

//Q: WHAT IS THIS DOING?
const { BlogPosts } = require("./models");


//just use "/" as endpoint because?
//also, where does "router" come from? Why don't we call it "app"?
//the following get request is supposed to find blog posts and populate them with author info
//author info is imported from where?
router.get("/", (req, res) => {
  BlogPosts.find()
    .populate('author')
    .then(blogposts => {
      res.json({
        blogposts: blogposts.map(blogposts => blogposts.serialize())
      });
    })
    .catch(err => {
      //specific error for developer in console
      console.log(err);
      //error in browser for user
      res.status(500).json({ message: "Something bad happened" });
    });
});

//gets blog posts by id number...
router.get("/:id", (req, res) => {
 
 //want to add comments to one specific post, selected by id number
  BlogPosts.update(
  .findOne({
    _id: '5af50ff5c082f1e92f834265'
  {
    $push: {
      {
      "title": "some title",
      "content": "a bunch of amazing words",
      "author": "Sarah Clarke",
      "created": "1481322758429",
      "comments": [
          { "content": "Here is a first comment." },
          { "content": "Here is a second comment." },
          { "content": "Here is a third comment." }
      ]
  })

});

//checks to see if user entered all required fields
router.post("/authors", (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  });

  author
    .findOne({ userName: req.body.userName })
    .then(author => {
      if (author) {
        const message = `username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        author.create({
          firstName: rq.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.username
        })
        .then(author => res.status(201).json({
          _id: author.id,
          name: `${author.firstName} ${author.lastName}`,
          userName: author.username
        }))
       .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something bad happened'});
       }); 
      };
    });

router.put('authors/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)){
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updatedFields = ['firstName', 'lastName', 'userName'];
  updatedFields.forEach(field => {
    if (field in req.body){
      updated[field] = req.body[field];
    }
  });
//how do I know to use Author or Author?
  author
    .findOne({ username: updated.username || '', _id: { $ne: req.params.id } })
    .then(author => {
      if(author) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        author
          .findBuIdAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedAuthor => {
            res.status(200).json({
              id: updatedAuthor.id,
              name: `${updatedAuthor.firstName} ${updatedAuthor.lastName}`,
              userName: updatedAuthor,userName
            })
          })
          .catch(err => res.status(500).json({ message: err}));
      }
    });
});

router.delete('/:id', (req, res) => {
  BlogPosts.remove({ req.params.id })
  .then(() => {
    author
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted blog posts owned by and author with id \`${req.params.id}\``);
        res.status(204).json({ message: 'success '});
      });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'something bad happened'});
  });
});



// add endpoint for POST requests, which should cause a new
// blog post to be added (using `BlogPosts.create()`). It should
// return a JSON object representing the new post (including
// the id, which `BlogPosts` will create. This endpoint should
// send a 400 error if the post doesn't contain
// `title`, `content`, and `author`
/* router.post("/", (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  //???? there are 3 kets in this const, but below in requiredField are 5?
  const item = BlogPosts.create(
    req.body.title,
    req.body.content,
    req.body.author
  );

  res.status(201).json(item);
});

// add endpoint for PUT requests to update blogposts. it should
// call `BlogPosts.update()` and return the updated post.
// it should also ensure that the id in the object representing
// the post matches the id of the path variable, and that the
// following required fields are in request body: `id`, `title`,
// `content`, `author`, `publishDate`
router.put("/:id", (req, res) => {
  const requiredFields = ["id", "title", "content", "author", "publishDate"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${
      req.params.id
    }) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

// add endpoint for DELETE requests. These requests should
// have an id as a URL path variable and call
// `BlogPosts.delete()`
router.delete("/:id", (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post with id \`${req.params.ID}\``);
  res.status(204).end();
});
*/
module.exports = router;