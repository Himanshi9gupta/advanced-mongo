const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// curl http://localhost:5000/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5000/movies/573a1390f29313caabcd4135
// curl http://localhost:5000/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// curl http://localhost:5000/movies/000/comments
router.get("/:id/comments", async(req, res) => {
  const result = await movieData.getAllComments(req.params.id)
  res.status(200).send(result);
})

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5000/movies
router.post("/", async (req, res, next) => {
  let resultStatus;
  let result = await movieData.create(req.body);

  if (!result) {
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(200).send(result);
    }
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Cinephile Cyprus", "text":"Wow!"}' http://localhost:5000/movies/000/comments
router.post("/:id/comments", async(req, res) => {
  const result = await movieData.createComment(req.params.id, req.body)
  res.status(200).send(result);
})

// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5000/movies/573a13a3f29313caabd0e77b
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)
  if (!result) {
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    if(result.error){
      res.status(400).send(result);
    } else {
      res.status(200).send(result);
    }
  }
});

// curl -X DELETE http://localhost:5000/movies/573a1390f29313caabcd4135
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);
  if (!result) {
    res.status(500).send({error: "Something went wrong. Please try again."});
  } else {
    if (result.error) {
      res.status(400).send(result);
    } else {
      res.status(200).send(result);
    }
  }
});

// curl -X DELETE http://localhost:5000/movies/000/comments/000
// router.delete("/:movieId/comments", async(req, res)=>{
//   const result = await movieData.deleteCommentById(req.params.commentId)
//   res.status(200).send(result);
// })

router.get("/genres/:genreName", async (req, res, next) => {
  const result = await movieData.getMoviesByGenre(req.params.genreName);
  if (result) {
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      res.status(404).send({error: `No movie found with this genre: ${req.params.genreName}`});
    }
  } else {
    res.status(500).send({error:"Something went wrong. Please try again."})
  }
});

module.exports = router;
