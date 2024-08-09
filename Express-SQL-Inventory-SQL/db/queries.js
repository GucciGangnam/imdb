const pool = require("./pool");
// NON API FUNCTIONS 
// Format date 
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
}
// API FUNCTIONS 
//MOVIES 
// Get all 
async function getAllMovies() {
    const { rows } = await pool.query("SELECT * FROM movies")
    return rows;
}
// Get one 
async function getOneMovie(movieId) {
    try {
        const result = await pool.query(
            `SELECT 
                m.ID, m.Title, m.Release_Year, m.Synopsis, 
                g.Name AS Genre, 
                d.First_Name AS Director_First_Name, d.Last_Name AS Director_Last_Name,
                json_agg(
                    json_build_object(
                        'Actor_ID', a.ID,
                        'First_Name', a.First_Name,
                        'Last_Name', a.Last_Name,
                        'Role', c.Role
                    )
                ) AS Cast
             FROM Movies m
             JOIN Genres g ON m.Genre_ID = g.ID
             JOIN Directors d ON m.Director_ID = d.ID
             LEFT JOIN Characters c ON m.ID = c.Movie_ID
             LEFT JOIN Actors a ON c.Actor_ID = a.ID
             WHERE m.ID = $1
             GROUP BY m.ID, g.Name, d.First_Name, d.Last_Name`,
            [movieId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}
// Create one 
async function createNewMovieOptions() {
    try {
        // Get genres
        const genresResult = await pool.query(`
            SELECT DISTINCT g.ID, g.Name 
            FROM Genres g
        `);

        // Get directors
        const directorsResult = await pool.query(`
            SELECT DISTINCT d.ID, d.First_Name, d.Last_Name 
            FROM Directors d
        `);

        return {
            genres: genresResult.rows,
            directors: directorsResult.rows
        };
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}

async function createOneMovie(title, year, genre, director, synopsis) {
    try {
        // Sanitize the title
        title = title.trim().toLowerCase();
        title = title.charAt(0).toUpperCase() + title.slice(1);

        // Check if the movie already exists
        const checkResult = await pool.query(
            'SELECT * FROM Movies WHERE title = $1 AND release_year = $2',
            [title, year]
        );
        if (checkResult.rows.length > 0) {
            return { success: false, error: "That movie already exists" };
        }

        // Insert the new movie and get the ID of the new movie
        const insertResult = await pool.query(
            'INSERT INTO Movies (title, release_year, genre_id, director_id, synopsis) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [title, year, genre, director, synopsis]
        );

        const movieId = insertResult.rows[0].id;
        return { success: true, movieId: movieId, message: "Movie added successfully" };
    } catch (err) {
        console.error('Error executing query', err.stack);
        return { success: false, error: "An error occurred while adding the movie" };
    }
}


// Genres
// Get all 
async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM Genres ORDER BY Name ASC")
    return rows;
}
// Get one 
async function getOneGenre(genreId) {
    try {
        const result = await pool.query(
            `SELECT 
                g.Name AS Genre, 
                json_agg(
                    json_build_object(
                        'Movie_ID', m.ID,
                        'Title', m.Title,
                        'Release_Year', m.Release_Year
                    )
                ) AS Movies
             FROM Genres g
             LEFT JOIN Movies m ON g.ID = m.Genre_ID
             WHERE g.ID = $1
             GROUP BY g.Name`,
            [genreId]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}
// Create one 
async function createNewGenre(name) {
    // Sanitize the input
    name = name.trim().toLowerCase().replace(/[0-9]/g, '');
    name = name.charAt(0).toUpperCase() + name.slice(1);

    try {
        // Check if the genre already exists
        const checkResult = await pool.query('SELECT * FROM Genres WHERE Name = $1', [name]);
        if (checkResult.rows.length > 0) {
            return { success: false, error: "That genre already exists" };
        }

        // Insert the new genre
        await pool.query('INSERT INTO Genres (Name) VALUES ($1)', [name]);
        return { success: true, message: "Genre added successfully" };
    } catch (err) {
        console.error('Error executing query', err.stack);
        return { success: false, error: "An error occurred while adding the genre" };
    }
}



// Actors
async function getAllActors() {
    const { rows } = await pool.query("SELECT * FROM Actors ORDER BY last_name ASC")
    return rows;
}
// Get one 
async function getOneActor(actorId) {
    try {
        const result = await pool.query(
            `SELECT 
                a.ID AS Actor_ID, 
                a.First_Name, 
                a.Last_Name,
                a.Birthday,
                a.Gender,
                a.Biography,
                json_agg(
                    json_build_object(
                        'Movie_ID', m.ID,
                        'Title', m.Title,
                        'Release_Year', m.Release_Year,
                        'Role', c.Role
                    )
                ) AS Movies
             FROM Actors a
             LEFT JOIN Characters c ON a.ID = c.Actor_ID
             LEFT JOIN Movies m ON c.Movie_ID = m.ID
             WHERE a.ID = $1
             GROUP BY a.ID, a.First_Name, a.Last_Name, a.Birthday, a.Gender, a.Biography`,
            [actorId]
        );
        // Format the birthday
        const actor = result.rows[0];
        if (actor && actor.birthday) {
            actor.birthday = formatDate(actor.birthday);
        }
        return actor;
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}


// Directors
// Get all
async function getAllDirectors() {
    const { rows } = await pool.query("SELECT * FROM Directors ORDER BY last_name ASC");
    return rows;
}
// Get one 
async function getOneDirector(directorId) {
    try {
        const result = await pool.query(
            `SELECT 
                d.ID AS Director_ID, 
                d.First_Name, 
                d.Last_Name,
                d.Birthday,
                d.Biography,
                json_agg(
                    json_build_object(
                        'Movie_ID', m.ID,
                        'Title', m.Title,
                        'Release_Year', m.Release_Year,
                        'Synopsis', m.Synopsis,
                        'Genre', g.Name
                    )
                ) AS Movies
             FROM Directors d
             LEFT JOIN Movies m ON d.ID = m.Director_ID
             LEFT JOIN Genres g ON m.Genre_ID = g.ID
             WHERE d.ID = $1
             GROUP BY d.ID, d.First_Name, d.Last_Name, d.Birthday, d.Biography`,
            [directorId]
        );
        // Format the birthday
        const director = result.rows[0];
        if (director && director.birthday) {
            director.birthday = formatDate(director.birthday);
        }
        return director;
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}
// Create one 
async function addOneDirector(firstName, lastName, birthday) {
    // Sanitize the input
    firstName = firstName.trim().toLowerCase().replace(/[0-9]/g, '');
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    lastName = lastName.trim().toLowerCase().replace(/[0-9]/g, '');
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

    try {
        // Check if the director already exists with the same first name, last name, and birthday
        const checkResult = await pool.query(
            'SELECT * FROM Directors WHERE first_name = $1 AND last_name = $2 AND birthday = $3',
            [firstName, lastName, birthday]
        );
        if (checkResult.rows.length > 0) {
            return { success: false, error: "That director already exists" };
        }
        // Insert the new director
        await pool.query(
            'INSERT INTO Directors (first_name, last_name, birthday) VALUES ($1, $2, $3)',
            [firstName, lastName, birthday]
        );
        return { success: true, message: "Director added successfully" };
    } catch (err) {
        console.error('Error executing query', err.stack);
        return { success: false, error: "An error occurred while adding the director" };
    }
}




















module.exports = {
    getAllMovies,
    getAllGenres,
    getAllActors,
    getAllDirectors,
    getOneMovie,
    getOneGenre,
    getOneActor,
    getOneDirector,
    createNewMovieOptions,
    createNewGenre,
    addOneDirector,
    createOneMovie
}