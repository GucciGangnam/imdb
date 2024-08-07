// IMPORTS 
const db = require("../db/queries");

// CONTROLLS 
// GET ALL MOVIES 
exports.get_all_movies = async (req, res, next) => { 
    console.log("getting all movies");
    const movies = await db.getAllMovies();
    console.log(movies)
    res.render('index', { title: "Incomplete Movies Database", movies: movies });
}
