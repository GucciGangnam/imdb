// IMPORTS 
const db = require("../db/queries");

// CONTROLLS 
// GET ALL MOVIES 
exports.get_all_movies = async (req, res, next) => {
    console.log("getting all movies");
    const movies = await db.getAllMovies();
    console.log(movies)
    res.render('index', { title: "Incomplete Movie DataBase - All movies", movies: movies });
}

exports.get_all_genres = async (req, res, next) => {
    console.log('getting all generes');
    const genres = await db.getAllGenres();
    res.render('genres', { title: "Incomplete Movie DataBase - All genres", genres: genres })
}

exports.get_all_actors = async (req, res, next) => {
    console.log("getting all actors");
    const actors = await db.getAllActors();
    res.render('actors', { title: "Incomplete Movie DataBase - All actors", actors: actors })
}

exports.get_all_directors = async (req, res, next) => {
    console.log(' Getting all directors');
    const directors = await db.getAllDirectors();
    console.log(directors)
    res.render('directors', { title: "Incomplete Movie DataBase - All directors", directors: directors })
}


// GET ONE MOVIE 
exports.get_one_movie = async (req, res, next) => {
    console.log(req.params.id);
    const result = await db.getOneMovie(req.params.id);
    console.log(result);
    res.render('singleMovie', { title: result.title, movie: result })
    return
}
// ADD MOVIE
exports.get_add_movie = async (req, res, next) => {
    console.log("add new mopvie here");
    const options = await db.createNewMovieOptions();
    console.log(options)
    res.render('addMovie', {options: options});
}












// Get ONE GENRE 
exports.get_one_genre = async (req, res, next) => {
    console.log("getting genre by ID")
    const result = await db.getOneGenre(req.params.id);
    console.log(result);
    res.render('singleGenre', { title: result.genre, genre: result })
    return;
}
// ADD GENRE 
exports.get_add_genre = async (req, res, next) => { 
    const genres = await db.getAllGenres();
    console.log(genres)
    res.render('addGenre',{genres: genres});
}
exports.post_add_genre = async (req, res, next) => {
    const genreName = req.body.name;
    const result = await db.createNewGenre(genreName);

    if (result.success) {
        res.redirect('/genres');
    } else {
        const genres = await db.getAllGenres();
        console.log(genres)
        res.render('addGenre',{genres: genres, error: result.error});
    }
};






// GET ONE ACTOR
exports.get_one_actor = async (req, res, next) => {
    console.log("getting actor by ID");
    const result = await db.getOneActor(req.params.id);
    console.log(result);
    res.render('singleActor', { actor: result })

}


// GET ONE DIRECTOR 
exports.get_one_director = async (req, res, next) => {
    console.log("getting director by id");
    const result = await db.getOneDirector(req.params.id);
    console.log(result);
    res.render('singleDirector', { director: result })
}
