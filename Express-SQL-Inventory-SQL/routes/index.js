var express = require('express');
var router = express.Router();

// Controllers
var index_controller = require('../controllers/indexController')

/* GET home page. */
router.get('/', index_controller.get_all_movies);

module.exports = router;
