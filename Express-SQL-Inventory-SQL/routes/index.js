var express = require('express');
var router = express.Router();

// Controllers
var index_controller = require('../controllers/indexController')

/* GET home page. */
router.get('/', function(req, res, next) { 
  res.redirect('/movies');
});
// Get all movies
router.get('/movies', index_controller.get_all_movies);
// Get all generes 
router.get('/genres', index_controller.get_all_genres);
// Get all actors 
router.get('/actors', index_controller.get_all_actors);
// Get all directors
router.get('/directors', index_controller.get_all_directors)


// MOVIES 
// Create new movie
router.get('/movies/add', index_controller.get_add_movie);
router.post('/movies/add', index_controller.post_add_movie);
// Get individual movie 
router.get('/movies/:id', index_controller.get_one_movie);




// GENRES
// Get individual genre 
router.get('/genres/add', index_controller.get_add_genre);
// POST individual genre 
router.post('/genres/add', index_controller.post_add_genre);
// Get individual genre 
router.get('/genres/:id', index_controller.get_one_genre);



// ACTORS
// Get individual actor 
router.get('/actor/:id', index_controller.get_one_actor);




// DIRECTORS
// Add individual director 
router.get('/director/add', index_controller.get_add_one_director);
router.post('/director/add', index_controller.post_add_one_director);
// Get individual director 
router.get('/director/:id', index_controller.get_one_director);


module.exports = router;
