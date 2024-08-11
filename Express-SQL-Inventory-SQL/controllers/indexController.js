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
    res.render('addMovie', { options: options });
}
exports.post_add_movie = async (req, res, next) => {
    console.log("posting new movie");
    const title = req.body.title;
    const release_year = req.body.release_year;
    const synopsis = req.body.synopsis;
    const genre = req.body.genre;
    const director = req.body.director;
    console.log(title);
    console.log(release_year)
    console.log(genre);
    console.log(director);
    console.log(synopsis);
    if (genre === 'new') {
        console.log(req.body.new_genre);
        const genreResult = await db.createNewGenre(req.body.new_genre);
        if (!genreResult.success) {
            const options = await db.createNewMovieOptions();
            const genres = await db.getAllGenres();
            return res.render('addMovie', { genres, options, error: genreResult.error });
        }
    }
    // Create the new movie
    const result = await db.createOneMovie(title, release_year, genre, director, synopsis);

    if (result.success) {
        res.redirect(`/movies/${result.movieId}`);
        return;
    } else {
        const options = await db.createNewMovieOptions();
        const genres = await db.getAllGenres();
        return res.render('addMovie', { genres, options, error: result.error });
    }
};












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
    res.render('addGenre', { genres: genres });
}
exports.post_add_genre = async (req, res, next) => {
    const genreName = req.body.name;
    const result = await db.createNewGenre(genreName);

    if (result.success) {
        res.redirect('/genres');
    } else {
        const genres = await db.getAllGenres();
        console.log(genres)
        res.render('addGenre', { genres: genres, error: result.error });
    }
};






// GET ONE ACTOR
exports.get_one_actor = async (req, res, next) => {
    console.log("getting actor by ID");
    const result = await db.getOneActor(req.params.id);
    console.log(result);
    res.render('singleActor', { actor: result })
}

exports.get_add_one_actor = async (req, res, next) => {
    console.log("getting one actor");
    res.render('addActor');
}
exports.post_add_one_actor = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const birthday = req.body.birthday;
    const biography = req.body.biography;

    console.log(firstName, lastName, gender, birthday, biography);
    const result = await db.addOneActor(firstName, lastName, gender, birthday, biography);

    if (!result.success) {
        console.log("FAIL");
        console.log(result.error);
        res.render('addActor', { error: result.error }); // Ensure `error` is correctly passed
    } else {
        console.log("SUCCESS");
        res.redirect('/actors');
    }
}


// GET ONE DIRECTOR 
exports.get_one_director = async (req, res, next) => {
    console.log("getting director by id");
    const result = await db.getOneDirector(req.params.id);
    console.log(result);
    res.render('singleDirector', { director: result })
}

// ADD ONE DIRECTOR 
exports.get_add_one_director = async (req, res, next) => {
    res.render("addDirector");
    return;
}
exports.post_add_one_director = async (req, res, next) => {
    console.log('Adding director')
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthday = req.body.birthday;
    console.log(firstName, lastName, birthday);
    const result = await db.addOneDirector(firstName, lastName, birthday);
    if (result.success) {
        res.redirect('/directors');
        return;
    } else {
        const directors = await db.getAllDirectors();
        console.log(" Im aq big fat cock sucker")
        console.log(result.error);
        console.log(directors)
        res.render('addDirector', { directors: directors, error: result.error });
        return;
    }
}

// ADD ONE CHARACTER 
exports.get_add_one_character = async (req, res, next) => {
    console.log("adding 1 character page")
    console.log(req.params.id)
    const result = await db.getOneMovie(req.params.id);
    const actors = await db.getAllActors();
    console.log(actors);
    res.render("addCharacter", { movie: result, actors: actors });
    return;
}

exports.post_add_one_character = async (req, res, next) => {
    const movieID = req.params.id; // Get movie ID from route parameters
    const characterName = req.body.characterName; // Get character name from the request body
    const actorID = req.body.actor; // Get actor ID from the request body

    try {
        // Add character to the database
        const response = await db.addCharacter(movieID, actorID, characterName);

        // Check if the operation was successful
        if (response.success) {
            // Redirect to the specific movie page
            res.redirect(`/movies/${movieID}`);
        } else {
            // Handle failure scenario
            res.render('addCharacter', { movie: { id: movieID }, error: response.error, actors: await db.getAllActors() });
        }
    } catch (err) {
        // Log error and render error page
        console.error("Error adding character", err.stack);
        res.render('addCharacter', { movie: { id: movieID }, error: 'Unexpected error occurred', actors: await db.getAllActors() });
    }
}